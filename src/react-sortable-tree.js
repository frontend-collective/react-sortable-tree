/*!
 * react-sortable-tree
 * Copyright 2016 Chris Fritz All rights reserved.
 * @license Open source under the MIT License
 */

import React, { Component, PropTypes } from 'react';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import 'react-virtualized/styles.css';
import TreeNode from './tree-node';
import {
    walk,
    getFlatDataFromTree,
    changeNodeAtPath,
    removeNodeAtPath,
    addNodeUnderParentPath,
} from './utils/tree-data-utils';
import {
    dndWrapRoot,
    dndWrapSource,
} from './utils/drag-and-drop-utils';
import styles from './react-sortable-tree.scss';

function defaultGetNodeKey({ node: _node, treeIndex }) {
    return treeIndex;
}

function defaultToggleChildrenVisibility({ node: _node, path, treeIndex: _treeIndex }) {
    this.props.updateTreeData(changeNodeAtPath({
        treeData: this.props.treeData,
        path,
        newNode: ({ node }) => ({ ...node, expanded: !node.expanded }),
        getNodeKey: this.getNodeKey,
    }));
}

function defaultMoveNode({ node: newNode, parentPath, minimumTreeIndex }) {
    this.props.updateTreeData(addNodeUnderParentPath({
        treeData: this.state.draggingTreeData,
        newNode,
        parentPath,
        minimumTreeIndex,
        getNodeKey: this.getNodeKey,
        expandParent: true,
    }));
}

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
            rows: this.getRows(props.treeData),
        };

        this.startDrag = this.startDrag.bind(this);
        this.endDrag   = this.endDrag.bind(this);
        this.dragHover = this.dragHover.bind(this);
    }

    componentWillMount() {
        this.loadLazyChildren();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.treeData !== nextProps.treeData) {
            // Load any children defined by a function
            this.loadLazyChildren(nextProps);

            // Calculate the rows to be shown from the new tree data
            this.setState({
                draggingTreeData: null,
                rows: this.getRows(nextProps.treeData),
            });
        }
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

    getRows(treeData) {
        return getFlatDataFromTree({
            ignoreCollapsed: true,
            getNodeKey: this.getNodeKey,
            treeData,
        });
    }

    dragHover({ node, parentPath, minimumTreeIndex }) {
        const draggingTreeData = addNodeUnderParentPath({
            treeData: this.state.draggingTreeData,
            newNode: node,
            // newNode: {
            //     ...node,
            //     expanded: false, // Keep children of dragged node hidden
            // },
            parentPath,
            minimumTreeIndex,
            getNodeKey: this.getNodeKey,
            expandParent: true,
        });

        this.setState({
            rows: this.getRows(draggingTreeData),
        });
    }

    endDrag(dropResult) {
        if (!dropResult) {
            return this.setState({
                draggingTreeData: null,
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
            rowHeight,
        } = this.props;
        const { rows } = this.state;

        return (
            <div
                className={styles.tree + (className ? ` ${className}` : '')}
                style={{ height: '100%', ...style }}
            >
                <AutoSizer>
                    {({height, width}) => (
                        <VirtualScroll
                            className={styles.virtualScrollOverride}
                            width={width}
                            height={height}
                            rowCount={rows.length}
                            estimatedRowSize={rowHeight}
                            rowHeight={rowHeight}
                            rowRenderer={({ index }) => this.renderRow(rows[index], index)}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    renderRow({ node, path, lowerSiblingCounts }, treeIndex) {
        const NodeContentRenderer = this.nodeContentRenderer;
        const nodeProps = !this.props.generateNodeProps ? {} : this.props.generateNodeProps({
            node,
            path,
            lowerSiblingCounts,
            treeIndex,
        });

        return (
            <TreeNode
                treeIndex={treeIndex}
                node={node}
                path={path}
                lowerSiblingCounts={lowerSiblingCounts}
                scaffoldBlockPxWidth={this.props.scaffoldBlockPxWidth}
                dragHover={this.dragHover}
            >
                <NodeContentRenderer
                    node={node}
                    path={path}
                    lowerSiblingCounts={lowerSiblingCounts}
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
    treeData:   PropTypes.arrayOf(PropTypes.object).isRequired,
    changeData: PropTypes.func,

    // Callback for move operation.
    // Called as moveNode({ node, path, parentPath, minimumTreeIndex })
    moveNode: PropTypes.func,

    // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
    style: PropTypes.object,
    className: PropTypes.string,

    // Height of each node row, used for react-virtualized
    rowHeight: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),

    scaffoldBlockPxWidth: PropTypes.number,

    nodeContentRenderer: PropTypes.any,
    generateNodeProps:   PropTypes.func,

    getNodeKey:                PropTypes.func,
    updateTreeData:            PropTypes.func,
    toggleChildrenVisibility:  PropTypes.func,
    loadCollapsedLazyChildren: PropTypes.bool,
};

ReactSortableTree.defaultProps = {
    rowHeight: 62,
    style: {},
    scaffoldBlockPxWidth: 44,
    loadCollapsedLazyChildren: false,
};

export default dndWrapRoot(ReactSortableTree);
