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
 * @return {Object|null} node - The node at targetIndex, or null if not found
 */
export function getVisibleNodeAtIndex(data, targetIndex) {
    if (!data || data.length < 1) {
        return null;
    }

    // Performs a depth-first traversal over all of the node descendants,
    // incrementing currentIndex by 1 for each
    const traverse = (node, currentIndex) => {
        // Return target node when found
        if (currentIndex === targetIndex) {
            return { node, currentIndex };
        }

        // Add one and continue for nodes with no children or hidden children
        if (!node.children || node.expanded !== true) {
            return { currentIndex: currentIndex + 1 };
        }

        // Iterate over each child and their ancestors and return the
        // target node if childIndex reaches the targetIndex
        let childIndex = currentIndex + 1;
        for (let i = 0; i < node.children.length; i++) {
            const result = traverse(node.children[i], childIndex);
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
    for (let i = 0; i < data.length; i++) {
        const result = traverse(data[i], currentIndex);
        if (result.node) {
            return result.node;
        }

        currentIndex = result.currentIndex;
    }

    return null;
}
