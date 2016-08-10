/*!
 * react-sortable-tree
 * Copyright 2016 Chris Fritz All rights reserved.
 * @license Open source under the MIT License
 */

import React, { Component, PropTypes } from 'react';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import {
    DragDropContext as dragDropContext,
    DragSource as dragSource,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TreeNode from './tree-node';
import {
    getVisibleNodeCount,
    getVisibleNodeInfoFlattened,
    changeNodeAtPath,
} from './utils/tree-data-utils';
import ItemTypes from './item-types';
import styles from './react-sortable-tree.scss';

/**
 * Implements the drag source contract.
 */
const cardSource = {
    beginDrag: (props) => ({
        text: props.text,
    }),
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
    return {
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

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
        this.toggleChildrenVisibility = (
            props.toggleChildrenVisibility || defaultToggleChildrenVisibility
        ).bind(this);
        this.nodeContentRenderer = dragSource(ItemTypes.HANDLE, cardSource, collect)(
            props.nodeContentRenderer ||
            require('./node-renderer-default').default // eslint-disable-line global-require
        );
    }

    render() {
        const {
            treeData,
            rowHeight,
        } = this.props;

        const rows = getVisibleNodeInfoFlattened(treeData, this.getNodeKey);

        return (
            <div style={{ height: '100%' }} className={styles.tree}>
                <AutoSizer>
                    {({height, width}) => (
                        <VirtualScroll
                            width={width}
                            height={height}
                            rowCount={getVisibleNodeCount(treeData)}
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
                lowerSiblingCounts={lowerSiblingCounts}
                scaffoldBlockPxWidth={this.props.scaffoldBlockPxWidth}
            >
                <NodeContentRenderer
                    node={node}
                    path={path}
                    treeIndex={treeIndex}
                    lowerSiblingCounts={lowerSiblingCounts}
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
    onNodeMove: PropTypes.func,
    rowHeight:  PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]), // Used for react-virtualized

    scaffoldBlockPxWidth: PropTypes.number,

    nodeContentRenderer: PropTypes.any,
    generateNodeProps:   PropTypes.func,

    getNodeKey:               PropTypes.func,
    updateTreeData:           PropTypes.func,
    toggleChildrenVisibility: PropTypes.func,
};

ReactSortableTree.defaultProps = {
    rowHeight: 62,
    scaffoldBlockPxWidth: 44,
};

export default dragDropContext(HTML5Backend)(ReactSortableTree);
