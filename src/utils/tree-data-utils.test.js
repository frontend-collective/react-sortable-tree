import {
    getVisibleNodeCount,
    getVisibleNodeInfoAtIndex,
    changeNodeAtPath,
    getVisibleNodeInfoFlattened,
} from './tree-data-utils';

const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const keyFromKey       = ({ node }) => node.key;

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
        expect(result.path).toEqual([1]);
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
        expect(result.path).toEqual([0, 4, 5]);
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
        ], 5, keyFromTreeIndex);

        expect(result.node.key).toEqual(5);
        expect(result.path).toEqual([0, 4, 5]);
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


describe('getVisibleNodeInfoAtIndex', () => {
    it('should handle empty data', () => {
        expect(getVisibleNodeInfoFlattened([], keyFromTreeIndex)).toEqual([]);
        expect(getVisibleNodeInfoFlattened(null, keyFromTreeIndex)).toEqual([]);
        expect(getVisibleNodeInfoFlattened(undefined, keyFromTreeIndex)).toEqual([]);
    });

    it('should handle flat data', () => {
        expect(getVisibleNodeInfoFlattened([ { key: 0 } ], keyFromTreeIndex)).toEqual([
            { node: { key: 0 }, path: [0], lowerSiblingCounts: [ 0 ] },
        ]);
        expect(getVisibleNodeInfoFlattened([ { key: 0 }, { key: 1 } ], keyFromTreeIndex)).toEqual([
            { node: { key: 0 }, path: [0], lowerSiblingCounts: [ 1 ] },
            { node: { key: 1 }, path: [1], lowerSiblingCounts: [ 0 ] }
        ]);
    });

    it('should handle hidden nested data', () => {
        const treeData = [
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
        ];

        expect(getVisibleNodeInfoFlattened(treeData, keyFromTreeIndex)).toEqual([
            { node: treeData[0], path: [0], lowerSiblingCounts: [ 1 ] },
            { node: treeData[1], path: [1], lowerSiblingCounts: [ 0 ] }
        ]);
    });

    it('should handle partially expanded nested data', () => {
        const treeData = [
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
        ];

        expect(getVisibleNodeInfoFlattened(treeData, keyFromKey)).toEqual([
            { node: treeData[0],                         path: [0],       lowerSiblingCounts: [ 1 ] },
            { node: treeData[0].children[0],             path: [0, 1],    lowerSiblingCounts: [ 1, 1 ] },
            { node: treeData[0].children[1],             path: [0, 4],    lowerSiblingCounts: [ 1, 0 ] },
            { node: treeData[0].children[1].children[0], path: [0, 4, 5], lowerSiblingCounts: [ 1, 0, 0 ] },
            { node: treeData[1],                         path: [6],       lowerSiblingCounts: [ 0 ] },
        ]);
    });

    it('should handle fully expanded nested data', () => {
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
        ];

        expect(getVisibleNodeInfoFlattened(treeData, keyFromTreeIndex)).toEqual([
            { node: treeData[0],                         path: [0],       lowerSiblingCounts: [1] },
            { node: treeData[0].children[0],             path: [0, 1],    lowerSiblingCounts: [1, 1] },
            { node: treeData[0].children[0].children[0], path: [0, 1, 2], lowerSiblingCounts: [1, 1, 1] },
            { node: treeData[0].children[0].children[1], path: [0, 1, 3], lowerSiblingCounts: [1, 1, 0] },
            { node: treeData[0].children[1],             path: [0, 4],    lowerSiblingCounts: [1, 0] },
            { node: treeData[0].children[1].children[0], path: [0, 4, 5], lowerSiblingCounts: [1, 0, 0] },
            { node: treeData[1],                         path: [6],       lowerSiblingCounts: [0] },
        ]);
    });
});

describe('changeNodeAtPath', () => {
    it('should handle empty data', () => {
        const noChildrenError = new Error('Path referenced children of node with no children.');
        const noNodeError = new Error('No node found at the given path.');
        expect(() => changeNodeAtPath({
            treeData: [],
            path: [1],
            newNode: {},
            getNodeKey: keyFromTreeIndex
        })).toThrow(noNodeError);
        expect(() => changeNodeAtPath({
            treeData: null,
            path: [1],
            newNode: {},
            getNodeKey: keyFromTreeIndex
        })).toThrow(noChildrenError);
        expect(() => changeNodeAtPath({
            treeData: null,
            path: [1, 2],
            newNode: {},
            getNodeKey: keyFromTreeIndex
        })).toThrow(noChildrenError);
        expect(() => changeNodeAtPath({
            treeData: undefined,
            path: [1],
            newNode: {},
            getNodeKey: keyFromTreeIndex
        })).toThrow(noChildrenError);
    });

    it('should handle flat data', () => {
        expect(changeNodeAtPath({
            treeData: [{ key: 0 }],
            path: [0],
            newNode: { key: 1 },
            getNodeKey: keyFromKey,
        })).toEqual([{ key: 1 }]);

        expect(changeNodeAtPath({
            treeData: [{ key: 0 }, { key: 'a' }],
            path: ['a'],
            newNode: { key: 1 },
            getNodeKey: keyFromKey,
        })).toEqual([{ key: 0 }, { key: 1 }]);
    });

    it('should handle nested data', () => {
        const result = changeNodeAtPath({
            treeData: [
                {
                    key: 0,
                    children: [
                        {
                            key: 'b',
                            children: [
                                { key: 2 },
                                { key: 3 },
                                { key: 'f' },
                            ],
                        },
                        {
                            key: 'r',
                            children: [
                                { key: 5 },
                                { key: 8 },
                                { key: 7 },
                            ],
                        },
                    ],
                },
                { key: 6 },
            ],
            path: [0, 5, 8],
            newNode: {food: 'pancake'},
            getNodeKey: keyFromTreeIndex,
        });

        expect(result[0].children[1].children[2].food).toEqual('pancake');
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

        expect(() => changeNodeAtPath({
            treeData,
            path: [0, 1, 2, 4],
            newNode: { a: 1 },
            getNodeKey: keyFromKey,
        })).toThrow(new Error('Path referenced children of node with no children.'));
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

        expect(() => changeNodeAtPath({
            treeData,
            path: [0, 2],
            newNode: { a: 1 },
            getNodeKey: keyFromKey,
        })).toThrow(new Error('No node found at the given path.'));
    });
});
