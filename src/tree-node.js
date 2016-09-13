import React, { PropTypes, Children, cloneElement } from 'react';
import { dndWrapTarget } from './utils/drag-and-drop-utils';
import styles from './tree-node.scss';

const TreeNode = ({
    children,
    node,
    listIndex,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    canDrop,
    draggedNode,
}) => {
    // Construct the scaffold representing the structure of the tree
    const scaffoldBlockCount = lowerSiblingCounts.length;
    const scaffold = lowerSiblingCounts.map((lowerSiblingCount, i) => {
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

        return (
            <div
                key={`pre_${i}`}
                style={{ width: scaffoldBlockPxWidth }}
                className={`${styles.lineBlock} ${lineClass}`}
            />
        );
    });

    return connectDropTarget(
        <div className={styles.node}>
            {scaffold}

            <div
                className={styles.nodeContent}
                style={{ left: scaffoldBlockPxWidth * scaffoldBlockCount }}
            >
                {Children.map(children, child => cloneElement(child, {
                    isOver,
                    canDrop,
                    isSelf: draggedNode === node,
                }))}
            </div>
        </div>
    );
};

TreeNode.propTypes = {
    treeIndex:            PropTypes.number.isRequired,
    node:                 PropTypes.object.isRequired,
    path:                 PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
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

export default dndWrapTarget(TreeNode);
