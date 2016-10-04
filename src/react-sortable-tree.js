/*!
 * react-sortable-tree
 * Copyright 2016 Chris Fritz All rights reserved.
 * @license Open source under the MIT License
 */

import React, { Component, PropTypes } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css';
import TreeNode from './tree-node';
import {
    walk,
    getFlatDataFromTree,
    changeNodeAtPath,
    removeNodeAtPath,
    insertNode,
    getDescendantCount,
    find,
} from './utils/tree-data-utils';
import {
    swapRows,
} from './utils/generic-utils';
import {
    defaultGetNodeKey,
    defaultToggleChildrenVisibility,
    defaultMoveNode,
    defaultSearchMethod,
} from './utils/default-handlers';
import {
    dndWrapRoot,
    dndWrapSource,
} from './utils/drag-and-drop-utils';
import styles from './react-sortable-tree.scss';

class ReactSortableTree extends Component {
    constructor(props) {
        super(props);

        if (process.env.NODE_ENV === 'development') {
            /* eslint-disable no-console */
            const usesDefaultHandlers = (
                !props.toggleChildrenVisibility
            );

            if (!props.updateTreeData && usesDefaultHandlers) {
                console.warn('Need to add specify updateTreeData prop if default event handlers are used');
            }
            /* eslint-enable */
        }

        // Fall back to default event listeners if necessary and bind them to the tree
        this.getNodeKey = (props.getNodeKey || defaultGetNodeKey).bind(this);
        this.moveNode   = (props.moveNode || defaultMoveNode).bind(this);
        this.toggleChildrenVisibility = (
            props.toggleChildrenVisibility || defaultToggleChildrenVisibility
        ).bind(this);
        this.nodeContentRenderer = dndWrapSource(
            props.nodeContentRenderer ||
            require('./node-renderer-default').default // eslint-disable-line global-require
        );

        this.state = {
            draggingTreeData: null,
            swapFrom: null,
            swapLength: null,
            swapDepth: null,
            rows: this.getRows(props.treeData),
            searchMatches: [],
            searchFocusTreeIndex: null,
        };

        this.startDrag = this.startDrag.bind(this);
        this.dragHover = this.dragHover.bind(this);
        this.endDrag   = this.endDrag.bind(this);
    }

    componentWillMount() {
        this.loadLazyChildren();
        this.search(this.props, false, false);
        this.ignoreOneTreeUpdate = false;
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
        } else if (this.props.searchQuery !== nextProps.searchQuery ||
            this.props.searchMethod !== nextProps.searchMethod
        ) {
            this.search(nextProps);
        } else if (this.props.searchFocusOffset !== nextProps.searchFocusOffset) {
            this.search(nextProps, true, true, true);
        }
    }

    getRows(treeData) {
        return getFlatDataFromTree({
            ignoreCollapsed: true,
            getNodeKey: this.getNodeKey,
            treeData,
        });
    }

    search(props = this.props, seekIndex = true, expand = true, singleSearch = false) {
        const {
            treeData,
            updateTreeData,
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
            getNodeKey: this.getNodeKey,
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
            updateTreeData(expandedTreeData);
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

    startDrag({ path }) {
        const draggingTreeData = removeNodeAtPath({
            treeData: this.props.treeData,
            path,
            getNodeKey: this.getNodeKey,
        });

        this.setState({
            draggingTreeData,
        });
    }

    dragHover({ node: draggedNode, depth, minimumTreeIndex }) {
        const addedResult = insertNode({
            treeData: this.state.draggingTreeData,
            newNode: draggedNode,
            depth,
            minimumTreeIndex,
            expandParent: true,
        });

        const rows               = this.getRows(addedResult.treeData);
        const expandedParentPath = rows[addedResult.treeIndex].path;

        const swapFrom   = addedResult.treeIndex;
        const swapTo     = minimumTreeIndex;
        const swapLength = 1 + getDescendantCount({ node: draggedNode });
        this.setState({
            rows: swapRows(rows, swapFrom, swapTo, swapLength),
            swapFrom,
            swapLength,
            swapDepth: depth,
            draggingTreeData: changeNodeAtPath({
                treeData: this.state.draggingTreeData,
                path: expandedParentPath.slice(0, -1),
                newNode: ({ node }) => ({ ...node, expanded: true }),
                getNodeKey: this.getNodeKey,
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

        this.moveNode(dropResult);
    }

    /**
     * Load any children in the tree that are given by a function
     */
    loadLazyChildren(props = this.props) {
        walk({
            treeData: props.treeData,
            getNodeKey: this.getNodeKey,
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
                        done: childrenArray => this.props.updateTreeData(changeNodeAtPath({
                            treeData: this.props.treeData,
                            path,
                            newNode: ({ node: oldNode }) => (
                                // Only replace the old node if it's the one we set off to find children
                                //  for in the first place
                                oldNode === node ? { ...oldNode, children: childrenArray } : oldNode
                            ),
                            getNodeKey: this.getNodeKey,
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

        return (
            <div
                className={styles.tree + (className ? ` ${className}` : '')}
                style={{ height: '100%', ...style }}
            >
                <AutoSizer>
                    {({height, width}) => (
                        <List
                            {...scrollToInfo}
                            scrollToAlignment="start"
                            className={styles.virtualScrollOverride}
                            width={width}
                            height={height}
                            style={innerStyle}
                            rowCount={rows.length}
                            estimatedRowSize={rowHeight}
                            rowHeight={rowHeight}
                            rowRenderer={({ index, key, style: rowStyle }) => this.renderRow(
                                rows[index],
                                index,
                                key,
                                rowStyle,
                                () => (rows[index - 1] || null),
                                matchKeys
                            )}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    renderRow({ node, path, lowerSiblingCounts, treeIndex }, listIndex, key, style, getPrevRow, matchKeys) {
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
            <TreeNode
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
                    toggleChildrenVisibility={this.toggleChildrenVisibility}
                    scaffoldBlockPxWidth={this.props.scaffoldBlockPxWidth}
                    {...nodeProps}
                />
            </TreeNode>
        );
    }
}

ReactSortableTree.propTypes = {
    treeData: PropTypes.arrayOf(PropTypes.object).isRequired,

    // Callback for move operation.
    // Called as moveNode({ node, path, parentPath, minimumTreeIndex })
    moveNode: PropTypes.func,

    // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
    style: PropTypes.object,
    className: PropTypes.string,

    // Style applied to the inner, scrollable container (for padding, etc.)
    innerStyle: PropTypes.object,

    // Height of each node row, used for react-virtualized
    rowHeight: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),

    scaffoldBlockPxWidth: PropTypes.number,

    maxDepth: PropTypes.number,

    // Search stuff
    searchQuery:          PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    searchFocusOffset:    PropTypes.number,
    searchMethod:         PropTypes.func,
    searchFinishCallback: PropTypes.func, // eslint-disable-line react/no-unused-prop-types

    nodeContentRenderer: PropTypes.any,
    generateNodeProps:   PropTypes.func,

    getNodeKey:                PropTypes.func,
    updateTreeData:            PropTypes.func,
    toggleChildrenVisibility:  PropTypes.func,
};

ReactSortableTree.defaultProps = {
    rowHeight: 62,
    style: {},
    innerStyle: {},
    scaffoldBlockPxWidth: 44,
    loadCollapsedLazyChildren: false,
    searchQuery: null,
};

export default dndWrapRoot(ReactSortableTree);
