import { insertNode } from './tree-data-utils';

import { memoizedInsertNode } from './memoized-tree-data-utils';

describe('insertNode', () => {
  it('should handle empty data', () => {
    const params = {
      treeData: [],
      depth: 0,
      minimumTreeIndex: 0,
      newNode: {},
      getNodeKey: ({ treeIndex }) => treeIndex,
    };

    let firstCall = insertNode(params);
    let secondCall = insertNode(params);
    expect(firstCall === secondCall).toEqual(false);

    firstCall = memoizedInsertNode(params);
    secondCall = memoizedInsertNode(params);
    expect(firstCall === secondCall).toEqual(true);

    expect(
      memoizedInsertNode(params) ===
        memoizedInsertNode({ ...params, treeData: [{}] })
    ).toEqual(false);
  });
});
