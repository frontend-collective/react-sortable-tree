import React, { PropTypes, Children, Component, cloneElement } from 'react';
import styles from './tree-node.scss';

class TreeNode extends Component {
    render() {
        const {
            children,
            listIndex,
            swapFrom,
            swapLength,
            swapDepth,
            scaffoldBlockPxWidth,
            lowerSiblingCounts,
            connectDropTarget,
            isOver,
            draggedNode,
            canDrop,
            treeIndex,
            node:       _node,       // Delete from otherProps
            path:       _path,       // Delete from otherProps
            ...otherProps,
        } = this.props;
        const {
            getPrevRow: _getPrevRow, // Delete from passProps and avoid eslint warnings
            maxDepth:   _maxDepth,   // Delete from passProps and avoid eslint warnings
            dragHover:  _dragHover,  // Delete from passProps and avoid eslint warnings
            ...passProps,
        } = otherProps;
        // Construct the scaffold representing the structure of the tree
        const scaffoldBlockCount = lowerSiblingCounts.length;
        const scaffold = [];
        lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
            let lineClass = '';
            if (lowerSiblingCount > 0) {
                // At this level in the tree, the nodes had sibling nodes further down

                if (listIndex === 0) {
                    // Top-left corner of the tree
                    // +-----+
                    // |     |
                    // |  +--+
                    // |  |  |
                    // +--+--+
                    lineClass = `${styles.lineHalfHorizontalRight} ${styles.lineHalfVerticalBottom}`;
                } else if (i === scaffoldBlockCount - 1) {
                    // Last scaffold block in the row, right before the row content
                    // +--+--+
                    // |  |  |
                    // |  +--+
                    // |  |  |
                    // +--+--+
                    lineClass = `${styles.lineHalfHorizontalRight} ${styles.lineFullVertical}`;
                } else {
                    // Simply connecting the line extending down to the next sibling on this level
                    // +--+--+
                    // |  |  |
                    // |  |  |
                    // |  |  |
                    // +--+--+
                    lineClass = styles.lineFullVertical;
                }
            } else if (listIndex === 0) {
                // Top-left corner of the tree, but has no siblings
                // +-----+
                // |     |
                // |  +--+
                // |     |
                // +-----+
                lineClass = styles.lineHalfHorizontalRight;
            } else if (i === scaffoldBlockCount - 1) {
                // The last or only node in this level of the tree
                // +--+--+
                // |  |  |
                // |  +--+
                // |     |
                // +-----+
                lineClass = `${styles.lineHalfVerticalTop} ${styles.lineHalfHorizontalRight}`;
            }

            scaffold.push(
                <div
                    key={`pre_${i}`}
                    style={{ width: scaffoldBlockPxWidth }}
                    className={`${styles.lineBlock} ${lineClass}`}
                />
            );

            if (treeIndex !== listIndex && i === swapDepth) {
                // This row has been shifted, and is at the depth of
                // the line pointing to the new destination
                let highlightLineClass = '';

                if (listIndex === swapFrom + swapLength - 1) {
                    // This block is on the bottom (target) line
                    // This block points at the target block (where the row will go when released)
                    highlightLineClass = styles.highlightBottomLeftCorner;
                } else if (treeIndex === swapFrom) {
                    // This block is on the top (source) line
                    highlightLineClass = styles.highlightTopLeftCorner;
                } else {
                    // This block is between the bottom and top
                    highlightLineClass = styles.highlightLineVertical;
                }

                scaffold.push(
                    <div
                        key={`highlight_${i}`}
                        style={{
                            width: scaffoldBlockPxWidth,
                            left: scaffoldBlockPxWidth * i,
                        }}
                        className={`${styles.absoluteLineBlock} ${highlightLineClass}`}
                    />
                );
            }
        });

        return connectDropTarget(
            <div
                {...passProps}
                className={styles.node}
            >
                {scaffold}

                <div
                    className={styles.nodeContent}
                    style={{ left: scaffoldBlockPxWidth * scaffoldBlockCount }}
                >
                    {Children.map(children, child => cloneElement(child, {
                        isOver,
                        canDrop,
                        draggedNode,
                    }))}
                </div>
            </div>
        );
    }
}

TreeNode.propTypes = {
    treeIndex:            PropTypes.number.isRequired,
    node:                 PropTypes.object.isRequired,
    path:                 PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
    swapFrom:             PropTypes.number,
    swapDepth:            PropTypes.number,
    swapLength:           PropTypes.number,
    scaffoldBlockPxWidth: PropTypes.number.isRequired,
    lowerSiblingCounts:   PropTypes.array.isRequired,

    listIndex: PropTypes.number.isRequired,
    children:  PropTypes.node,

    // Drop target
    connectDropTarget: PropTypes.func.isRequired,
    isOver:            PropTypes.bool.isRequired,
    canDrop:           PropTypes.bool.isRequired,
    draggedNode:       PropTypes.object,
};

export default TreeNode;
