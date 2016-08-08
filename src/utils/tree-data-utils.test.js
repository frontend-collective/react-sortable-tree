import {
    getVisibleNodeCount,
    getVisibleNodeInfoAtIndex,
    changeNodeAtPath,
} from './tree-data-utils';

const keyFromTreeIndex = (node, treeIndex) => treeIndex;
const keyFromKey       = node => node.key;

describe('getVisibleNodeCount', () => {
    it('should handle flat data', () => {
        expect(getVisibleNodeCount([
            {},
            {},
        ])).toEqual(2);
    });

    it('should handle hidden nested data', () => {
        expect(getVisibleNodeCount([
            {
                children: [
                    {
                        children: [
                            {},
                            {},
                        ],
                    },
                    {
                        children: [
                            {},
                        ],
                    },
                ],
            },
            {},
        ])).toEqual(2);
    });

    it('should handle partially expanded nested data', () => {
        expect(getVisibleNodeCount([
            {
                expanded: true,
                children: [
                    {
                        expanded: true,
                        children: [
                            {},
                            {},
                        ],
                    },
                    {
                        children: [
                            {},
                        ],
                    },
                ],
            },
            {},
        ])).toEqual(6);
    });

    it('should handle fully expanded nested data', () => {
        expect(getVisibleNodeCount([
            {
                expanded: true,
                children: [
                    {
                        expanded: true,
                        children: [
                            {},
                            {},
                        ],
                    },
                    {
                        expanded: true,
                        children: [
                            {},
                        ],
                    },
                ],
            },
            {},
        ])).toEqual(7);
    });
});

describe('getVisibleNodeInfoAtIndex', () => {
    it('should handle empty data', () => {
        expect(getVisibleNodeInfoAtIndex([], 1, keyFromTreeIndex)).toEqual(null);
        expect(getVisibleNodeInfoAtIndex(null, 1, keyFromTreeIndex)).toEqual(null);
        expect(getVisibleNodeInfoAtIndex(undefined, 1, keyFromTreeIndex)).toEqual(null);
    });

    it('should handle flat data', () => {
        expect(getVisibleNodeInfoAtIndex([ { key: 0 } ], 0, keyFromTreeIndex).node.key).toEqual(0);
        expect(getVisibleNodeInfoAtIndex([ { key: 0 }, { key: 1 } ], 1, keyFromTreeIndex).node.key).toEqual(1);
    });

    it('should handle hidden nested data', () => {
        const result = getVisibleNodeInfoAtIndex([
            {
                key: 0,
                children: [
                    {
                        key: 1,
                        children: [
                            { key: 2 },
                            { key: 3 },
                        ],
                    },
                    {
                        key: 4,
                        children: [
                            { key: 5 },
                        ],
                    },
                ],
            },
            { key: 6 },
        ], 1, keyFromTreeIndex);

        expect(result.node.key).toEqual(6);
        expect(result.parentPath).toEqual([]);
        expect(result.lowerSiblingCounts).toEqual([0]);
    });

    it('should handle partially expanded nested data', () => {
        const result = getVisibleNodeInfoAtIndex([
            {
                expanded: true,
                key: 0,
                children: [
                    {
                        key: 1,
                        children: [
                            { key: 2 },
                            { key: 3 },
                        ],
                    },
                    {
                        expanded: true,
                        key: 4,
                        children: [
                            { key: 5 },
                        ],
                    },
                ],
            },
            { key: 6 },
        ], 3, keyFromKey);

        expect(result.node.key).toEqual(5);
        expect(result.parentPath).toEqual([0, 4]);
        expect(result.lowerSiblingCounts).toEqual([1, 0, 0]);
    });

    it('should handle fully expanded nested data', () => {
        const result = getVisibleNodeInfoAtIndex([
            {
                expanded: true,
                key: 0,
                children: [
                    {
                        expanded: true,
                        key: 1,
                        children: [
                            { key: 2 },
                            { key: 3 },
                        ],
                    },
                    {
                        expanded: true,
                        key: 4,
                        children: [
                            { key: 5 },
                        ],
                    },
                ],
            },
            { key: 6 },
        ], 5, keyFromKey);

        expect(result.node.key).toEqual(5);
        expect(result.parentPath).toEqual([0, 4]);
        expect(result.lowerSiblingCounts).toEqual([1, 0, 0]);
    });

    it('should handle an index that is larger than the data', () => {
        expect(getVisibleNodeInfoAtIndex([
            {
                expanded: true,
                key: 0,
                children: [
                    {
                        expanded: true,
                        key: 1,
                        children: [
                            { key: 2 },
                            { key: 3 },
                        ],
                    },
                    {
                        expanded: true,
                        key: 4,
                        children: [
                            { key: 5 },
                        ],
                    },
                ],
            },
            { key: 6 },
        ], 7, keyFromTreeIndex)).toEqual(null);
    });
});

describe('changeNodeAtPath', () => {
    it('should handle empty data', () => {
        expect(() => changeNodeAtPath([], [1], {}, keyFromTreeIndex)).toThrow();
        expect(() => changeNodeAtPath(null, [1], {}, keyFromTreeIndex)).toThrow();
        expect(() => changeNodeAtPath(null, [1, 2], {}, keyFromTreeIndex)).toThrow();
        expect(() => changeNodeAtPath(undefined, [1], {}, keyFromTreeIndex)).toThrow();
    });

    it('should handle flat data', () => {
        expect(changeNodeAtPath([{ key: 0 }], [0], { key: 1 }, keyFromKey)).toEqual([{ key: 1 }]);
        expect(changeNodeAtPath(
            [{ key: 0 }, { key: 'a' }],
            ['a'],
            { key: 1 },
            keyFromKey
        )).toEqual([{ key: 0 }, { key: 1 }]);
    });

    it('should handle nested data', () => {
        const result = changeNodeAtPath([
            {
                key: 0,
                children: [
                    {
                        key: 'b',
                        children: [
                            { key: 2 },
                            { key: 3 },
                        ],
                    },
                    {
                        key: 'r',
                        children: [
                            { key: 5 },
                        ],
                    },
                ],
            },
            { key: 6 },
        ], [0, 'r', 5], {food: 'pancake'}, keyFromKey);

        expect(result[0].children[1].children[0].food).toEqual('pancake');
    });

    it('should handle a path that is too long', () => {
        const treeData = [
            {
                expanded: true,
                key: 0,
                children: [
                    {
                        expanded: true,
                        key: 1,
                        children: [
                            { key: 2 },
                            { key: 3 },
                        ],
                    },
                ],
            },
        ];

        expect(() => changeNodeAtPath(treeData, [0, 1, 2, 4], { a: 1 }, keyFromKey)).toThrow();
    });

    it('should handle a path that does not exist', () => {
        const treeData = [
            {
                expanded: true,
                key: 0,
                children: [
                    {
                        expanded: true,
                        key: 1,
                        children: [
                            { key: 2 },
                            { key: 3 },
                        ],
                    },
                ],
            },
        ];

        expect(() => changeNodeAtPath(treeData, [0, 2], { a: 1 }, keyFromKey)).toThrow();
    });
});
