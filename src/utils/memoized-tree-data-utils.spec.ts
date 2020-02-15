import { insertNode } from './tree-data-utils';
import { memoizedInsertNode } from './memoized-tree-data-utils';

describe('insertNode', () => {
  it('should handle empty data', () => {
    type InsertParams = Parameters<typeof insertNode>;
    const params: InsertParams = [[], { nodeId: 'a' }, 0, 0];

    let firstCall = insertNode(...params);
    let secondCall = insertNode(...params);
    expect(firstCall === secondCall).toEqual(false);

    firstCall = memoizedInsertNode(...params);
    secondCall = memoizedInsertNode(...params);
    expect(firstCall === secondCall).toEqual(true);

    expect(
      memoizedInsertNode(...params) ===
        memoizedInsertNode(
          ...([[{ nodeId: 'a' }], ...params.slice(1)] as InsertParams)
        )
    ).toEqual(false);
  });
});
