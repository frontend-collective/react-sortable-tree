import React, { PropTypes } from 'react';
import { getIEVersion } from './utils/browser-utils';
import baseStyles from './node-renderer-default.scss';

let styles = baseStyles;
// Add extra classes in browsers that don't support flex
if (getIEVersion < 10) {
    styles = {
        ...baseStyles,
        row:         `${styles.row} ${styles.row_NoFlex}`,
        rowContents: `${styles.rowContents} ${styles.rowContents_NoFlex}`,
        rowLabel:    `${styles.rowLabel} ${styles.rowLabel_NoFlex}`,
        rowToolbar:  `${styles.rowToolbar} ${styles.rowToolbar_NoFlex}`,
    };
}

const NodeRendererDefault = ({
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    node,
    path,
    treeIndex,
    buttons,
}) => (
    <div style={{ height: '100%' }}>
        {toggleChildrenVisibility && node.children && node.children.length > 0 && (
            <div
                className={node.expanded ? styles.collapseButton : styles.expandButton}
                style={{ left: -0.5 * scaffoldBlockPxWidth }}
                onClick={() => toggleChildrenVisibility({node, path, treeIndex})}
            />
        )}

        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
            <div className={styles.row + (isDragging ? ` ${styles.rowOriginWhileDragging}` : '')}>
                {connectDragSource(( // Sets this handle as the element to start a drag-and-drop
                    <div className={styles.moveHandle} />
                ), { dropEffect: 'copy' })}

                <div className={styles.rowContents}>
                    <div className={styles.rowLabel}>
                        <span
                            className={styles.rowTitle +
                                (node.subtitle ? ` ${styles.rowTitleWithSubtitle}` : '')
                            }
                        >
                            {node.title}
                        </span>

                        {node.subtitle &&
                            <span className={styles.rowSubtitle}>
                                {node.subtitle}
                            </span>
                        }
                    </div>

                    <div className={styles.rowToolbar}>
                        {buttons && buttons.map((btn, index) => (
                            <div key={index} className={styles.toolbarButton}>
                                {btn}
                            </div>
                        ))}
                    </div>
                </div>
            ️</div>
        )}
    </div>
);

NodeRendererDefault.propTypes = {
    node:               PropTypes.object.isRequired,
    path:               PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
    treeIndex:          PropTypes.number.isRequired,
    lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,

    scaffoldBlockPxWidth:     PropTypes.number.isRequired,
    toggleChildrenVisibility: PropTypes.func,
    buttons:                  PropTypes.arrayOf(PropTypes.node),

    // Drag and drop API functions
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource:  PropTypes.func.isRequired,
    isDragging:         PropTypes.bool.isRequired,
};

export default NodeRendererDefault;
