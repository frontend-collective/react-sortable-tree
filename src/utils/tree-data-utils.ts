import { TreeData, TreeNode, Path } from '../types';

type LowerSiblingCounts = number[];

type FoundResult = {
  node: TreeNode;
  lowerSiblingCounts: LowerSiblingCounts;
  path: Path;
};
type CallbackNodeInfo = {
  node: TreeNode;
  parentNode: TreeNode | null;
  path: Path;
  lowerSiblingCounts: LowerSiblingCounts;
  treeIndex: number;
};
type MissedResult = { nextIndex: number };

const getNodePath = (
  node: TreeNode,
  parentPath: Path,
  isPseudoRoot = false
): Path =>
  // The pseudo-root is not considered in the path
  isPseudoRoot ? [] : [...parentPath, node.nodeId];

/**
 * Performs a depth-first traversal over all of the node descendants,
 * incrementing currentIndex by 1 for each
 */
function getNodeDataAtTreeIndexOrNextIndex(
  targetIndex: number,
  node: TreeNode,
  currentIndex: number,
  path: Path = [],
  lowerSiblingCounts: LowerSiblingCounts = [],
  ignoreCollapsed = true,
  isPseudoRoot = false
): FoundResult | MissedResult {
  const selfPath = getNodePath(node, path, isPseudoRoot);

  // Return target node when found
  if (currentIndex === targetIndex) {
    return {
      node,
      lowerSiblingCounts,
      path: selfPath,
    };
  }

  // Add one and continue for nodes with no children or hidden children
  if (
    !node.children ||
    typeof node.children === 'function' ||
    (ignoreCollapsed && node.expanded !== true)
  ) {
    return { nextIndex: currentIndex + 1 };
  }

  // Iterate over each child and their descendants and return the
  // target node if childIndex reaches the targetIndex
  let childIndex = currentIndex + 1;
  const childCount = node.children.length;
  for (let i = 0; i < childCount; i += 1) {
    const result = getNodeDataAtTreeIndexOrNextIndex(
      targetIndex,
      node.children[i],
      childIndex,
      selfPath,
      [...lowerSiblingCounts, childCount - i - 1],
      ignoreCollapsed
    );

    if ('node' in result) {
      return result;
    }

    childIndex = result.nextIndex;
  }

  // If the target node is not found, return the farthest traversed index
  return { nextIndex: childIndex };
}

export function getDescendantCount(node: TreeNode, ignoreCollapsed = true) {
  return (
    (getNodeDataAtTreeIndexOrNextIndex(
      -1, // Force a miss so we count all nodes below this one
      node,
      0,
      [],
      [],
      ignoreCollapsed
    ) as MissedResult).nextIndex - 1
  );
}

type WalkCallback = (arg: CallbackNodeInfo) => false | void;
/**
 * Walk all descendants of the given node, depth-first
 *
 * @param callback - Function to call on each node
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param node - A tree node
 * @param parentNode - The parent node of `node`
 * @param currentIndex - The treeIndex of `node`
 * @param path - Array of nodeIds leading up to node to be changed
 * @param lowerSiblingCounts - An array containing the count of siblings beneath the
 *                             previous nodes in this path
 * @param isPseudoRoot - If true, this node has no real data, and only serves
 *                        as the parent of all the nodes in the tree
 *
 * @return nextIndex - Index of the next sibling of `node`,
 *                     or false if the walk should be terminated
 */
function walkDescendants(
  callback: WalkCallback,
  ignoreCollapsed: boolean,
  node: TreeNode,
  currentIndex: number,
  parentNode: TreeNode | null = null,
  path: Path = [],
  lowerSiblingCounts: LowerSiblingCounts = [],
  isPseudoRoot = false
): number | false {
  // The pseudo-root is not considered in the path
  const selfPath = getNodePath(node, path, isPseudoRoot);
  const selfInfo = isPseudoRoot
    ? null
    : {
        node,
        parentNode,
        path: selfPath,
        lowerSiblingCounts,
        treeIndex: currentIndex,
      };

  if (selfInfo !== null) {
    const callbackResult = callback(selfInfo);

    // Cut walk short if the callback returned false
    if (callbackResult === false) {
      return false;
    }
  }

  // Return self on nodes with no children or hidden children
  if (
    !node.children ||
    (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)
  ) {
    return currentIndex;
  }

  // Get all descendants
  let childIndex: number | false = currentIndex;
  const childCount = node.children.length;
  if (typeof node.children !== 'function') {
    for (let i = 0; i < childCount; i += 1) {
      childIndex = walkDescendants(
        callback,
        ignoreCollapsed,
        node.children[i],
        childIndex + 1,
        isPseudoRoot ? null : node,
        selfPath,
        [...lowerSiblingCounts, childCount - i - 1]
      );

      // Cut walk short if the callback returned false
      if (childIndex === false) {
        return false;
      }
    }
  }

  return childIndex;
}

type MapCallbackFn = (arg: CallbackNodeInfo) => TreeNode;
/**
 * Perform a change on the given node and all its descendants, traversing the tree depth-first
 *
 * @param callback - Function to call on each node
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param node - A tree node
 * @param parentNode - The parent node of `node`
 * @param currentIndex - The treeIndex of `node`
 * @param path - Array of nodeIds leading up to node to be changed
 * @param lowerSiblingCounts - An array containing the count of siblings beneath the
 *                             previous nodes in this path
 * @param isPseudoRoot - If true, this node has no real data, and only serves
 *                        as the parent of all the nodes in the tree
 */
function mapDescendants(
  callback: MapCallbackFn,
  ignoreCollapsed: boolean,
  node: TreeNode,
  parentNode: TreeNode | null,
  currentIndex: number,
  path: Path,
  lowerSiblingCounts: LowerSiblingCounts,
  isPseudoRoot = false
) {
  const nextNode = { ...node };

  const selfPath = getNodePath(nextNode, path, isPseudoRoot);
  const selfInfo = {
    node: nextNode,
    parentNode,
    path: selfPath,
    lowerSiblingCounts,
    treeIndex: currentIndex,
  };

  // Return self on nodes with no children or hidden children
  if (
    !nextNode.children ||
    (nextNode.expanded !== true && ignoreCollapsed && !isPseudoRoot)
  ) {
    return {
      treeIndex: currentIndex,
      node: callback(selfInfo),
    };
  }

  // Get all descendants
  let childIndex = currentIndex;
  const childCount = nextNode.children.length;
  if (typeof nextNode.children !== 'function') {
    nextNode.children = nextNode.children.map((child, i) => {
      const mapResult = mapDescendants(
        callback,
        ignoreCollapsed,
        child,
        isPseudoRoot ? null : nextNode,
        childIndex + 1,
        selfPath,
        [...lowerSiblingCounts, childCount - i - 1]
      );
      childIndex = mapResult.treeIndex;

      return mapResult.node;
    });
  }

  return {
    node: callback(selfInfo),
    treeIndex: childIndex,
  };
}

/**
 * Count all the visible (expanded) descendants in the tree data.
 *
 * @param treeData - Tree data
 *
 * @return count
 */
export function getVisibleNodeCount(treeData: TreeData) {
  const traverse = (node: TreeNode): number => {
    if (
      !node.children ||
      node.expanded !== true ||
      typeof node.children === 'function'
    ) {
      return 1;
    }

    return (
      1 +
      node.children.reduce(
        (total, currentNode) => total + traverse(currentNode),
        0
      )
    );
  };

  return treeData.reduce(
    (total: number, currentNode: TreeNode) => total + traverse(currentNode),
    0
  );
}

/**
 * Get the <targetIndex>th visible node in the tree data.
 *
 * @param treeData - Tree data
 * @param targetIndex - The index of the node to search for
 *
 * @return node - The node at targetIndex, or null if not found
 */
export function getVisibleNodeInfoAtIndex(
  treeData: TreeData,
  targetIndex: number
) {
  if (treeData.length < 1) {
    return null;
  }

  // Call the tree traversal with a pseudo-root node
  const result = getNodeDataAtTreeIndexOrNextIndex(
    targetIndex,
    {
      nodeId: '__rst_pseudo_root',
      children: treeData,
      expanded: true,
    },
    -1,
    [],
    [],
    true,
    true
  );

  if ('node' in result) {
    return result;
  }

  return null;
}

/**
 * Walk descendants depth-first and call a callback on each
 *
 * @param treeData - Tree data
 * @param callback - Function to call on each node
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return void
 */
export function walk(
  treeData: TreeData,
  callback: WalkCallback,
  ignoreCollapsed = true
) {
  if (treeData.length < 1) {
    return;
  }

  walkDescendants(
    callback,
    ignoreCollapsed,
    { nodeId: '__rst_pseudo_root', children: treeData },
    -1,
    null,
    [],
    [],
    true
  );
}

/**
 * Perform a depth-first transversal of the descendants and
 *  make a change to every node in the tree
 *
 * @param treeData - Tree data
 * @param callback - Function to call on each node
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return changedTreeData - The changed tree data
 */
export function map(
  treeData: TreeData,
  callback: MapCallbackFn,
  ignoreCollapsed = true
): TreeData {
  if (!treeData || treeData.length < 1) {
    return [];
  }

  return mapDescendants(
    callback,
    ignoreCollapsed,
    { nodeId: '__rst_pseudo_root', children: treeData },
    null,
    -1,
    [],
    [],
    true
  ).node.children as TreeData;
}

/**
 * Expand or close every node in the tree
 *
 * @param {!Object[]} treeData - Tree data
 * @param {?boolean} expanded - Whether the node is expanded or not
 *
 * @return {Object[]} changedTreeData - The changed tree data
 */
export function toggleExpandedForAll(treeData: TreeData, expanded: boolean) {
  return map(treeData, ({ node }) => ({ ...node, expanded }), false);
}

/**
 * Replaces node at path with object, or callback-defined object
 *
 * @param treeData
 * @param path - Array of nodeIds leading up to node to be changed
 * @param newNode - TreeNode to replace the node at the path with, or a function producing the new node
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return changedTreeData - The changed tree data
 */
export function changeNodeAtPath(
  treeData: TreeData,
  path: Path,
  newNode:
    | TreeNode
    | (({
        node,
        treeIndex,
      }: {
        node: TreeNode;
        treeIndex: number;
      }) => TreeNode | null),
  ignoreCollapsed = true
) {
  const RESULT_MISS = 'RESULT_MISS';
  const traverse = (
    node: TreeNode,
    currentTreeIndex: number,
    pathIndex: number,
    isPseudoRoot = false
  ): TreeNode | null | typeof RESULT_MISS => {
    if (!isPseudoRoot && node.nodeId !== path[pathIndex]) {
      return RESULT_MISS;
    }

    if (pathIndex >= path.length - 1) {
      // If this is the final location in the path, return its changed form
      return typeof newNode === 'function'
        ? newNode({ node, treeIndex: currentTreeIndex })
        : newNode;
    }
    if (!node.children || typeof node.children === 'function') {
      // If this node is part of the path, but has no children,
      // or the children have not been loaded,
      // return the unchanged node
      throw new Error('Path referenced children of node with no children.');
    }

    let nextTreeIndex = currentTreeIndex + 1;
    for (let i = 0; i < node.children.length; i += 1) {
      const result = traverse(node.children[i], nextTreeIndex, pathIndex + 1);

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

      nextTreeIndex +=
        1 + getDescendantCount(node.children[i], ignoreCollapsed);
    }

    return RESULT_MISS;
  };

  // Use a pseudo-root node in the beginning traversal
  const result = traverse(
    { nodeId: '__rst_pseudo_root', children: treeData },
    -1,
    -1,
    true
  );

  if (result === RESULT_MISS) {
    throw new Error('No node found at the given path.');
  }

  return (result as TreeNode).children;
}

/**
 * Removes the node at the specified path and returns the resulting treeData.
 *
 * @param treeData
 * @param path - Array of nodeIds leading up to node to be deleted
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return result
 * @return result.treeData - The tree data with the node removed
 * @return result.node - The node that was removed
 * @return result.treeIndex - The previous treeIndex of the removed node
 */
export function removeNodeAtPath(
  treeData: TreeData,
  path: Path,
  ignoreCollapsed = true
) {
  let removedNode = null;
  let removedTreeIndex = null;
  const nextTreeData = changeNodeAtPath(
    treeData,
    path,
    ({ node, treeIndex }: { node: TreeNode; treeIndex: number }) => {
      // Store the target node and delete it from the tree
      removedNode = node;
      removedTreeIndex = treeIndex;

      return null;
    },
    ignoreCollapsed
  );

  return {
    treeData: nextTreeData,
    node: removedNode,
    treeIndex: removedTreeIndex,
  };
}

/**
 * Gets the node at the specified path
 *
 * @param treeData
 * @param path - Array of nodeIds leading up to node to be deleted
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return nodeInfo - The node info at the given path, or null if not found
 */
export function getNodeAtPath(
  treeData: TreeData,
  path: Path,
  ignoreCollapsed = true
) {
  let foundNodeInfo = null;

  try {
    changeNodeAtPath(
      treeData,
      path,
      ({ node, treeIndex }) => {
        foundNodeInfo = { node, treeIndex };
        return node;
      },
      ignoreCollapsed
    );
  } catch (err) {
    // Ignore the error -- the null return will be explanation enough
  }

  return foundNodeInfo;
}

/**
 * Adds the node to the specified parent and returns the resulting treeData.
 *
 * @param treeData
 * @param newNode - The node to insert
 * @param parentNodeId - The nodeId of the to-be parentNode of the node
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param expandParent - If true, expands the parentNode specified by parentPath
 * @param addAsFirstChild - If true, adds new node as first child of tree
 *
 * @return result
 * @return result.treeData - The updated tree data
 * @return result.treeIndex - The tree index at which the node was inserted
 */
export function addNodeUnderParent(
  treeData: TreeData,
  newNode: TreeNode,
  parentNodeId: string | null = null,
  addAsFirstChild = false,
  ignoreCollapsed = true,
  expandParent = false
) {
  if (parentNodeId === null) {
    return addAsFirstChild
      ? {
          treeData: [newNode, ...(treeData || [])],
          treeIndex: 0,
        }
      : {
          treeData: [...(treeData || []), newNode],
          treeIndex: (treeData || []).length,
        };
  }

  let insertedTreeIndex: number | null = null;
  let hasBeenAdded = false;
  const changedTreeData = map(
    treeData,
    ({ node, treeIndex, path }) => {
      const nodeId = path ? path[path.length - 1] : null;
      // Return nodes that are not the parent as-is
      if (hasBeenAdded || nodeId !== parentNodeId) {
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
          children: [newNode],
        };
      }

      if (typeof parentNode.children === 'function') {
        throw new Error('Cannot add to children defined by a function');
      }

      let nextTreeIndex = treeIndex + 1;
      for (let i = 0; i < parentNode.children.length; i += 1) {
        nextTreeIndex +=
          1 + getDescendantCount(parentNode.children[i], ignoreCollapsed);
      }

      insertedTreeIndex = nextTreeIndex;

      const children = addAsFirstChild
        ? [newNode, ...parentNode.children]
        : [...parentNode.children, newNode];

      return {
        ...parentNode,
        children,
      };
    },
    ignoreCollapsed
  );

  if (!hasBeenAdded) {
    throw new Error('No node found with the given nodeId.');
  }

  return {
    treeData: changedTreeData,
    treeIndex: insertedTreeIndex,
  };
}

type FailedInsertResult = {
  node: TreeNode;
  nextIndex: number;
};
type SuccessfulInsertResult = FailedInsertResult & {
  insertedTreeIndex: number;
  parentPath: Path;
  parentNode: TreeNode | null;
};
type InsertResult = FailedInsertResult | SuccessfulInsertResult;
function addNodeAtDepthAndIndex(
  targetDepth: number,
  newNode: TreeNode,
  minimumTreeIndex: number,
  ignoreCollapsed: boolean,
  expandParent: boolean,
  isLastChild: boolean,
  node: TreeNode,
  currentIndex: number,
  currentDepth: number,
  path: Path = [],
  isPseudoRoot = false
): InsertResult {
  // If the current position is the only possible place to add, add it
  if (
    currentIndex >= minimumTreeIndex - 1 ||
    (isLastChild && !(node.children && node.children.length))
  ) {
    if (typeof node.children === 'function') {
      throw new Error('Cannot add to children defined by a function');
    } else {
      const extraNodeProps = expandParent ? { expanded: true } : {};
      const nextNode = {
        ...node,

        ...extraNodeProps,
        children: node.children ? [newNode, ...node.children] : [newNode],
      };

      return {
        node: nextNode,
        nextIndex: currentIndex + 2,
        insertedTreeIndex: currentIndex + 1,
        parentPath: getNodePath(nextNode, path, isPseudoRoot),
        parentNode: isPseudoRoot ? null : nextNode,
      };
    }
  }

  // If this is the target depth for the insertion,
  // i.e., where the newNode can be added to the current node's children
  if (currentDepth >= targetDepth - 1) {
    // Skip over nodes with no children or hidden children
    if (
      !node.children ||
      typeof node.children === 'function' ||
      (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)
    ) {
      return { node, nextIndex: currentIndex + 1 };
    }

    // Scan over the children to see if there's a place among them that fulfills
    // the minimumTreeIndex requirement
    let childIndex = currentIndex + 1;
    let insertedTreeIndex: number | undefined = undefined;
    let insertIndex: number | undefined = undefined;
    for (let i = 0; i < node.children.length; i += 1) {
      // If a valid location is found, mark it as the insertion location and
      // break out of the loop
      if (childIndex >= minimumTreeIndex) {
        insertedTreeIndex = childIndex;
        insertIndex = i;
        break;
      }

      // Increment the index by the child itself plus the number of descendants it has
      childIndex += 1 + getDescendantCount(node.children[i], ignoreCollapsed);
    }

    // If no valid indices to add the node were found
    if (insertIndex === undefined) {
      // If the last position in this node's children is less than the minimum index
      // and there are more children on the level of this node, return without insertion
      if (childIndex < minimumTreeIndex && !isLastChild) {
        return { node, nextIndex: childIndex };
      }

      // Use the last position in the children array to insert the newNode
      insertedTreeIndex = childIndex;
      insertIndex = node.children.length;
    }

    // Insert the newNode at the insertIndex
    const nextNode = {
      ...node,
      children: [
        ...node.children.slice(0, insertIndex),
        newNode,
        ...node.children.slice(insertIndex),
      ],
    };

    // Return node with successful insert result
    return {
      node: nextNode,
      nextIndex: childIndex,
      insertedTreeIndex,
      parentPath: getNodePath(nextNode, path, isPseudoRoot),
      parentNode: isPseudoRoot ? null : nextNode,
    };
  }

  // Skip over nodes with no children or hidden children
  if (
    !node.children ||
    typeof node.children === 'function' ||
    (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)
  ) {
    return { node, nextIndex: currentIndex + 1 };
  }

  // Get all descendants
  let insertedTreeIndex: number | null = null;
  let pathFragment: Path = [];
  let parentNode = null;
  let childIndex = currentIndex + 1;
  let newChildren = node.children;
  if (typeof newChildren !== 'function') {
    newChildren = newChildren.map((child, i) => {
      if (insertedTreeIndex !== null) {
        return child;
      }

      const mapResult = addNodeAtDepthAndIndex(
        targetDepth,
        newNode,
        minimumTreeIndex,
        ignoreCollapsed,
        expandParent,
        isLastChild && i === newChildren.length - 1,
        child,
        childIndex,
        currentDepth + 1,
        [] // Cannot determine the parent path until the children have been processed
      );

      if ('insertedTreeIndex' in mapResult) {
        ({
          insertedTreeIndex,
          parentNode,
          parentPath: pathFragment,
        } = mapResult);
      }

      childIndex = mapResult.nextIndex;

      return mapResult.node;
    });
  }

  const nextNode = { ...node, children: newChildren };
  const result: InsertResult = {
    node: nextNode,
    nextIndex: childIndex,
    ...(insertedTreeIndex === null
      ? {}
      : {
          insertedTreeIndex: insertedTreeIndex,
          parentPath: [
            ...getNodePath(nextNode, path, isPseudoRoot),
            ...pathFragment,
          ],
          parentNode,
        }),
  };

  return result;
}

/**
 * Insert a node into the tree at the given depth, after the minimum index
 *
 * @param treeData - Tree data
 * @param depth - The depth to insert the node at (the first level of the array being depth 0)
 * @param minimumTreeIndex - The lowest possible treeIndex to insert the node at
 * @param newNode - The node to insert into the tree
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param expandParent - If true, expands the parent of the inserted node
 *
 * @return result
 * @return result.treeData - The tree data with the node added
 * @return result.treeIndex - The tree index at which the node was inserted
 * @return result.path - Array of nodeIds leading to the node location after insertion
 * @return result.parentNode - The parent node of the inserted node
 */
export function insertNode(
  treeData: TreeData,
  newNode: TreeNode,
  targetDepth: number,
  minimumTreeIndex: number,
  ignoreCollapsed = true,
  expandParent = false
) {
  if (!treeData && targetDepth === 0) {
    return {
      treeData: [newNode],
      treeIndex: 0,
      path: [newNode.nodeId],
      parentNode: null,
    };
  }

  const insertResult = addNodeAtDepthAndIndex(
    targetDepth,
    newNode,
    minimumTreeIndex,
    ignoreCollapsed,
    expandParent,
    true,
    { nodeId: '__rst_pseudo_root', children: treeData },
    -1,
    -1,
    [],
    true
  );

  if (!('insertedTreeIndex' in insertResult)) {
    throw new Error('No suitable position found to insert.');
  }

  const treeIndex = insertResult.insertedTreeIndex;
  return {
    treeData: insertResult.node.children,
    treeIndex,
    path: [...insertResult.parentPath, newNode.nodeId],
    parentNode: insertResult.parentNode,
  };
}

/**
 * Get tree data flattened.
 *
 * @param treeData - Tree data
 * @param ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return nodes - The node array
 */
export function getFlatDataFromTree(
  treeData: TreeData,
  ignoreCollapsed = true
) {
  if (!treeData || treeData.length < 1) {
    return [];
  }

  const flattened: CallbackNodeInfo[] = [];
  walk(
    treeData,
    nodeInfo => {
      flattened.push(nodeInfo);
    },
    ignoreCollapsed
  );

  return flattened;
}

type GetNodeIdFn = (obj: any) => string;
/**
 * Generate a tree structure from flat data.
 *
 * @param flatData
 * @param getNodeId - Function to get the nodeId from the nodeData
 * @param getParentNodeId - Function to get the parent nodeId from the nodeData
 * @param rootNodeId - The value returned by `getParentNodeId` that corresponds to the root node.
 *                     For example, if your nodes have id 1-99, you might use rootNodeId = 0
 *
 * @return treeData - The flat data represented as a tree
 */
export function getTreeFromFlatData(
  flatData: Object[],
  getNodeId: GetNodeIdFn = node => node.id,
  getParentNodeId: GetNodeIdFn = node => node.parentId,
  rootNodeId = '0'
): TreeData {
  const childrenToParents: { [nodeId: string]: Object[] } = {};
  flatData.forEach(child => {
    const parentNodeId = getParentNodeId(child);

    if (parentNodeId in childrenToParents) {
      childrenToParents[parentNodeId].push(child);
    } else {
      childrenToParents[parentNodeId] = [child];
    }
  });

  if (!(rootNodeId in childrenToParents)) {
    return [];
  }

  const trav = (parent: {}): TreeNode => {
    const parentNodeId = getNodeId(parent);
    const nextNode: Omit<TreeNode, 'nodeId'> =
      parentNodeId in childrenToParents
        ? {
            ...parent,
            children: childrenToParents[parentNodeId].map(child => trav(child)),
          }
        : { ...parent };
    return { ...nextNode, nodeId: getNodeId(nextNode) };
  };

  return childrenToParents[rootNodeId].map(child => trav(child));
}

/**
 * Check if a node is a descendant of another node.
 *
 * @param older - Potential ancestor of younger node
 * @param younger - Potential descendant of older node
 *
 * @return isDescendant
 */
export function isDescendant(older: TreeNode, younger: TreeNode): boolean {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  );
}

/**
 * Get the maximum depth of the children (the depth of the root node is 0).
 *
 * @param node - Node in the tree
 * @param depth - The current depth
 *
 * @return maxDepth - The deepest depth in the tree
 */
export function getDepth(node: TreeNode, depth = 0): number {
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

type Match = { path?: Path; treeIndex?: number | null; node: TreeNode };
type SearchMethod = (args: Match & { searchQuery: any }) => boolean;

/**
 * Find nodes matching a search query in the tree,
 *
 * @param treeData - Tree data
 * @param searchQuery - Function returning a boolean to indicate whether the node is a match or not
 * @param searchMethod - Function returning a boolean to indicate whether the node is a match or not
 * @param searchFocusOffset - The offset of the match to focus on
 *                                      (e.g., 0 focuses on the first match, 1 on the second)
 * @param expandAllMatchPaths - If true, expands the paths to any matched node
 * @param expandFocusMatchPaths - If true, expands the path to the focused node
 *
 * @return result
 * @return result.matches - An array of objects containing the matching `node`s, their `path`s and `treeIndex`s
 * @return result.treeData - The original tree data with all relevant nodes expanded.
 *                           If expandAllMatchPaths and expandFocusMatchPaths are both false,
 *                           it will be the same as the original tree data.
 */
export function find(
  treeData: TreeData,
  searchQuery: any,
  searchMethod: SearchMethod,
  searchFocusOffset?: number,
  expandAllMatchPaths = false,
  expandFocusMatchPaths = true
) {
  let matchCount = 0;
  const trav = (
    node: TreeNode,
    currentIndex: number,
    path: Path,
    isPseudoRoot = false
  ) => {
    let matches: Match[] = [];
    let isSelfMatch = false;
    let hasFocusMatch = false;

    const selfPath = getNodePath(node, path, isPseudoRoot);
    const extraInfo = isPseudoRoot
      ? null
      : {
          path: selfPath,
          treeIndex: currentIndex,
        };

    // Examine the current node to see if it is a match
    if (!isPseudoRoot && searchMethod({ ...extraInfo, node, searchQuery })) {
      if (matchCount === searchFocusOffset) {
        hasFocusMatch = true;
      }

      // Keep track of the number of matching nodes, so we know when the searchFocusOffset
      //  is reached
      matchCount += 1;

      // We cannot add this node to the matches right away, as it may be changed
      //  during the search of the descendants. The entire node is used in
      //  comparisons between nodes inside the `matches` and `treeData` results
      //  of this method (`find`)
      isSelfMatch = true;
    }

    let childIndex = currentIndex;
    const newNode = { ...node };

    // Nodes with with children that aren't lazy
    if (
      newNode.children &&
      typeof newNode.children !== 'function' &&
      newNode.children.length > 0
    ) {
      // Get all descendants
      newNode.children = newNode.children.map(child => {
        const mapResult = trav(child, childIndex + 1, selfPath);

        // Ignore hidden nodes by only advancing the index counter to the returned treeIndex
        // if the child is expanded.
        //
        // The child could have been expanded from the start,
        // or expanded due to a matching node being found in its descendants
        if (mapResult.node.expanded) {
          childIndex = mapResult.treeIndex;
        } else {
          childIndex += 1;
        }

        if (mapResult.matches.length > 0 || mapResult.hasFocusMatch) {
          matches = [...matches, ...mapResult.matches];
          if (mapResult.hasFocusMatch) {
            hasFocusMatch = true;
          }

          // Expand the current node if it has descendants matching the search
          // and the settings are set to do so.
          if (
            (expandAllMatchPaths && mapResult.matches.length > 0) ||
            ((expandAllMatchPaths || expandFocusMatchPaths) &&
              mapResult.hasFocusMatch)
          ) {
            newNode.expanded = true;
          }
        }

        return mapResult.node;
      });
    }

    // Cannot assign a treeIndex to hidden nodes
    if (!isPseudoRoot && !newNode.expanded) {
      matches = matches.map(match => ({
        ...match,
        treeIndex: null,
      }));
    }

    // Add this node to the matches if it fits the search criteria.
    // This is performed at the last minute so newNode can be sent in its final form.
    if (isSelfMatch) {
      matches = [{ ...extraInfo, node: newNode }, ...matches];
    }

    return {
      node: matches.length > 0 ? newNode : node,
      matches,
      hasFocusMatch,
      treeIndex: childIndex,
    };
  };

  const result = trav(
    { nodeId: '__rst_pseudo_root', children: treeData },
    -1,
    [],
    true
  );

  return {
    matches: result.matches,
    treeData: result.node.children,
  };
}
