import React, { PropTypes } from 'react';

const InnerContentRenderer = ({node, styles, path, treeIndex, buttons}) => {
    return (<div className={styles.rowContents}>
        <div className={styles.rowLabel}>
            <span className={styles.rowTitle + (node.subtitle ? ` ${styles.rowTitleWithSubtitle}` : '')}>
                {typeof node.title === 'function' ?
                    node.title({node, path, treeIndex}) :
                    node.title
                }
            </span>

            {node.subtitle &&
                <span className={styles.rowSubtitle}>
                    {typeof node.subtitle === 'function' ?
                        node.subtitle({node, path, treeIndex}) :
                        node.subtitle
                    }
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
    </div>);
};

InnerContentRenderer.propTypes = {
    node:          PropTypes.object.isRequired,
    path:          PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
    styles:        PropTypes.object,
    treeIndex:     PropTypes.number.isRequired,
    buttons:       PropTypes.arrayOf(PropTypes.node),
};

export default InnerContentRenderer;
