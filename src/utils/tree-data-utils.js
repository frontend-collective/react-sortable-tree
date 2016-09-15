/**
 * Performs a depth-first traversal over all of the node descendants,
 * incrementing currentIndex by 1 for each
 */
function getNodeDataAtTreeIndexOrNextIndex({
    targetIndex,
    node,
    currentIndex,
    getNodeKey,
    path = [],
    lowerSiblingCounts = [],
    ignoreCollapsed = true,
    isPseudoRoot = false,
}) {
    // The pseudo-root is not considered in the path
    const selfPath = !isPseudoRoot ? [...path, getNodeKey({ node, treeIndex: currentIndex })] : [];

    // Return target node when found
    if (currentIndex === targetIndex) {
        return {
            node,
            lowerSiblingCounts,
            path: selfPath,
        };
    }

    // Add one and continue for nodes with no children or hidden children
    if (!node.children || (ignoreCollapsed && node.expanded !== true)) {
        return { nextIndex: currentIndex + 1 };
    }

    // Iterate over each child and their ancestors and return the
    // target node if childIndex reaches the targetIndex
    let childIndex   = currentIndex + 1;
    const childCount = node.children.length;
    for (let i = 0; i < childCount; i++) {
        const result = getNodeDataAtTreeIndexOrNextIndex({
            ignoreCollapsed,
            getNodeKey,
            targetIndex,
            node: node.children[i],
            currentIndex: childIndex,
            lowerSiblingCounts: [ ...lowerSiblingCounts, childCount - i - 1 ],
            path: selfPath,
        });

        if (result.node) {
            return result;
        }

        childIndex = result.nextIndex;
    }

    // If the target node is not found, return the farthest traversed index
    return { nextIndex: childIndex };
}

export function getDescendantCount({ node, ignoreCollapsed = true }) {
    return getNodeDataAtTreeIndexOrNextIndex({
        getNodeKey: () => {},
        ignoreCollapsed,
        node,
        currentIndex: 0,
        targetIndex:  -1,
    }).nextIndex - 1;
}

/**
 * Walk all descendants of the given node
 */
function walkDescendants({
    callback,
    getNodeKey,
    ignoreCollapsed,
    isPseudoRoot = false,
    node,
    currentIndex,
    path = [],
    lowerSiblingCounts = [],
}) {
    // The pseudo-root is not considered in the path
    const selfPath = !isPseudoRoot ? [ ...path, getNodeKey({ node, treeIndex: currentIndex }) ] : [];
    const selfInfo = !isPseudoRoot ? { node, path: selfPath, lowerSiblingCounts, treeIndex: currentIndex } : null;
    if (!isPseudoRoot) {
        const callbackResult = callback(selfInfo);

        // Cut walk short if the callback returned false
        if (callbackResult === false) {
            return false;
        }
    }

    // Return self on nodes with no children or hidden children
    if (!node.children || (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)) {
        return currentIndex;
    }

    // Get all descendants
    let childIndex   = currentIndex;
    const childCount = node.children.length;
    if (typeof node.children !== 'function') {
        for (let i = 0; i < childCount; i++) {
            childIndex = walkDescendants({
                callback,
                getNodeKey,
                ignoreCollapsed,
                node: node.children[i],
                currentIndex: childIndex + 1,
                lowerSiblingCounts: [ ...lowerSiblingCounts, childCount - i - 1 ],
                path: selfPath,
            });

            // Cut walk short if the callback returned false
            if (childIndex === false) {
                return false;
            }
        }
    }

    return childIndex;
}

/**
 * Perform a change on the given node and all its descendants
 */
function mapDescendants({
    callback,
    getNodeKey,
    ignoreCollapsed,
    isPseudoRoot = false,
    node,
    currentIndex,
    path = [],
    lowerSiblingCounts = [],
}) {
    // The pseudo-root is not considered in the path
    const selfPath = !isPseudoRoot ? [ ...path, getNodeKey({ node, treeIndex: currentIndex }) ] : [];
    const selfInfo = !isPseudoRoot ? { node, path: selfPath, lowerSiblingCounts, treeIndex: currentIndex } : null;

    // Return self on nodes with no children or hidden children
    if (!node.children || (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)) {
        return {
            treeIndex: currentIndex,
            node: callback(selfInfo),
        };
    }

    // Get all descendants
    let childIndex   = currentIndex;
    const childCount = node.children.length;
    let newChildren  = node.children;
    if (typeof newChildren !== 'function') {
        newChildren = newChildren.map((child, i) => {
            const mapResult = mapDescendants({
                callback,
                getNodeKey,
                ignoreCollapsed,
                node: child,
                currentIndex: childIndex + 1,
                lowerSiblingCounts: [ ...lowerSiblingCounts, childCount - i - 1 ],
                path: selfPath,
            });
            childIndex = mapResult.treeIndex;

            return mapResult.node;
        });
    }

    return {
        node: callback({
            ...selfInfo,
            node: {
                ...node,
                children: newChildren,
            },
        }),
        treeIndex: childIndex,
    };
}

/**
 * Count all the visible (expanded) descendants in the tree data.
 *
 * @param {!Object[]} treeData - Tree data
 *
 * @return {number} count
 */
export function getVisibleNodeCount({ treeData }) {
    const traverse = (node) => {
        if (!node.children || node.expanded !== true || (typeof node.children === 'function')) {
            return 1;
        }

        return 1 + node.children.reduce((total, currentNode) => (total + traverse(currentNode)), 0);
    };

    return treeData.reduce((total, currentNode) => total + traverse(currentNode), 0);
}

/**
 * Get the <targetIndex>th visible node in the tree data.
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!number} targetIndex - The index of the node to search for
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 *
 * @return {{
 *      node: Object,
 *      path: []string|[]number,
 *      lowerSiblingCounts: []number
 *  }|null} node - The node at targetIndex, or null if not found
 */
export function getVisibleNodeInfoAtIndex({ treeData, index: targetIndex, getNodeKey }) {
    if (!treeData || treeData.length < 1) {
        return null;
    }

    // Call the tree traversal with a pseudo-root node
    const result = getNodeDataAtTreeIndexOrNextIndex({
        targetIndex,
        getNodeKey,
        node: {
            children: treeData,
            expanded: true,
        },
        currentIndex: -1,
        path: [],
        lowerSiblingCounts: [],
        isPseudoRoot: true,
    });

    if (result.node) {
        return result;
    }

    return null;
}

/**
 * Walk descendants depth-first and call a callback on each
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {function} callback - Function to call on each node
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 */
export function walk({ treeData, getNodeKey, callback, ignoreCollapsed = true }) {
    if (!treeData || treeData.length < 1) {
        return;
    }

    return walkDescendants({
        callback,
        getNodeKey,
        ignoreCollapsed,
        isPseudoRoot: true,
        node: { children: treeData },
        currentIndex: -1,
        path: [],
        lowerSiblingCounts: [],
    });
}

/**
 * Perform a depth-first transversal of the descendants and
 *  make a change to every node in the tree
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {function} callback - Function to call on each node
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 */
export function map({ treeData, getNodeKey, callback, ignoreCollapsed = true }) {
    if (!treeData || treeData.length < 1) {
        return [];
    }

    return mapDescendants({
        callback,
        getNodeKey,
        ignoreCollapsed,
        isPseudoRoot: true,
        node: { children: treeData },
        currentIndex: -1,
        path: [],
        lowerSiblingCounts: [],
    }).node.children;
}

/**
 * Expand or close every node in the tree
 *
 * @param {!Object[]} treeData - Tree data
 * @param {?boolean} expanded - Whether the node is expanded or not
 */
export function toggleExpandedForAll({ treeData, expanded = true }) {
    return map({
        treeData,
        callback: ({ node }) => ({ ...node, expanded }),
        getNodeKey: ({ treeIndex }) => treeIndex,
        ignoreCollapsed: false,
    });
}

/**
 * Replaces node at path with object, or callback-defined object
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be changed
 * @param {function|any} newNode - Node to replace the node at the path with, or a function producing the new node
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object} changedTreeData - The updated tree data
 */
export function changeNodeAtPath({ treeData, path, newNode, getNodeKey, ignoreCollapsed = true }) {
    const RESULT_MISS = 'RESULT_MISS';
    const traverse = ({
        isPseudoRoot = false,
        node,
        currentTreeIndex,
        pathIndex,
    }) => {
        if (!isPseudoRoot && getNodeKey({ node, treeIndex: currentTreeIndex }) !== path[pathIndex]) {
            return RESULT_MISS;
        }

        if (pathIndex >= path.length - 1) {
            // If this is the final location in the path, return its changed form
            return typeof newNode === 'function' ? newNode({ node, treeIndex: currentTreeIndex }) : newNode;
        } else if (!node.children) {
            // If this node is part of the path, but has no children, return the unchanged node
            throw new Error('Path referenced children of node with no children.');
        }

        let nextTreeIndex = currentTreeIndex + 1;
        for (let i = 0; i < node.children.length; i++) {
            const result = traverse({
                node:             node.children[i],
                currentTreeIndex: nextTreeIndex,
                pathIndex:        pathIndex + 1,
            });

            // If the result went down the correct path
            if (result !== RESULT_MISS) {
                if (result) {
                    // If the result was truthy (in this case, an object),
                    //  pass it to the next level of recursion up
                    return {
                        ...node,
                        children: [
                            ...node.children.slice(0, i),
                            result,
                            ...node.children.slice(i + 1),
                        ],
                    };
                }
                // If the result was falsy (returned from the newNode function), then
                //  delete the node from the array.
                return {
                    ...node,
                    children: [
                        ...node.children.slice(0, i),
                        ...node.children.slice(i + 1),
                    ],
                };
            }

            nextTreeIndex += 1 + getDescendantCount({ node: node.children[i], ignoreCollapsed });
        }

        return RESULT_MISS;
    };

    // Use a pseudo-root node in the beginning traversal
    const result = traverse({
        node: { children: treeData },
        currentTreeIndex: -1,
        pathIndex: -1,
        isPseudoRoot: true,
    });

    if (result === RESULT_MISS) {
        throw new Error('No node found at the given path.');
    }

    return result.children;
}

/**
 * Removes the node at the specified path and returns the resulting treeData.
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object} changedTreeData - The updated tree data
 */
export function removeNodeAtPath({ treeData, path, getNodeKey, ignoreCollapsed = true }) {
    return changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        ignoreCollapsed,
        newNode: null, // Delete the node
    });
}

/**
 * Gets the node at the specified path
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object|null} nodeInfo - The node info at the given path, or null if not found
 */
export function getNodeAtPath({ treeData, path, getNodeKey, ignoreCollapsed = true }) {
    let foundNodeInfo = null;

    try {
        changeNodeAtPath({
            treeData,
            path,
            getNodeKey,
            ignoreCollapsed,
            newNode: ({ node, treeIndex }) => {
                foundNodeInfo = { node, treeIndex };
                return node;
            },
        });
    } catch (err) {
        // Ignore the error -- the null return will be explanation enough
    }

    return foundNodeInfo;
}

/**
 * Adds the node to the specified parent and returns the resulting treeData.
 *
 * @param {!Object[]} treeData
 * @param {!Object} newNode - The node to insert
 * @param {number|string} parentKey - The key of the to-be parentNode of the node
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} expandParent - If true, expands the parentNode specified by parentPath
 *
 * @return {Object} result
 * @return {Object} result.treeData - The updated tree data
 * @return {number} result.treeIndex - The tree index at which the node was inserted
 */
export function addNodeUnderParent({
    treeData,
    newNode,
    parentKey = null,
    getNodeKey,
    ignoreCollapsed = true,
    expandParent = false,
}) {
    if (parentKey === null) {
        return {
            treeData: [ ...(treeData || []), newNode],
            treeIndex: (treeData || []).length,
        };
    }

    let insertedTreeIndex = null;
    let hasBeenAdded = false;
    const changedTreeData = map({
        treeData,
        getNodeKey,
        ignoreCollapsed,
        callback: ({ node, treeIndex, path }) => {
            const key = path ? path[path.length - 1] : null;
            // Return nodes that are not the parent as-is
            if (hasBeenAdded || key !== parentKey) {
                return node;
            }
            hasBeenAdded = true;

            const parentNode = {
                ...node,
            };

            if (expandParent) {
                parentNode.expanded = true;
            }

            // If no children exist yet, just add the single newNode
            if (!parentNode.children) {
                insertedTreeIndex = treeIndex + 1;
                return {
                    ...parentNode,
                    children: [ newNode ],
                };
            }

            if (typeof parentNode.children === 'function') {
                throw new Error('Cannot add to children defined by a function');
            }

            let nextTreeIndex = treeIndex + 1;
            for (let i = 0; i < parentNode.children.length; i++) {
                nextTreeIndex += 1 + getDescendantCount({ node: parentNode.children[i], ignoreCollapsed });
            }

            insertedTreeIndex = nextTreeIndex;

            return {
                ...parentNode,
                children: [ ...parentNode.children, newNode ],
            };
        },
    });

    if (!hasBeenAdded) {
        throw new Error('No node found with the given key.');
    }

    return {
        treeData: changedTreeData,
        treeIndex: insertedTreeIndex,
    };
}

function addNodeAtDepthAndIndex({
    targetDepth,
    minimumTreeIndex,
    newNode,
    ignoreCollapsed,
    expandParent,
    isPseudoRoot = false,
    isLastChild,
    node,
    currentIndex,
    currentDepth,
}) {
    if (currentDepth === targetDepth) {
        return {
            node,
            nextIndex: currentIndex + 1 + getDescendantCount({ node, ignoreCollapsed }),
        };
    }

    // If the current position is the only possible place to add, add it
    if (currentIndex >= minimumTreeIndex - 1 || (isLastChild && !node.children)) {
        if (typeof node.children === 'function') {
            throw new Error('Cannot add to children defined by a function');
        } else {
            const extraNodeProps = expandParent ? { expanded: true } : {};
            return {
                node: {
                    ...node,

                    ...extraNodeProps,
                    children: node.children ? [newNode, ...node.children] : [newNode],
                },
                nextIndex: currentIndex + 2,
                insertedTreeIndex: currentIndex + 1,
            };
        }
    }

    if (currentDepth === targetDepth - 1) {
        // Skip over nodes with no children or hidden children
        if (!node.children ||
            typeof node.children === 'function' ||
            (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)
        ) {
            return { node, nextIndex: currentIndex + 1 };
        }

        let childIndex        = currentIndex + 1;
        let insertedTreeIndex = null;
        let insertIndex       = null;
        for (let i = 0; i < node.children.length; i++) {
            if (childIndex >= minimumTreeIndex) {
                insertedTreeIndex = childIndex;
                insertIndex = i;
                break;
            }

            childIndex += 1 + getDescendantCount({ node: node.children[i], ignoreCollapsed });
        }

        if (insertIndex === null) {
            if (childIndex < minimumTreeIndex && !isLastChild) {
                return { node, nextIndex: childIndex };
            }

            insertedTreeIndex = childIndex;
            insertIndex = node.children.length;
        }

        return {
            node: {
                ...node,
                children: [
                    ...node.children.slice(0, insertIndex),
                    newNode,
                    ...node.children.slice(insertIndex),
                ],
            },
            nextIndex: childIndex,
            insertedTreeIndex,
        };
    }

    // Skip over nodes with no children or hidden children
    if (!node.children ||
        typeof node.children === 'function' ||
        (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)
    ) {
        return { node, nextIndex: currentIndex + 1 };
    }

    // Get all descendants
    let insertedTreeIndex = null;
    let childIndex        = currentIndex + 1;
    let newChildren       = node.children;
    if (typeof newChildren !== 'function') {
        newChildren = newChildren.map((child, i) => {
            if (insertedTreeIndex !== null) {
                return child;
            }

            const mapResult = addNodeAtDepthAndIndex({
                targetDepth,
                minimumTreeIndex,
                newNode,
                ignoreCollapsed,
                expandParent,
                isLastChild: isLastChild && i === newChildren.length - 1,
                node: child,
                currentIndex: childIndex,
                currentDepth: currentDepth + 1,
            });

            if ('insertedTreeIndex' in mapResult) {
                ({ insertedTreeIndex } = mapResult);
            }

            childIndex = mapResult.nextIndex;

            return mapResult.node;
        });
    }

    const result = {
        node: { ...node, children: newChildren },
        nextIndex: childIndex,
    };

    if (insertedTreeIndex !== null) {
        result.insertedTreeIndex = insertedTreeIndex;
    }

    return result;
}

/**
 * Insert a node into the tree at the given depth, after the minimum index
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!number} depth - The depth to insert the node at
 * @param {!number} minimumTreeIndex - The lowest possible treeIndex to insert the node at
 * @param {!Object} newNode - The node to insert into the tree
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} expandParent - If true, expands the parent of the inserted node
 */
export function insertNode({
    treeData,
    depth: targetDepth,
    minimumTreeIndex,
    newNode,
    ignoreCollapsed = true,
    expandParent = false,
}) {
    if (!treeData && targetDepth === 0) {
        return {
            treeData: [newNode],
            treeIndex: 0,
        };
    }

    const insertResult = addNodeAtDepthAndIndex({
        targetDepth,
        minimumTreeIndex,
        newNode,
        ignoreCollapsed,
        expandParent,
        isPseudoRoot: true,
        isLastChild: true,
        node: { children: treeData },
        currentIndex: -1,
        currentDepth: -1,
    });

    if (!('insertedTreeIndex' in insertResult)) {
        throw new Error('No suitable position found to insert.');
    }

    return {
        treeData:  insertResult.node.children,
        treeIndex: insertResult.insertedTreeIndex,
    };
}

/**
 * Get tree data flattened.
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {{
 *      node: Object,
 *      path: []string|[]number,
 *      lowerSiblingCounts: []number
 *  }}[] nodes - The node array
 */
export function getFlatDataFromTree({ treeData, getNodeKey, ignoreCollapsed = true }) {
    if (!treeData || treeData.length < 1) {
        return [];
    }

    const flattened = [];
    walk({
        treeData,
        getNodeKey,
        ignoreCollapsed,
        callback: ({ node, lowerSiblingCounts, path, treeIndex }) => {
            flattened.push({ node, lowerSiblingCounts, path, treeIndex });
        },
    });

    return flattened;
}

/**
 * Generate a tree structure from flat data.
 *
 * @param {!Object[]} flatData
 * @param {!function} getKey - Function to get the key from the nodeData
 * @param {!function} getParentKey - Function to get the parent key from the nodeData
 *
 * @return {Object[]} treeData - The flat data represented as a tree
 */
export function getTreeFromFlatData({
    flatData,
    getKey,
    getParentKey,
    rootKey,
}) {
    if (!flatData) {
        return [];
    }

    const childrenToParents = {};
    flatData.forEach(child => {
        const parentKey = getParentKey(child);

        if (parentKey in childrenToParents) {
            childrenToParents[parentKey].push(child);
        } else {
            childrenToParents[parentKey] = [ child ];
        }
    });

    if (!(rootKey in childrenToParents)) {
        return [];
    }

    const trav = (parent) => {
        const parentKey = getKey(parent);
        if (parentKey in childrenToParents) {
            return {
                ...parent,
                children: childrenToParents[parentKey].map(child => trav(child)),
            };
        }

        return { ...parent };
    };

    return childrenToParents[rootKey].map(child => trav(child));
}

/**
 * Check if a node is a descendant of another node.
 *
 * @param {!Object} older - Potential ancestor of younger node
 * @param {!Object} younger - Potential descendant of older node
 *
 * @return {boolean}
 */
export function isDescendant(older, younger) {
    return !!older.children && typeof older.children !== 'function' &&
        older.children.some(child => (child === younger || isDescendant(child, younger)));
}

/**
 * Get the maximum depth of the children (the depth of the root node is 0).
 *
 * @param {!Object} node - Node in the tree
 * @param {?number} depth - The current depth
 *
 * @return {boolean}
 */
export function getDepth(node, depth = 0) {
    if (!node.children) {
        return depth;
    }

    if (typeof node.children === 'function') {
        return depth + 1;
    }

    return node.children.reduce(
        (deepest, child) => Math.max(deepest, getDepth(child, depth + 1)),
        depth
    );
}
