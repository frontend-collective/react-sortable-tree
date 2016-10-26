import React from 'react';

export const contentRenderer = function({node, styles, path, treeIndex, buttons}) {
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
