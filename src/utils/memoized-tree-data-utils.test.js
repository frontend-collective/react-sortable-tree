import {
    insertNode,
} from './tree-data-utils';

import {
    memoizedInsertNode,
} from './memoized-tree-data-utils';

describe('insertNode', () => {
    it('should handle empty data', () => {
        const params = {
            treeData: [],
            depth: 0,
            minimumTreeIndex: 0,
            newNode: {},
            getNodeKey: ({ treeIndex }) => treeIndex,
        };

        expect(insertNode(params) === insertNode(params)).toEqual(false);
        expect(memoizedInsertNode(params) === memoizedInsertNode(params)).toEqual(true);
        expect(memoizedInsertNode(params) === memoizedInsertNode({...params, treeData: [{}]})).toEqual(false);
    });
});
