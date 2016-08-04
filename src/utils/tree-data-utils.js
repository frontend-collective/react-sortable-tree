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
 *
 * @return {{
 *      node: Object,
 *      parentPath: []string|[]number,
 *      lowerSiblingCounts: []number
 *  }|null} node - The node at targetIndex, or null if not found
 */
export function getVisibleNodeInfoAtIndex(data, targetIndex) {
    if (!data || data.length < 1) {
        return null;
    }

    // Performs a depth-first traversal over all of the node descendants,
    // incrementing currentIndex by 1 for each
    const traverse = (node, currentIndex, parentPath, lowerSiblingCounts) => {
        // Return target node when found
        if (currentIndex === targetIndex) {
            return { node, parentPath, lowerSiblingCounts };
        }

        // Add one and continue for nodes with no children or hidden children
        if (!node.children || node.expanded !== true) {
            return { currentIndex: currentIndex + 1 };
        }

        // Iterate over each child and their ancestors and return the
        // target node if childIndex reaches the targetIndex
        let childIndex   = currentIndex + 1;
        const childCount = node.children.length;
        for (let i = 0; i < childCount; i++) {
            const result = traverse(
                node.children[i],
                childIndex,
                [ ...parentPath, node.key ],
                [ ...lowerSiblingCounts, childCount - i - 1 ]
            );

            if (result.node) {
                return result;
            }

            childIndex = result.currentIndex;
        }

        // If the target node is not found, return the farthest traversed index
        return { currentIndex: childIndex };
    };

    // Kick off the search on the top level of the data array
    let currentIndex = 0;
    const nodeCount = data.length;
    for (let i = 0; i < nodeCount; i++) {
        const result = traverse(data[i], currentIndex, [], [nodeCount - i - 1]);
        if (result.node) {
            return result;
        }

        currentIndex = result.currentIndex;
    }

    return null;
}

// Performs change to every node in the tree

// Passive visit to every node in the tree
