/*!
 * react-sortable-tree
 * Copyright 2016 Chris Fritz All rights reserved.
 * @license Open source under the MIT License
 */

import React, { Component, PropTypes } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import isEqual from 'lodash.isequal';
import withScrolling, { createVerticalStrength, createHorizontalStrength } from 'react-dnd-scrollzone';
import 'react-virtualized/styles.css';
import TreeNode from './tree-node';
import NodeRendererDefault from './node-renderer-default';
import {
    walk,
    getFlatDataFromTree,
    changeNodeAtPath,
    removeNodeAtPath,
    insertNodes,
    getDescendantCount,
    getNodeAtPath,
    find,
    toggleSelectedForAll,
} from './utils/tree-data-utils';
import {
    swapRows,
} from './utils/generic-utils';
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

let dndTypeCounter = 1;

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
        this.dndType             = dndType || `rst__${dndTypeCounter++}`;
        this.nodeContentRenderer = dndWrapSource(nodeContentRenderer, this.dndType);
        this.treeNodeRenderer    = dndWrapTarget(TreeNode, this.dndType);

        // Prepare scroll-on-drag options for this list
        if (isVirtualized) {
            this.scrollZoneVirtualList = withScrolling(List);
            this.vStrength             = createVerticalStrength(slideRegionSize);
            this.hStrength             = createHorizontalStrength(slideRegionSize);
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
        this.moveNodes                = this.moveNodes.bind(this);
        this.startDrag                = this.startDrag.bind(this);
        this.dragHover                = this.dragHover.bind(this);
        this.endDrag                  = this.endDrag.bind(this);
        this.selectNode               = this.selectNode.bind(this);
    }

    componentWillMount() {
        this.loadLazyChildren();
        this.search(this.props, false, false);
        this.ignoreOneTreeUpdate = false;
    }

    toggleChildrenVisibility({ node: targetNode, path, treeIndex: _treeIndex }) {
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

    moveNodes({ nodes, depth, minimumTreeIndex }) {
        const {
            treeData,
            treeIndex,
            path,
        } = insertNodes({
            treeData: this.state.draggingTreeData,
            newNodes: nodes,
            depth,
            minimumTreeIndex,
            expandParent: true,
            getNodeKey: this.props.getNodeKey,
        });

        this.props.onChange(treeData);

        if (this.props.onMoveNode) {
            nodes.forEach((node) => {
                this.props.onMoveNode({ treeData, node, treeIndex, path });
            });
        }
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

    getRows(treeData) {
        return getFlatDataFromTree({
            ignoreCollapsed: true,
            getNodeKey: this.props.getNodeKey,
            treeData,
        });
    }

    search(props = this.props, seekIndex = true, expand = true, singleSearch = false) {
        const {
            treeData,
            onChange,
            searchFinishCallback,
            searchQuery,
            searchMethod,
            searchFocusOffset,
        } = props;

        // Skip search if no conditions are specified
        if ((searchQuery === null || typeof searchQuery === 'undefined' || String(searchQuery) === '') &&
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

        const {
            treeData: expandedTreeData,
            matches: searchMatches,
        } = find({
            getNodeKey: this.props.getNodeKey,
            treeData,
            searchQuery,
            searchMethod: searchMethod || defaultSearchMethod,
            searchFocusOffset,
            expandAllMatchPaths: expand && !singleSearch,
            expandFocusMatchPaths: expand && true,
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
        if (seekIndex &&
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

    selectNode({node, path, event}) {
        let treeData = this.props.treeData;
        const oldTreeData = treeData;
        const clearSelected = !event.ctrlKey && !event.metaKey;
        if (clearSelected) {
            // Remove old selection.
            treeData = toggleSelectedForAll({treeData, selected: false});
        } else if (!node.selected) {
            // Check if any ancestor is already selected.
            for (const ancestorPath = path.slice(0, path.length - 1); ancestorPath.length > 0; ancestorPath.pop()) {
                if (getNodeAtPath({treeData, path: ancestorPath, getNodeKey: this.props.getNodeKey}).node.selected) {
                    // An ancestor is already selected, so do nothing.
                    return;
                }
            }
            // Deselect all descendants.
            toggleSelectedForAll({treeData: [node], selected: false}).forEach((newNode) => {
                treeData = changeNodeAtPath({
                    treeData,
                    path,
                    newNode,
                    getNodeKey: this.props.getNodeKey,
                });
            });
        }
        // Change selection of node.
        treeData = changeNodeAtPath({
            treeData,
            path,
            newNode: ({ node: oldNode }) => ({ ...oldNode, selected: !oldNode.selected }),
            getNodeKey: this.props.getNodeKey,
        });

        this.props.onChange(treeData);

        if (this.props.onSelectedToggle) {
            let deselectionTree;
            if (clearSelected) {
                deselectionTree = oldTreeData;
            } else {
                deselectionTree = [node];
            }
            // Notify deselected nodes
            walk({
                treeData: deselectionTree,
                callback: ({ node: oldNode }) => {
                    if (oldNode.selected) {
                        this.props.onSelectedToggle({
                            treeData,
                            node: oldNode,
                            selected: false,
                        });
                    }
                },
                getNodeKey: ({ treeIndex }) => treeIndex,
                ignoreCollapsed: false,
            });
            // Notify clicked node
            this.props.onSelectedToggle({
                treeData,
                node,
                selected: clearSelected || !node.selected,
            });
        }
    }

    startDrag(props) {
        let nodeProps;
        if (props.node.selected) {
            // Move all selected nodes
            nodeProps = find({...this.props, searchMethod: ({node}) => node.selected}).matches;
        } else {
            // Move only current node
            nodeProps = [props];
        }

        // Remove dragging nodes from tree, assumes nodeProps is sorted by ascending tree position
        let draggingTreeData = this.props.treeData;
        for (let i = nodeProps.length - 1; i >= 0; i--) {
            draggingTreeData = removeNodeAtPath({
                treeData: draggingTreeData,
                path: nodeProps[i].path,
                getNodeKey: this.props.getNodeKey,
            });
        }

        this.setState({
            draggingTreeData,
        });

        return nodeProps.map(n => n.node);
    }

    dragHover({ nodes: draggedNodes, depth, minimumTreeIndex }) {
        const addedResult = insertNodes({
            treeData: this.state.draggingTreeData,
            newNodes: draggedNodes,
            depth,
            minimumTreeIndex,
            expandParent: true,
        });

        const rows               = this.getRows(addedResult.treeData);
        const expandedParentPath = rows[addedResult.treeIndex].path;

        const swapFrom   = addedResult.treeIndex;
        const swapTo     = minimumTreeIndex;
        const swapLength = draggedNodes.length +
            draggedNodes.map(draggedNode => getDescendantCount({ node: draggedNode })).reduce((x, y) => x + y);
        this.setState({
            rows: swapRows(rows, swapFrom, swapTo, swapLength),
            swapFrom,
            swapLength,
            swapDepth: depth,
            draggingTreeData: changeNodeAtPath({
                treeData: this.state.draggingTreeData,
                path: expandedParentPath.slice(0, -1),
                newNode: ({ node }) => ({ ...node, expanded: true }),
                getNodeKey: this.props.getNodeKey,
            }),
        });
    }

    endDrag(dropResult) {
        if (!dropResult) {
            return this.setState({
                draggingTreeData: null,
                swapFrom: null,
                swapLength: null,
                swapDepth: null,
                rows: this.getRows(this.props.treeData),
            });
        }

        this.moveNodes(dropResult);
    }

    /**
     * Load any children in the tree that are given by a function
     */
    loadLazyChildren(props = this.props) {
        walk({
            treeData: props.treeData,
            getNodeKey: this.props.getNodeKey,
            callback: ({ node, path, lowerSiblingCounts, treeIndex }) => {
                // If the node has children defined by a function, and is either expanded
                //  or set to load even before expansion, run the function.
                if (node.children &&
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
                        done: childrenArray => this.props.onChange(changeNodeAtPath({
                            treeData: this.props.treeData,
                            path,
                            newNode: ({ node: oldNode }) => (
                                // Only replace the old node if it's the one we set off to find children
                                //  for in the first place
                                oldNode === node ? { ...oldNode, children: childrenArray } : oldNode
                            ),
                            getNodeKey: this.props.getNodeKey,
                        })),
                    });
                }
            },
        });
    }

    render() {
        const {
            style,
            className,
            innerStyle,
            rowHeight,
            getNodeKey,
            isVirtualized,
        } = this.props;
        const {
            rows,
            searchMatches,
            searchFocusTreeIndex,
        } = this.state;

        // Get indices for rows that match the search conditions
        const matchKeys = {};
        searchMatches.forEach(({ path }, i) => { matchKeys[path[path.length - 1]] = i; });

        // Seek to the focused search result if there is one specified
        const scrollToInfo = searchFocusTreeIndex !== null ? { scrollToIndex: searchFocusTreeIndex } : {};

        let containerStyle = style;
        let list;
        if (isVirtualized) {
            containerStyle = { height: '100%', ...containerStyle  };

            const ScrollZoneVirtualList = this.scrollZoneVirtualList;
            // Render list with react-virtualized
            list = (
                <AutoSizer>
                    {({height, width}) => (
                        <ScrollZoneVirtualList
                            {...scrollToInfo}
                            verticalStrength={this.vStrength}
                            horizontalStrength={this.hStrength}
                            speed={30}
                            scrollToAlignment="start"
                            className={styles.virtualScrollOverride}
                            width={width}
                            onScroll={({ scrollTop }) => { this.scrollTop = scrollTop; }}
                            height={height}
                            style={innerStyle}
                            rowCount={rows.length}
                            estimatedRowSize={typeof rowHeight !== 'function' ? rowHeight : undefined}
                            rowHeight={rowHeight}
                            rowRenderer={({ index, key, style: rowStyle }) => this.renderRow(
                                rows[index],
                                index,
                                key,
                                rowStyle,
                                () => (rows[index - 1] || null),
                                matchKeys
                            )}
                            {...this.props.reactVirtualizedListProps}
                        />
                    )}
                </AutoSizer>
            );
        } else {
            // Render list without react-virtualized
            list = rows.map((row, index) => this.renderRow(
                row,
                index,
                getNodeKey({
                    node:      row.node,
                    treeIndex: row.treeIndex,
                }),
                { height: typeof rowHeight !== 'function' ? rowHeight : rowHeight({ index }) },
                () => (rows[index - 1] || null),
                matchKeys
            ));
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

    renderRow({ node, path, lowerSiblingCounts, treeIndex }, listIndex, key, style, getPrevRow, matchKeys) {
        const TreeNodeRenderer    = this.treeNodeRenderer;
        const NodeContentRenderer = this.nodeContentRenderer;
        const nodeKey = path[path.length - 1];
        const isSearchMatch = nodeKey in matchKeys;
        const isSearchFocus = isSearchMatch &&
            matchKeys[nodeKey] === this.props.searchFocusOffset;

        const nodeProps = !this.props.generateNodeProps ? {} : this.props.generateNodeProps({
            node,
            path,
            lowerSiblingCounts,
            treeIndex,
            isSearchMatch,
            isSearchFocus,
        });

        return (
            <TreeNodeRenderer
                style={style}
                key={key}
                treeIndex={treeIndex}
                listIndex={listIndex}
                getPrevRow={getPrevRow}
                node={node}
                path={path}
                lowerSiblingCounts={lowerSiblingCounts}
                scaffoldBlockPxWidth={this.props.scaffoldBlockPxWidth}
                swapFrom={this.state.swapFrom}
                swapLength={this.state.swapLength}
                swapDepth={this.state.swapDepth}
                maxDepth={this.props.maxDepth}
                dragHover={this.dragHover}
            >
                <NodeContentRenderer
                    node={node}
                    path={path}
                    isSearchMatch={isSearchMatch}
                    isSearchFocus={isSearchFocus}
                    treeIndex={treeIndex}
                    startDrag={this.startDrag}
                    endDrag={this.endDrag}
                    selectNode={this.selectNode}
                    toggleChildrenVisibility={this.toggleChildrenVisibility}
                    scaffoldBlockPxWidth={this.props.scaffoldBlockPxWidth}
                    {...nodeProps}
                />
            </TreeNodeRenderer>
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
    style: PropTypes.object,

    // Class name for the container wrapping the tree
    className: PropTypes.string,

    // Style applied to the inner, scrollable container (for padding, etc.)
    innerStyle: PropTypes.object,

    // Used by react-virtualized
    // Either a fixed row height (number) or a function that returns the
    // height of a row given its index: `({ index: number }): number`
    rowHeight: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),

    // Size in px of the region near the edges that initiates scrolling on dragover
    slideRegionSize: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types

    // Custom properties to hand to the react-virtualized list
    // https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types
    reactVirtualizedListProps: PropTypes.object,

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
    searchQuery: PropTypes.any,

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
    nodeContentRenderer: PropTypes.any,

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

    // Called after children nodes collapsed or expanded.
    onVisibilityToggle: PropTypes.func,

    // Called after nodes selected or unselected.
    onSelectedToggle: PropTypes.func,

    dndType: PropTypes.string,
};

ReactSortableTree.defaultProps = {
    getNodeKey: defaultGetNodeKey,
    nodeContentRenderer: NodeRendererDefault,
    rowHeight: 62,
    slideRegionSize: 100,
    scaffoldBlockPxWidth: 44,
    style: {},
    innerStyle: {},
    searchQuery: null,
    isVirtualized: true,
};

export default dndWrapRoot(ReactSortableTree);
