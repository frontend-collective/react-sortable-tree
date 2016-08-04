import React, { PropTypes } from 'react';
import styles from './node-renderer-default.scss';

const NodeRendererDefault = ({
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    nodeData,
    buttons,
}) => (
    <div style={{ height: '100%' }}>
        {toggleChildrenVisibility && nodeData.children && nodeData.children.length > 0 && (
            <div
                className={nodeData.expanded ? styles.collapseButton : styles.expandButton}
                style={{ left: -0.5 * scaffoldBlockPxWidth }}
                onClick={toggleChildrenVisibility}
            />
        )}

        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
            <div className={styles.row + (isDragging ? ` ${styles.rowOriginWhileDragging}` : '')}>
                {connectDragSource(( // Sets this handle as the element to start a drag-and-drop
                    <div
                        className={`${styles.rowItem} ${styles.moveHandle}`}
                    />
                ), { dropEffect: 'copy' })}

                <div className={styles.rowContents}>
                    <div className={styles.rowLabel}>
                        <span
                            className={styles.rowTitle +
                                (nodeData.value.subtitle ? ` ${styles.rowTitleWithSubtitle}` : '')
                            }
                        >
                            {nodeData.value.title}
                        </span>

                        {nodeData.value.subtitle &&
                            <span className={styles.rowSubtitle}>
                                {nodeData.value.subtitle}
                            </span>
                        }
                    </div>

                    <div className={styles.rowToolbar}>
                        {buttons && buttons.map((btn, index) => (
                            <div key={index} className={styles.rowItem}>
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
    nodeData:             PropTypes.object.isRequired,
    parentPath:           PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
    lowerSiblingCounts:   PropTypes.arrayOf(PropTypes.number).isRequired,

    scaffoldBlockPxWidth:     PropTypes.number.isRequired,
    toggleChildrenVisibility: PropTypes.func,
    buttons:                  PropTypes.object.isRequired,

    // Drag and drop API functions
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource:  PropTypes.func.isRequired,
    isDragging:         PropTypes.bool.isRequired,
};

export default NodeRendererDefault;
