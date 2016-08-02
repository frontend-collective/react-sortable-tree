import {
    getVisibleNodeCount,
    getVisibleNodeAtIndex,
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

describe('getVisibleNodeAtIndex', () => {
    it('should handle empty data', () => {
        expect(getVisibleNodeAtIndex([], 1)).toEqual(null);
        expect(getVisibleNodeAtIndex(null, 1)).toEqual(null);
        expect(getVisibleNodeAtIndex(undefined, 1)).toEqual(null);
    });

    it('should handle flat data', () => {
        expect(getVisibleNodeAtIndex([ { id: 0 } ], 0).id).toEqual(0);
        expect(getVisibleNodeAtIndex([ { id: 0 }, { id: 1 } ], 1).id).toEqual(1);
    });

    it('should handle hidden nested data', () => {
        expect(getVisibleNodeAtIndex([
            {
                id: 0,
                children: [
                    {
                        id: 1,
                        children: [
                            { id: 2 },
                            { id: 3 },
                        ],
                    },
                    {
                        id: 4,
                        children: [
                            { id: 5 },
                        ],
                    },
                ],
            },
            { id: 6 },
        ], 1).id).toEqual(6);
    });

    it('should handle partially expanded nested data', () => {
        expect(getVisibleNodeAtIndex([
            {
                expanded: true,
                id: 0,
                children: [
                    {
                        id: 1,
                        children: [
                            { id: 2 },
                            { id: 3 },
                        ],
                    },
                    {
                        expanded: true,
                        id: 4,
                        children: [
                            { id: 5 },
                        ],
                    },
                ],
            },
            { id: 6 },
        ], 3).id).toEqual(5);
    });

    it('should handle fully expanded nested data', () => {
        expect(getVisibleNodeAtIndex([
            {
                expanded: true,
                id: 0,
                children: [
                    {
                        expanded: true,
                        id: 1,
                        children: [
                            { id: 2 },
                            { id: 3 },
                        ],
                    },
                    {
                        expanded: true,
                        id: 4,
                        children: [
                            { id: 5 },
                        ],
                    },
                ],
            },
            { id: 6 },
        ], 5).id).toEqual(5);
    });

    it('should handle an index that is larger than the data', () => {
        expect(getVisibleNodeAtIndex([
            {
                expanded: true,
                id: 0,
                children: [
                    {
                        expanded: true,
                        id: 1,
                        children: [
                            { id: 2 },
                            { id: 3 },
                        ],
                    },
                    {
                        expanded: true,
                        id: 4,
                        children: [
                            { id: 5 },
                        ],
                    },
                ],
            },
            { id: 6 },
        ], 7)).toEqual(null);
    });
});
