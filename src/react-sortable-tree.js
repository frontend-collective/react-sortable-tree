import withScrolling, {
  createHorizontalStrength,
  createScrollingComponent,
  createVerticalStrength,
} from 'frontend-collective-react-dnd-scrollzone';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DndContext, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { polyfill } from 'react-lifecycles-compat';
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css';
import NodeRendererDefault from './node-renderer-default';
import PlaceholderRendererDefault from './placeholder-renderer-default';
import './react-sortable-tree.css';
import TreeNode from './tree-node';
import TreePlaceholder from './tree-placeholder';
import classnames from './utils/classnames';
import {
  defaultGetNodeKey,
  defaultSearchMethod,
} from './utils/default-handlers';
import DndManager from './utils/dnd-manager';
import { slideRows } from './utils/generic-utils';
import {
  memoizedGetDescendantCount,
  memoizedGetFlatDataFromTree,
  memoizedInsertNode,
} from './utils/memoized-tree-data-utils';
import {
  changeNodeAtPath,
  find,
  insertNode,
  removeNode,
  toggleExpandedForAll,
  walk,
} from './utils/tree-data-utils';

let treeIdCounter = 1;

const mergeTheme = props => {
  const merged = {
    ...props,
    style: { ...props.theme.style, ...props.style },
    innerStyle: { ...props.theme.innerStyle, ...props.innerStyle },
    reactVirtualizedListProps: {
      ...props.theme.reactVirtualizedListProps,
      ...props.reactVirtualizedListProps,
    },
  };

  const overridableDefaults = {
    nodeContentRenderer: NodeRendererDefault,
    placeholderRenderer: PlaceholderRendererDefault,
    rowHeight: 62,
    scaffoldBlockPxWidth: 44,
    slideRegionSize: 100,
    treeNodeRenderer: TreeNode,
  };
  Object.keys(overridableDefaults).forEach(propKey => {
    // If prop has been specified, do not change it
    // If prop is specified in theme, use the theme setting
    // If all else fails, fall back to the default
    if (props[propKey] === null) {
      merged[propKey] =
        typeof props.theme[propKey] !== 'undefined'
          ? props.theme[propKey]
          : overridableDefaults[propKey];
    }
  });

  return merged;
};

class ReactSortableTree extends Component {
  constructor(props) {
    super(props);

    const {
      dndType,
      nodeContentRenderer,
      treeNodeRenderer,
      isVirtualized,
      slideRegionSize,
    } = mergeTheme(props);

    this.dndManager = new DndManager(this);

    // Wrapping classes for use with react-dnd
    this.treeId = `rst__${treeIdCounter}`;
    treeIdCounter += 1;
    this.dndType = dndType || this.treeId;
    this.nodeContentRenderer = this.dndManager.wrapSource(nodeContentRenderer);
    this.treePlaceholderRenderer = this.dndManager.wrapPlaceholder(
      TreePlaceholder
    );
    this.treeNodeRenderer = this.dndManager.wrapTarget(treeNodeRenderer);

    // Prepare scroll-on-drag options for this list
    if (isVirtualized) {
      this.scrollZoneVirtualList = (createScrollingComponent || withScrolling)(
        List
      );
      this.vStrength = createVerticalStrength(slideRegionSize);
      this.hStrength = createHorizontalStrength(slideRegionSize);
    }

    this.state = {
      draggingTreeData: null,
      draggedNode: null,
      draggedMinimumTreeIndex: null,
      draggedDepth: null,
      searchMatches: [],
      searchFocusTreeIndex: null,
      dragging: false,

      // props that need to be used in gDSFP or static functions will be stored here
      instanceProps: {
        treeData: [],
        ignoreOneTreeUpdate: false,
        searchQuery: null,
        searchFocusOffset: null,
      },
    };

    this.toggleChildrenVisibility = this.toggleChildrenVisibility.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.dragHover = this.dragHover.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.drop = this.drop.bind(this);
    this.handleDndMonitorChange = this.handleDndMonitorChange.bind(this);
  }

  componentDidMount() {
    ReactSortableTree.loadLazyChildren(this.props, this.state);
    const stateUpdate = ReactSortableTree.search(
      this.props,
      this.state,
      true,
      true,
      false
    );
    this.setState(stateUpdate);

    // Hook into react-dnd state changes to detect when the drag ends
    // TODO: This is very brittle, so it needs to be replaced if react-dnd
    // offers a more official way to detect when a drag ends
    this.clearMonitorSubscription = this.props.dragDropManager
      .getMonitor()
      .subscribeToStateChange(this.handleDndMonitorChange);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { instanceProps } = prevState;
    const newState = {};

    const isTreeDataEqual = isEqual(instanceProps.treeData, nextProps.treeData);

    // make sure we have the most recent version of treeData
    instanceProps.treeData = nextProps.treeData;

    if (!isTreeDataEqual) {
      if (instanceProps.ignoreOneTreeUpdate) {
        instanceProps.ignoreOneTreeUpdate = false;
      } else {
        newState.searchFocusTreeIndex = null;
        ReactSortableTree.loadLazyChildren(nextProps, prevState);
        Object.assign(
          newState,
          ReactSortableTree.search(nextProps, prevState, false, false, false)
        );
      }

      newState.draggingTreeData = null;
      newState.draggedNode = null;
      newState.draggedMinimumTreeIndex = null;
      newState.draggedDepth = null;
      newState.dragging = false;
    } else if (!isEqual(instanceProps.searchQuery, nextProps.searchQuery)) {
      Object.assign(
        newState,
        ReactSortableTree.search(nextProps, prevState, true, true, false)
      );
    } else if (
      instanceProps.searchFocusOffset !== nextProps.searchFocusOffset
    ) {
      Object.assign(
        newState,
        ReactSortableTree.search(nextProps, prevState, true, true, true)
      );
    }

    instanceProps.searchQuery = nextProps.searchQuery;
    instanceProps.searchFocusOffset = nextProps.searchFocusOffset;
    newState.instanceProps = {...instanceProps, ...newState.instanceProps };
 
    return newState;
  }

  // listen to dragging
  componentDidUpdate(prevProps, prevState) {
    // if it is not the same then call the onDragStateChanged
    if (this.state.dragging !== prevState.dragging) {
      if (this.props.onDragStateChanged) {
        this.props.onDragStateChanged({
          isDragging: this.state.dragging,
          draggedNode: this.state.draggedNode,
        });
      }
    }
  }

  componentWillUnmount() {
    this.clearMonitorSubscription();
  }

  getRows(treeData) {
    return memoizedGetFlatDataFromTree({
      ignoreCollapsed: true,
      getNodeKey: this.props.getNodeKey,
      treeData,
    });
  }

  handleDndMonitorChange() {
    const monitor = this.props.dragDropManager.getMonitor();
    // If the drag ends and the tree is still in a mid-drag state,
    // it means that the drag was canceled or the dragSource dropped
    // elsewhere, and we should reset the state of this tree
    if (!monitor.isDragging() && this.state.draggingTreeData) {
      setTimeout(() => {this.endDrag()});
    }
  }

  toggleChildrenVisibility({ node: targetNode, path }) {
    const { instanceProps } = this.state;

    const treeData = changeNodeAtPath({
      treeData: instanceProps.treeData,
      path,
      newNode: ({ node }) => ({ ...node, expanded: !node.expanded }),
      getNodeKey: this.props.getNodeKey,
    });

    this.props.onChange(treeData);

    this.props.onVisibilityToggle({
      treeData,
      node: targetNode,
      expanded: !targetNode.expanded,
      path,
    });
  }

  moveNode({
    node,
    path: prevPath,
    treeIndex: prevTreeIndex,
    depth,
    minimumTreeIndex,
  }) {
    const {
      treeData,
      treeIndex,
      path,
      parentNode: nextParentNode,
    } = insertNode({
      treeData: this.state.draggingTreeData,
      newNode: node,
      depth,
      minimumTreeIndex,
      expandParent: true,
      getNodeKey: this.props.getNodeKey,
    });

    this.props.onChange(treeData);

    this.props.onMoveNode({
      treeData,
      node,
      treeIndex,
      path,
      nextPath: path,
      nextTreeIndex: treeIndex,
      prevPath,
      prevTreeIndex,
      nextParentNode,
    });
  }

  // returns the new state after search
  static search(props, state, seekIndex, expand, singleSearch) {
    const {
      onChange,
      getNodeKey,
      searchFinishCallback,
      searchQuery,
      searchMethod,
      searchFocusOffset,
      onlyExpandSearchedNodes,
    } = props;

    const { instanceProps } = state;

    // Skip search if no conditions are specified
    if (!searchQuery && !searchMethod) {
      if (searchFinishCallback) {
        searchFinishCallback([]);
      }

      return { searchMatches: [] };
    }

    const newState = { instanceProps: {} };

    // if onlyExpandSearchedNodes collapse the tree and search
    const { treeData: expandedTreeData, matches: searchMatches } = find({
      getNodeKey,
      treeData: onlyExpandSearchedNodes
        ? toggleExpandedForAll({
            treeData: instanceProps.treeData,
            expanded: false,
          })
        : instanceProps.treeData,
      searchQuery,
      searchMethod: searchMethod || defaultSearchMethod,
      searchFocusOffset,
      expandAllMatchPaths: expand && !singleSearch,
      expandFocusMatchPaths: !!expand,
    });

    // Update the tree with data leaving all paths leading to matching nodes open
    if (expand) {
      newState.instanceProps.ignoreOneTreeUpdate = true; // Prevents infinite loop
      onChange(expandedTreeData);
    }

    if (searchFinishCallback) {
      searchFinishCallback(searchMatches);
    }

    let searchFocusTreeIndex = null;
    if (
      seekIndex &&
      searchFocusOffset !== null &&
      searchFocusOffset < searchMatches.length
    ) {
      searchFocusTreeIndex = searchMatches[searchFocusOffset].treeIndex;
    }

    newState.searchMatches = searchMatches;
    newState.searchFocusTreeIndex = searchFocusTreeIndex;

    return newState;
  }

  startDrag({ path }) {
    this.setState(prevState => {
      const {
        treeData: draggingTreeData,
        node: draggedNode,
        treeIndex: draggedMinimumTreeIndex,
      } = removeNode({
        treeData: prevState.instanceProps.treeData,
        path,
        getNodeKey: this.props.getNodeKey,
      });

      return {
        draggingTreeData,
        draggedNode,
        draggedDepth: path.length - 1,
        draggedMinimumTreeIndex,
        dragging: true,
      };
    });
  }

  dragHover({
    node: draggedNode,
    depth: draggedDepth,
    minimumTreeIndex: draggedMinimumTreeIndex,
  }) {
    // Ignore this hover if it is at the same position as the last hover
    if (
      this.state.draggedDepth === draggedDepth &&
      this.state.draggedMinimumTreeIndex === draggedMinimumTreeIndex
    ) {
      return;
    }

    this.setState(({ draggingTreeData, instanceProps }) => {
      // Fall back to the tree data if something is being dragged in from
      //  an external element
      const newDraggingTreeData = draggingTreeData || instanceProps.treeData;

      const addedResult = memoizedInsertNode({
        treeData: newDraggingTreeData,
        newNode: draggedNode,
        depth: draggedDepth,
        minimumTreeIndex: draggedMinimumTreeIndex,
        expandParent: true,
        getNodeKey: this.props.getNodeKey,
      });

      const rows = this.getRows(addedResult.treeData);
      const expandedParentPath = rows[addedResult.treeIndex].path;

      return {
        draggedNode,
        draggedDepth,
        draggedMinimumTreeIndex,
        draggingTreeData: changeNodeAtPath({
          treeData: newDraggingTreeData,
          path: expandedParentPath.slice(0, -1),
          newNode: ({ node }) => ({ ...node, expanded: true }),
          getNodeKey: this.props.getNodeKey,
        }),
        // reset the scroll focus so it doesn't jump back
        // to a search result while dragging
        searchFocusTreeIndex: null,
        dragging: true,
      };
    });
  }

  endDrag(dropResult) {
    const { instanceProps } = this.state;

    const resetTree = () =>
      this.setState({
        draggingTreeData: null,
        draggedNode: null,
        draggedMinimumTreeIndex: null,
        draggedDepth: null,
        dragging: false,
      });

    // Drop was cancelled
    if (!dropResult) {
      resetTree();
    } else if (dropResult.treeId !== this.treeId) {
      // The node was dropped in an external drop target or tree
      const { node, path, treeIndex } = dropResult;
      let shouldCopy = this.props.shouldCopyOnOutsideDrop;
      if (typeof shouldCopy === 'function') {
        shouldCopy = shouldCopy({
          node,
          prevTreeIndex: treeIndex,
          prevPath: path,
        });
      }

      let treeData = this.state.draggingTreeData || instanceProps.treeData;

      // If copying is enabled, a drop outside leaves behind a copy in the
      //  source tree
      if (shouldCopy) {
        treeData = changeNodeAtPath({
          treeData: instanceProps.treeData, // use treeData unaltered by the drag operation
          path,
          newNode: ({ node: copyNode }) => ({ ...copyNode }), // create a shallow copy of the node
          getNodeKey: this.props.getNodeKey,
        });
      }

      this.props.onChange(treeData);

      this.props.onMoveNode({
        treeData,
        node,
        treeIndex: null,
        path: null,
        nextPath: null,
        nextTreeIndex: null,
        prevPath: path,
        prevTreeIndex: treeIndex,
      });
    }
  }

  drop(dropResult) {
    this.moveNode(dropResult);
  }

  canNodeHaveChildren(node) {
    const { canNodeHaveChildren } = this.props;
    if (canNodeHaveChildren) {
      return canNodeHaveChildren(node);
    }
    return true;
  }

  // Load any children in the tree that are given by a function
  // calls the onChange callback on the new treeData
  static loadLazyChildren(props, state) {
    const { instanceProps } = state;

    walk({
      treeData: instanceProps.treeData,
      getNodeKey: props.getNodeKey,
      callback: ({ node, path, lowerSiblingCounts, treeIndex }) => {
        // If the node has children defined by a function, and is either expanded
        //  or set to load even before expansion, run the function.
        if (
          node.children &&
          typeof node.children === 'function' &&
          (node.expanded || props.loadCollapsedLazyChildren)
        ) {
          // Call the children fetching function
          node.children({
            node,
            path,
            lowerSiblingCounts,
            treeIndex,

            // Provide a helper to append the new data when it is received
            done: childrenArray =>
              props.onChange(
                changeNodeAtPath({
                  treeData: instanceProps.treeData,
                  path,
                  newNode: ({ node: oldNode }) =>
                    // Only replace the old node if it's the one we set off to find children
                    //  for in the first place
                    oldNode === node
                      ? {
                          ...oldNode,
                          children: childrenArray,
                        }
                      : oldNode,
                  getNodeKey: props.getNodeKey,
                })
              ),
          });
        }
      },
    });
  }

  renderRow(
    row,
    { listIndex, style, getPrevRow, matchKeys, swapFrom, swapDepth, swapLength }
  ) {
    const { node, parentNode, path, lowerSiblingCounts, treeIndex } = row;

    const {
      canDrag,
      generateNodeProps,
      scaffoldBlockPxWidth,
      searchFocusOffset,
      rowDirection,
    } = mergeTheme(this.props);
    const TreeNodeRenderer = this.treeNodeRenderer;
    const NodeContentRenderer = this.nodeContentRenderer;
    const nodeKey = path[path.length - 1];
    const isSearchMatch = nodeKey in matchKeys;
    const isSearchFocus =
      isSearchMatch && matchKeys[nodeKey] === searchFocusOffset;
    const callbackParams = {
      node,
      parentNode,
      path,
      lowerSiblingCounts,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
    };
    const nodeProps = !generateNodeProps
      ? {}
      : generateNodeProps(callbackParams);
    const rowCanDrag =
      typeof canDrag !== 'function' ? canDrag : canDrag(callbackParams);

    const sharedProps = {
      treeIndex,
      scaffoldBlockPxWidth,
      node,
      path,
      treeId: this.treeId,
      rowDirection,
    };

    return (
      <TreeNodeRenderer
        style={style}
        key={nodeKey}
        listIndex={listIndex}
        getPrevRow={getPrevRow}
        lowerSiblingCounts={lowerSiblingCounts}
        swapFrom={swapFrom}
        swapLength={swapLength}
        swapDepth={swapDepth}
        {...sharedProps}
      >
        <NodeContentRenderer
          parentNode={parentNode}
          isSearchMatch={isSearchMatch}
          isSearchFocus={isSearchFocus}
          canDrag={rowCanDrag}
          toggleChildrenVisibility={this.toggleChildrenVisibility}
          {...sharedProps}
          {...nodeProps}
        />
      </TreeNodeRenderer>
    );
  }

  render() {
    const {
      dragDropManager,
      style,
      className,
      innerStyle,
      rowHeight,
      isVirtualized,
      placeholderRenderer,
      reactVirtualizedListProps,
      getNodeKey,
      rowDirection,
    } = mergeTheme(this.props);
    const {
      searchMatches,
      searchFocusTreeIndex,
      draggedNode,
      draggedDepth,
      draggedMinimumTreeIndex,
      instanceProps,
    } = this.state;

    const treeData = this.state.draggingTreeData || instanceProps.treeData;
    const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;

    let rows;
    let swapFrom = null;
    let swapLength = null;
    if (draggedNode && draggedMinimumTreeIndex !== null) {
      const addedResult = memoizedInsertNode({
        treeData,
        newNode: draggedNode,
        depth: draggedDepth,
        minimumTreeIndex: draggedMinimumTreeIndex,
        expandParent: true,
        getNodeKey,
      });

      const swapTo = draggedMinimumTreeIndex;
      swapFrom = addedResult.treeIndex;
      swapLength = 1 + memoizedGetDescendantCount({ node: draggedNode });
      rows = slideRows(
        this.getRows(addedResult.treeData),
        swapFrom,
        swapTo,
        swapLength
      );
    } else {
      rows = this.getRows(treeData);
    }

    // Get indices for rows that match the search conditions
    const matchKeys = {};
    searchMatches.forEach(({ path }, i) => {
      matchKeys[path[path.length - 1]] = i;
    });

    // Seek to the focused search result if there is one specified
    const scrollToInfo =
      searchFocusTreeIndex !== null
        ? { scrollToIndex: searchFocusTreeIndex }
        : {};

    let containerStyle = style;
    let list;
    if (rows.length < 1) {
      const Placeholder = this.treePlaceholderRenderer;
      const PlaceholderContent = placeholderRenderer;
      list = (
        <Placeholder treeId={this.treeId} drop={this.drop}>
          <PlaceholderContent />
        </Placeholder>
      );
    } else if (isVirtualized) {
      containerStyle = { height: '100%', ...containerStyle };

      const ScrollZoneVirtualList = this.scrollZoneVirtualList;
      // Render list with react-virtualized
      list = (
        <AutoSizer>
          {({ height, width }) => (
            <ScrollZoneVirtualList
              {...scrollToInfo}
              dragDropManager={dragDropManager}
              verticalStrength={this.vStrength}
              horizontalStrength={this.hStrength}
              speed={30}
              scrollToAlignment="start"
              className="rst__virtualScrollOverride"
              width={width}
              onScroll={({ scrollTop }) => {
                this.scrollTop = scrollTop;
              }}
              height={height}
              style={innerStyle}
              rowCount={rows.length}
              estimatedRowSize={
                typeof rowHeight !== 'function' ? rowHeight : undefined
              }
              rowHeight={
                typeof rowHeight !== 'function'
                  ? rowHeight
                  : ({ index }) =>
                      rowHeight({
                        index,
                        treeIndex: index,
                        node: rows[index].node,
                        path: rows[index].path,
                      })
              }
              rowRenderer={({ index, style: rowStyle }) =>
                this.renderRow(rows[index], {
                  listIndex: index,
                  style: rowStyle,
                  getPrevRow: () => rows[index - 1] || null,
                  matchKeys,
                  swapFrom,
                  swapDepth: draggedDepth,
                  swapLength,
                })
              }
              {...reactVirtualizedListProps}
            />
          )}
        </AutoSizer>
      );
    } else {
      // Render list without react-virtualized
      list = rows.map((row, index) =>
        this.renderRow(row, {
          listIndex: index,
          style: {
            height:
              typeof rowHeight !== 'function'
                ? rowHeight
                : rowHeight({
                    index,
                    treeIndex: index,
                    node: row.node,
                    path: row.path,
                  }),
          },
          getPrevRow: () => rows[index - 1] || null,
          matchKeys,
          swapFrom,
          swapDepth: draggedDepth,
          swapLength,
        })
      );
    }

    return (
      <div
        className={classnames('rst__tree', className, rowDirectionClass)}
        style={containerStyle}
      >
        {list}
      </div>
    );
  }
}

ReactSortableTree.propTypes = {
  dragDropManager: PropTypes.shape({
    getMonitor: PropTypes.func,
  }).isRequired,

  // Tree data in the following format:
  // [{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]
  // `title` is the primary label for the node
  // `subtitle` is a secondary label for the node
  // `expanded` shows children of the node if true, or hides them if false. Defaults to false.
  // `children` is an array of child nodes belonging to the node.
  treeData: PropTypes.arrayOf(PropTypes.object).isRequired,

  // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
  style: PropTypes.shape({}),

  // Class name for the container wrapping the tree
  className: PropTypes.string,

  // Style applied to the inner, scrollable container (for padding, etc.)
  innerStyle: PropTypes.shape({}),

  // Used by react-virtualized
  // Either a fixed row height (number) or a function that returns the
  // height of a row given its index: `({ index: number }): number`
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),

  // Size in px of the region near the edges that initiates scrolling on dragover
  slideRegionSize: PropTypes.number,

  // Custom properties to hand to the react-virtualized list
  // https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types
  reactVirtualizedListProps: PropTypes.shape({}),

  // The width of the blocks containing the lines representing the structure of the tree.
  scaffoldBlockPxWidth: PropTypes.number,

  // Maximum depth nodes can be inserted at. Defaults to infinite.
  maxDepth: PropTypes.number,

  // The method used to search nodes.
  // Defaults to a function that uses the `searchQuery` string to search for nodes with
  // matching `title` or `subtitle` values.
  // NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.
  searchMethod: PropTypes.func,

  // Used by the `searchMethod` to highlight and scroll to matched nodes.
  // Should be a string for the default `searchMethod`, but can be anything when using a custom search.
  searchQuery: PropTypes.any, // eslint-disable-line react/forbid-prop-types

  // Outline the <`searchFocusOffset`>th node and scroll to it.
  searchFocusOffset: PropTypes.number,

  // Get the nodes that match the search criteria. Used for counting total matches, etc.
  searchFinishCallback: PropTypes.func,

  // Generate an object with additional props to be passed to the node renderer.
  // Use this for adding buttons via the `buttons` key,
  // or additional `style` / `className` settings.
  generateNodeProps: PropTypes.func,

  // Set to false to disable virtualization.
  // NOTE: Auto-scrolling while dragging, and scrolling to the `searchFocusOffset` will be disabled.
  isVirtualized: PropTypes.bool,

  treeNodeRenderer: PropTypes.func,

  // Override the default component for rendering nodes (but keep the scaffolding generator)
  // This is an advanced option for complete customization of the appearance.
  // It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
  nodeContentRenderer: PropTypes.func,

  // Override the default component for rendering an empty tree
  // This is an advanced option for complete customization of the appearance.
  // It is best to copy the component in `placeholder-renderer-default.js` to use as a base,
  // and customize as needed.
  placeholderRenderer: PropTypes.func,

  theme: PropTypes.shape({
    style: PropTypes.shape({}),
    innerStyle: PropTypes.shape({}),
    reactVirtualizedListProps: PropTypes.shape({}),
    scaffoldBlockPxWidth: PropTypes.number,
    slideRegionSize: PropTypes.number,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    treeNodeRenderer: PropTypes.func,
    nodeContentRenderer: PropTypes.func,
    placeholderRenderer: PropTypes.func,
  }),

  // Determine the unique key used to identify each node and
  // generate the `path` array passed in callbacks.
  // By default, returns the index in the tree (omitting hidden nodes).
  getNodeKey: PropTypes.func,

  // Called whenever tree data changed.
  // Just like with React input elements, you have to update your
  // own component's data to see the changes reflected.
  onChange: PropTypes.func.isRequired,

  // Called after node move operation.
  onMoveNode: PropTypes.func,

  // Determine whether a node can be dragged. Set to false to disable dragging on all nodes.
  canDrag: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

  // Determine whether a node can be dropped based on its path and parents'.
  canDrop: PropTypes.func,

  // Determine whether a node can have children
  canNodeHaveChildren: PropTypes.func,

  // When true, or a callback returning true, dropping nodes to react-dnd
  // drop targets outside of this tree will not remove them from this tree
  shouldCopyOnOutsideDrop: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),

  // Called after children nodes collapsed or expanded.
  onVisibilityToggle: PropTypes.func,

  dndType: PropTypes.string,

  // Called to track between dropped and dragging
  onDragStateChanged: PropTypes.func,

  // Specify that nodes that do not match search will be collapsed
  onlyExpandSearchedNodes: PropTypes.bool,

  // rtl support
  rowDirection: PropTypes.string,
};

ReactSortableTree.defaultProps = {
  canDrag: true,
  canDrop: null,
  canNodeHaveChildren: () => true,
  className: '',
  dndType: null,
  generateNodeProps: null,
  getNodeKey: defaultGetNodeKey,
  innerStyle: {},
  isVirtualized: true,
  maxDepth: null,
  treeNodeRenderer: null,
  nodeContentRenderer: null,
  onMoveNode: () => {},
  onVisibilityToggle: () => {},
  placeholderRenderer: null,
  reactVirtualizedListProps: {},
  rowHeight: null,
  scaffoldBlockPxWidth: null,
  searchFinishCallback: null,
  searchFocusOffset: null,
  searchMethod: null,
  searchQuery: null,
  shouldCopyOnOutsideDrop: false,
  slideRegionSize: null,
  style: {},
  theme: {},
  onDragStateChanged: () => {},
  onlyExpandSearchedNodes: false,
  rowDirection: 'ltr',
};

polyfill(ReactSortableTree);

const SortableTreeWithoutDndContext = props => (
  <DndContext.Consumer>
    {({ dragDropManager }) =>
      dragDropManager === undefined ? null : (
        <ReactSortableTree {...props} dragDropManager={dragDropManager} />
      )
    }
  </DndContext.Consumer>
);

const SortableTree = props => (
  <DndProvider backend={HTML5Backend}>
    <SortableTreeWithoutDndContext {...props} />
  </DndProvider>
);

// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186
export { SortableTreeWithoutDndContext };

export default SortableTree;
