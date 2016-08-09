// Performs a depth-first traversal over all of the node descendants,
// incrementing currentIndex by 1 for each
function getNodeDataAtTreeIndexOrNextIndex({
    node,
    currentIndex,
    targetIndex,
    getNodeKey,
    parentPath = [],
    lowerSiblingCounts = [],
    ignoreCollapsed = true,
}) {
    // Return target node when found
    if (currentIndex === targetIndex) {
        return { node, parentPath, lowerSiblingCounts };
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
            targetIndex,
            getNodeKey,
            node: node.children[i],
            currentIndex: childIndex,
            lowerSiblingCounts: [ ...lowerSiblingCounts, childCount - i - 1 ],

            // The pseudo-root, with a null parent path, is not considered in the parent path
            parentPath: parentPath !== null ? [ ...parentPath, getNodeKey(node, childIndex) ] : [],
        });

        if (result.node) {
            return result;
        }

        childIndex = result.nextIndex;
    }

    // If the target node is not found, return the farthest traversed index
    return { nextIndex: childIndex };
}


function getDescendants({
    node,
    currentIndex,
    getNodeKey,
    parentPath = [],
    lowerSiblingCounts = [],
    isPseudoRoot = false,
}) {
    const selfInfo = !isPseudoRoot ? [{ node, parentPath, lowerSiblingCounts }] : [];

    // Return self on nodes with no children or hidden children
    if (!node.children || (node.expanded !== true && !isPseudoRoot)) {
        return selfInfo;
    }

    // Get all descendants
    let childIndex   = currentIndex + 1;
    const childCount = node.children.length;
    const descendants = [];
    const selfKey = !isPseudoRoot ? getNodeKey(node, currentIndex) : null;
    for (let i = 0; i < childCount; i++) {
        descendants[i] = getDescendants({
            getNodeKey,
            node: node.children[i],
            currentIndex: childIndex,
            lowerSiblingCounts: [ ...lowerSiblingCounts, childCount - i - 1 ],

            // The pseudo-root, with a null parent path, is not considered in the parent path
            parentPath: !isPseudoRoot ? [ ...parentPath, selfKey ] : [],
        });

        childIndex += descendants[i].length;
    }

    // Flatten all descendant arrays into a single flat array
    return selfInfo.concat(...descendants);
}

/**
 * Count all the visible (expanded) descendants in the tree data.
 *
 * @param {!Object[]} data - Tree data
 *
 * @return {number} count
 */
export function getVisibleNodeCount(data) {
    const traverse = (node) => {
        if (!node.children || node.expanded !== true) {
            return 1;
        }

        return 1 + node.children.reduce((total, currentNode) => (total + traverse(currentNode)), 0);
    };

    return data.reduce((total, currentNode) => total + traverse(currentNode), 0);
}

/**
 * Get the <targetIndex>th visible node in the tree data.
 *
 * @param {!Object[]} data - Tree data
 * @param {!number} targetIndex - The index of the node to search for
 * @param {function} getNodeKey - Function to get the key from the nodeData and tree index
 *
 * @return {{
 *      node: Object,
 *      parentPath: []string|[]number,
 *      lowerSiblingCounts: []number
 *  }|null} node - The node at targetIndex, or null if not found
 */
export function getVisibleNodeInfoAtIndex(data, targetIndex, getNodeKey) {
    if (!data || data.length < 1) {
        return null;
    }

    // Call the tree traversal with a pseudo-root node
    const result = getNodeDataAtTreeIndexOrNextIndex({
        targetIndex,
        getNodeKey,
        node: {
            children: data,
            expanded: true,
        },
        currentIndex: -1,
        parentPath: null,
        lowerSiblingCounts: [],
    });

    if (result.node) {
        return result;
    }

    return null;
}

/**
 * Get visible node data flattened.
 *
 * @param {!Object[]} data - Tree data
 * @param {!number} targetIndex - The index of the node to search for
 * @param {function} getNodeKey - Function to get the key from the nodeData and tree index
 *
 * @return {{
 *      node: Object,
 *      parentPath: []string|[]number,
 *      lowerSiblingCounts: []number
 *  }}[] nodes - The node array
 */
export function getVisibleNodeInfoFlattened(treeData, getNodeKey) {
    if (!treeData || treeData.length < 1) {
        return [];
    }

    return getDescendants({
        getNodeKey,
        node: { children: treeData },
        currentIndex: -1,
        parentPath: [],
        isPseudoRoot: true,
        lowerSiblingCounts: [],
    });
}

/**
 * Replaces node at path with object, or callback-defined object
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be changed
 * @param {function|any} newNode - Node to replace the node at the path with, or a function producing the new node
 * @param {function} getNodeKey - Function to get the key from the nodeData and tree index
 *
 * @return {Object} changedTreeData - The updated tree data
 */
export function changeNodeAtPath(treeData, path, newNode, getNodeKey) {
    const traverse = ({
        node,
        currentTreeIndex,
        pathIndex = 0,
    }) => {
        if (getNodeKey(node, currentTreeIndex) === path[pathIndex]) {
            if (pathIndex >= path.length - 1) {
                // If this is the final location in the path, return its changed form
                return typeof newNode === 'function' ? newNode(node, currentTreeIndex) : newNode;
            } else if (!node.children) {
                // If this node is part of the path, but has no children, return the unchanged node
                throw new Error('Path referenced children of node with no children.');
            }

            let nextTreeIndex = currentTreeIndex;
            for (let i = 0; i < node.children.length; i++) {
                const result = traverse({
                    node: node.children[i],
                    currentTreeIndex: nextTreeIndex,
                    pathIndex: pathIndex + 1,
                });

                if (result) {
                    return {
                        ...node,
                        children: [
                            ...node.children.slice(0, i),
                            result,
                            ...node.children.slice(i + 1),
                        ],
                    };
                }

                nextTreeIndex = getNodeDataAtTreeIndexOrNextIndex({
                    getNodeKey,
                    node: treeData[i],
                    currentIndex: nextTreeIndex + 1,
                    targetIndex: -1,
                    ignoreCollapsed: false,
                }).nextIndex;
            }
        }

        return null;
    };

    // Use a pseudo-root node in the beginning traversal
    const result = traverse({
        node: { children: treeData },
        currentTreeIndex: -1,
        pathIndex: -1,
    });

    if (!result) {
        throw new Error('No node found at the given path.');
    }

    return result.children;
}

// Performs change to every node in the tree

// Passive visit to every node in the tree
