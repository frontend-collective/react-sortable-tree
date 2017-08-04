/*!
* react-sortable-tree
* Copyright 2016 Chris Fritz All rights reserved.
* @license Open source under the MIT License
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, List } from 'react-virtualized';
import isEqual from 'lodash.isequal';
import withScrolling, {
  createVerticalStrength,
  createHorizontalStrength,
} from 'react-dnd-scrollzone';
import 'react-virtualized/styles.css';
import TreeNode from './tree-node';
import NodeRendererDefault from './node-renderer-default';
import {
  walk,
  getFlatDataFromTree,
  changeNodeAtPath,
  removeNodeAtPath,
  insertNode,
  getDescendantCount,
  find,
} from './utils/tree-data-utils';
import { memoizedInsertNode } from './utils/memoized-tree-data-utils';
import { slideRows } from './utils/generic-utils';
import {
  defaultGetNodeKey,
  defaultSearchMethod,
} from './utils/default-handlers';
import {
  dndWrapRoot,
  dndWrapSource,
  dndWrapTarget,
} from './utils/drag-and-drop-utils';
import styles from './react-sortable-tree.scss';

let treeIdCounter = 1;

class ReactSortableTree extends Component {
  constructor(props) {
    super(props);

    const {
      dndType,
      nodeContentRenderer,
      isVirtualized,
      slideRegionSize,
      treeData,
    } = props;

    // Wrapping classes for use with react-dnd
    this.treeId = `rst__${treeIdCounter}`;
    treeIdCounter += 1;
    this.dndType = dndType || this.treeId;
    this.nodeContentRenderer = dndWrapSource(nodeContentRenderer, this.dndType);
    this.treeNodeRenderer = dndWrapTarget(TreeNode, this.dndType);

    // Prepare scroll-on-drag options for this list
    if (isVirtualized) {
      this.scrollZoneVirtualList = withScrolling(List);
      this.vStrength = createVerticalStrength(slideRegionSize);
      this.hStrength = createHorizontalStrength(slideRegionSize);
    }

    this.state = {
      draggingTreeData: null,
      swapFrom: null,
      swapLength: null,
      swapDepth: null,
      rows: this.getRows(treeData),
      searchMatches: [],
      searchFocusTreeIndex: null,
    };

    this.toggleChildrenVisibility = this.toggleChildrenVisibility.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.dragHover = this.dragHover.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.drop = this.drop.bind(this);
    this.handleDndMonitorChange = this.handleDndMonitorChange.bind(this);
  }

  componentWillMount() {
    this.loadLazyChildren();
    this.search(this.props, false, false);
    this.ignoreOneTreeUpdate = false;

    // Hook into react-dnd state changes to detect when the drag ends
    // TODO: This is very brittle, so it needs to be replaced if react-dnd
    // offers a more official way to detect when a drag ends
    this.clearMonitorSubscription = this.context.dragDropManager
      .getMonitor()
      .subscribeToStateChange(this.handleDndMonitorChange);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ searchFocusTreeIndex: null });
    if (this.props.treeData !== nextProps.treeData) {
      // Ignore updates caused by search, in order to avoid infinite looping
      if (this.ignoreOneTreeUpdate) {
        this.ignoreOneTreeUpdate = false;
      } else {
        this.loadLazyChildren(nextProps);
        // Load any children defined by a function
        this.search(nextProps, false, false);
      }

      // Calculate the rows to be shown from the new tree data
      this.setState({
        draggingTreeData: null,
        swapFrom: null,
        swapLength: null,
        swapDepth: null,
        rows: this.getRows(nextProps.treeData),
      });
    } else if (!isEqual(this.props.searchQuery, nextProps.searchQuery)) {
      this.search(nextProps);
    } else if (this.props.searchFocusOffset !== nextProps.searchFocusOffset) {
      this.search(nextProps, true, true, true);
    }
  }

  componentWillUnmount() {
    this.clearMonitorSubscription();
  }

  getRows(treeData) {
    return getFlatDataFromTree({
      ignoreCollapsed: true,
      getNodeKey: this.props.getNodeKey,
      treeData,
    });
  }

  handleDndMonitorChange() {
    const monitor = this.context.dragDropManager.getMonitor();
    // If the drag ends and the tree is still in a mid-drag state,
    // it means that the drag was canceled or the dragSource dropped
    // elsewhere, and we should reset the state of this tree
    if (!monitor.isDragging() && this.state.draggingTreeData) {
      this.setState({
        draggingTreeData: null,
        swapFrom: null,
        swapLength: null,
        swapDepth: null,
        rows: this.getRows(this.props.treeData),
      });
    }
  }

  toggleChildrenVisibility({ node: targetNode, path }) {
    const treeData = changeNodeAtPath({
      treeData: this.props.treeData,
      path,
      newNode: ({ node }) => ({ ...node, expanded: !node.expanded }),
      getNodeKey: this.props.getNodeKey,
    });

    this.props.onChange(treeData);

    if (this.props.onVisibilityToggle) {
      this.props.onVisibilityToggle({
        treeData,
        node: targetNode,
        expanded: !targetNode.expanded,
      });
    }
  }

  moveNode({
    node,
    path: prevPath,
    treeIndex: prevTreeIndex,
    depth,
    minimumTreeIndex,
  }) {
    const { treeData, treeIndex, path } = insertNode({
      treeData: this.state.draggingTreeData,
      newNode: node,
      depth,
      minimumTreeIndex,
      expandParent: true,
      getNodeKey: this.props.getNodeKey,
    });

    this.props.onChange(treeData);

    if (this.props.onMoveNode) {
      this.props.onMoveNode({
        treeData,
        node,
        treeIndex,
        path,
        nextPath: path,
        nextTreeIndex: treeIndex,
        prevPath,
        prevTreeIndex,
      });
    }
  }

  search(
    props = this.props,
    seekIndex = true,
    expand = true,
    singleSearch = false
  ) {
    const {
      treeData,
      onChange,
      searchFinishCallback,
      searchQuery,
      searchMethod,
      searchFocusOffset,
    } = props;

    // Skip search if no conditions are specified
    if (
      (searchQuery === null ||
        typeof searchQuery === 'undefined' ||
        String(searchQuery) === '') &&
      !searchMethod
    ) {
      this.setState({
        searchMatches: [],
      });

      if (searchFinishCallback) {
        searchFinishCallback([]);
      }

      return;
    }

    const { treeData: expandedTreeData, matches: searchMatches } = find({
      getNodeKey: this.props.getNodeKey,
      treeData,
      searchQuery,
      searchMethod: searchMethod || defaultSearchMethod,
      searchFocusOffset,
      expandAllMatchPaths: expand && !singleSearch,
      expandFocusMatchPaths: !!expand,
    });

    // Update the tree with data leaving all paths leading to matching nodes open
    if (expand) {
      this.ignoreOneTreeUpdate = true; // Prevents infinite loop
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

    this.setState({
      searchMatches,
      searchFocusTreeIndex,
    });
  }

  startDrag({ path }) {
    const draggingTreeData = removeNodeAtPath({
      treeData: this.props.treeData,
      path,
      getNodeKey: this.props.getNodeKey,
    });

    this.setState({
      draggingTreeData,
    });
  }

  dragHover({ node: draggedNode, depth, minimumTreeIndex }) {
    // Fall back to the tree data if something is being dragged in from
    //  an external element
    const draggingTreeData = this.state.draggingTreeData || this.props.treeData;

    const addedResult = memoizedInsertNode({
      treeData: draggingTreeData,
      newNode: draggedNode,
      depth,
      minimumTreeIndex,
      expandParent: true,
      getNodeKey: this.props.getNodeKey,
    });

    const rows = this.getRows(addedResult.treeData);
    const expandedParentPath = rows[addedResult.treeIndex].path;

    const swapFrom = addedResult.treeIndex;
    const swapTo = minimumTreeIndex;
    const swapLength = 1 + getDescendantCount({ node: draggedNode });
    this.setState({
      rows: slideRows(rows, swapFrom, swapTo, swapLength),
      swapFrom,
      swapLength,
      swapDepth: depth,
      draggingTreeData: changeNodeAtPath({
        treeData: draggingTreeData,
        path: expandedParentPath.slice(0, -1),
        newNode: ({ node }) => ({ ...node, expanded: true }),
        getNodeKey: this.props.getNodeKey,
      }),
    });
  }

  endDrag(dropResult) {
    // Drop was cancelled
    if (!dropResult) {
      this.setState({
        draggingTreeData: null,
        swapFrom: null,
        swapLength: null,
        swapDepth: null,
        rows: this.getRows(this.props.treeData),
      });
    } else if (dropResult.treeId !== this.treeId) {
      const { node, path: prevPath, treeIndex: prevTreeIndex } = dropResult;
      // The node was dropped in an external drop target or tree
      const treeData = this.state.draggingTreeData || this.props.treeData;
      this.props.onChange(treeData);

      if (this.props.onMoveNode) {
        this.props.onMoveNode({
          treeData,
          node,
          treeIndex: null,
          path: null,
          nextPath: null,
          nextTreeIndex: null,
          prevPath,
          prevTreeIndex,
        });
      }
    }
  }

  drop(dropResult) {
    this.moveNode(dropResult);
  }

  // Load any children in the tree that are given by a function
  loadLazyChildren(props = this.props) {
    walk({
      treeData: props.treeData,
      getNodeKey: this.props.getNodeKey,
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
              this.props.onChange(
                changeNodeAtPath({
                  treeData: this.props.treeData,
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
                  getNodeKey: this.props.getNodeKey,
                })
              ),
          });
        }
      },
    });
  }

  renderRow(
    { node, parentNode, path, lowerSiblingCounts, treeIndex },
    listIndex,
    style,
    getPrevRow,
    matchKeys
  ) {
    const {
      canDrag,
      canDrop,
      generateNodeProps,
      getNodeKey,
      maxDepth,
      scaffoldBlockPxWidth,
      searchFocusOffset,
    } = this.props;
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
    };

    return (
      <TreeNodeRenderer
        style={style}
        key={nodeKey}
        listIndex={listIndex}
        getPrevRow={getPrevRow}
        treeData={this.state.draggingTreeData || this.state.treeData}
        getNodeKey={getNodeKey}
        customCanDrop={canDrop}
        lowerSiblingCounts={lowerSiblingCounts}
        swapFrom={this.state.swapFrom}
        swapLength={this.state.swapLength}
        swapDepth={this.state.swapDepth}
        maxDepth={maxDepth}
        dragHover={this.dragHover}
        drop={this.drop}
        {...sharedProps}
      >
        <NodeContentRenderer
          parentNode={parentNode}
          isSearchMatch={isSearchMatch}
          isSearchFocus={isSearchFocus}
          startDrag={this.startDrag}
          endDrag={this.endDrag}
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
      style,
      className,
      innerStyle,
      rowHeight,
      isVirtualized,
    } = this.props;
    const { rows, searchMatches, searchFocusTreeIndex } = this.state;

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
    if (isVirtualized) {
      containerStyle = { height: '100%', ...containerStyle };

      const ScrollZoneVirtualList = this.scrollZoneVirtualList;
      // Render list with react-virtualized
      list = (
        <AutoSizer>
          {({ height, width }) =>
            <ScrollZoneVirtualList
              {...scrollToInfo}
              verticalStrength={this.vStrength}
              horizontalStrength={this.hStrength}
              speed={30}
              scrollToAlignment="start"
              className={styles.virtualScrollOverride}
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
              rowHeight={rowHeight}
              rowRenderer={({ index, style: rowStyle }) =>
                this.renderRow(
                  rows[index],
                  index,
                  rowStyle,
                  () => rows[index - 1] || null,
                  matchKeys
                )}
              {...this.props.reactVirtualizedListProps}
            />}
        </AutoSizer>
      );
    } else {
      // Render list without react-virtualized
      list = rows.map((row, index) =>
        this.renderRow(
          row,
          index,
          {
            height:
              typeof rowHeight !== 'function'
                ? rowHeight
                : rowHeight({ index }),
          },
          () => rows[index - 1] || null,
          matchKeys
        )
      );
    }

    return (
      <div
        className={styles.tree + (className ? ` ${className}` : '')}
        style={containerStyle}
      >
        {list}
      </div>
    );
  }
}

ReactSortableTree.propTypes = {
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
  slideRegionSize: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types

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
  searchMethod: PropTypes.func, // eslint-disable-line react/no-unused-prop-types

  // Used by the `searchMethod` to highlight and scroll to matched nodes.
  // Should be a string for the default `searchMethod`, but can be anything when using a custom search.
  searchQuery: PropTypes.any, // eslint-disable-line react/forbid-prop-types

  // Outline the <`searchFocusOffset`>th node and scroll to it.
  searchFocusOffset: PropTypes.number,

  // Get the nodes that match the search criteria. Used for counting total matches, etc.
  searchFinishCallback: PropTypes.func, // eslint-disable-line react/no-unused-prop-types

  // Generate an object with additional props to be passed to the node renderer.
  // Use this for adding buttons via the `buttons` key,
  // or additional `style` / `className` settings.
  generateNodeProps: PropTypes.func,

  // Set to false to disable virtualization.
  // NOTE: Auto-scrolling while dragging, and scrolling to the `searchFocusOffset` will be disabled.
  isVirtualized: PropTypes.bool,

  // Override the default component for rendering nodes (but keep the scaffolding generator)
  // This is an advanced option for complete customization of the appearance.
  // It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
  nodeContentRenderer: PropTypes.func,

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

  // Called after children nodes collapsed or expanded.
  onVisibilityToggle: PropTypes.func,

  dndType: PropTypes.string,
};

ReactSortableTree.defaultProps = {
  canDrag: true,
  canDrop: null,
  className: '',
  dndType: null,
  generateNodeProps: null,
  getNodeKey: defaultGetNodeKey,
  innerStyle: {},
  isVirtualized: true,
  maxDepth: null,
  nodeContentRenderer: NodeRendererDefault,
  onMoveNode: null,
  onVisibilityToggle: null,
  reactVirtualizedListProps: {},
  rowHeight: 62,
  scaffoldBlockPxWidth: 44,
  searchFinishCallback: null,
  searchFocusOffset: null,
  searchMethod: null,
  searchQuery: null,
  slideRegionSize: 100,
  style: {},
};

ReactSortableTree.contextTypes = {
  dragDropManager: PropTypes.shape({}),
};

// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186
export { ReactSortableTree as SortableTreeWithoutDndContext };

export default dndWrapRoot(ReactSortableTree);
