import React, { PropTypes, Children, cloneElement } from 'react';
import { dndWrapTarget } from './utils/drag-and-drop-utils';
import styles from './tree-node.scss';

const TreeNode = ({
    children,
    treeIndex,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    canDrop,
}) => {
    // Construct the scaffold representing the structure of the tree
    const scaffoldBlockCount = lowerSiblingCounts.length;
    const scaffold = lowerSiblingCounts.map((lowerSiblingCount, i) => {
        let lineClass = '';
        if (lowerSiblingCount > 0) {
            // At this level in the tree, the nodes had sibling nodes further down

            if (treeIndex === 0) {
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
        } else if (treeIndex === 0) {
            // Top-left corner of the tree, but has no siblings
            // +-----+
            // |     |
            // |  +--+
            // |     |
            // +-----+
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
        <li className={styles.node}>
            {scaffold}

            <div
                className={styles.nodeContent}
                style={{ left: scaffoldBlockPxWidth * scaffoldBlockCount }}
            >
                {Children.map(children, child => cloneElement(child, {
                    isOver,
                    canDrop,
                }))}
            </div>
        </li>
    );
};

TreeNode.propTypes = {
    treeIndex:            PropTypes.number.isRequired,
    path:                 PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
    scaffoldBlockPxWidth: PropTypes.number.isRequired,
    children:             PropTypes.node,
    lowerSiblingCounts:   PropTypes.array.isRequired,

    // Drop target
    connectDropTarget: PropTypes.func.isRequired,
    isOver:            PropTypes.bool.isRequired,
    canDrop:           PropTypes.bool.isRequired,
};

export default dndWrapTarget(TreeNode);
