import {
    getVisibleNodeCount,
    getVisibleNodeInfoAtIndex,
} from './tree-data-utils';

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
        expect(getVisibleNodeInfoAtIndex([], 1)).toEqual(null);
        expect(getVisibleNodeInfoAtIndex(null, 1)).toEqual(null);
        expect(getVisibleNodeInfoAtIndex(undefined, 1)).toEqual(null);
    });

    it('should handle flat data', () => {
        expect(getVisibleNodeInfoAtIndex([ { key: 0 } ], 0).node.key).toEqual(0);
        expect(getVisibleNodeInfoAtIndex([ { key: 0 }, { key: 1 } ], 1).node.key).toEqual(1);
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
        ], 1);

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
        ], 3);

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
        ], 5);

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
        ], 7)).toEqual(null);
    });
});
