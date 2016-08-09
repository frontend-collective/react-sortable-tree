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

class ReactSortableTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodeContentRenderer: dragSource(ItemTypes.HANDLE, cardSource, collect)(props.nodeContentRenderer),
            key: 'value',
        };
    }

    render() {
        const {
            treeData,
            rowHeight,
            getNodeKey,
        } = this.props;

        const rows = getVisibleNodeInfoFlattened(treeData, getNodeKey);

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

    renderRow({ node, parentPath, lowerSiblingCounts }, listIndex) {
        const NodeContentRenderer = this.state.nodeContentRenderer;
        const nodeProps = !this.props.generateNodeProps ? {} : this.props.generateNodeProps({
            nodeData: node,
            parentPath,
            lowerSiblingCounts,
            listIndex,
        });

        return (
            <TreeNode
                listIndex={listIndex}
                lowerSiblingCounts={lowerSiblingCounts}
                scaffoldBlockPxWidth={this.props.scaffoldBlockPxWidth}
            >
                <NodeContentRenderer
                    nodeData={node}
                    parentPath={parentPath}
                    lowerSiblingCounts={lowerSiblingCounts}
                    toggleChildrenVisibility={() => 1}
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

    getNodeKey: PropTypes.func,
};

ReactSortableTree.defaultProps = {
    nodeContentRenderer: require('./node-renderer-default').default, // eslint-disable-line global-require
    rowHeight: 62,
    scaffoldBlockPxWidth: 44,
    getNodeKey: (nodeData, treeIndex) => treeIndex,
};

export default dragDropContext(HTML5Backend)(ReactSortableTree);
