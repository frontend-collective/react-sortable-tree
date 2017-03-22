import { insertNode } from './tree-data-utils';

let memoizedInsertArgsArray = [];
let memoizedInsertKeysArray = [];
let memoizedInsertResult    = null;

/**
 * Insert a node into the tree at the given depth, after the minimum index
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!number} depth - The depth to insert the node at (the first level of the array being depth 0)
 * @param {!number} minimumTreeIndex - The lowest possible treeIndex to insert the node at
 * @param {!Object} newNode - The node to insert into the tree
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} expandParent - If true, expands the parent of the inserted node
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 *
 * @return {Object} result
 * @return {Object[]} result.treeData - The tree data with the node added
 * @return {number} result.treeIndex - The tree index at which the node was inserted
 * @return {number[]|string[]} result.path - Array of keys leading to the node location after insertion
 */
export function memoizedInsertNode(args) {
    const keysArray = Object.keys(args).sort();
    const argsArray = keysArray.map(key => args[key]);

    // If the arguments for the last insert operation are different than this time,
    // recalculate the result
    if (argsArray.length !== memoizedInsertArgsArray.length ||
        argsArray.some((arg, index) => arg !== memoizedInsertArgsArray[index]) ||
        keysArray.some((key, index) => key !== memoizedInsertKeysArray[index])
    ) {
        memoizedInsertArgsArray = argsArray;
        memoizedInsertKeysArray = keysArray;
        memoizedInsertResult    = insertNode(args);
    }

    return memoizedInsertResult;
}
