import {
    getVisibleNodeCount,
    getVisibleNodeInfoAtIndex,
    changeNodeAtPath,
    getVisibleNodeInfoFlattened,
    walk,
} from './tree-data-utils';

const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const keyFromKey       = ({ node }) => node.key;

describe('getVisibleNodeCount', () => {
    it('should handle flat data', () => {
        expect(getVisibleNodeCount({treeData: [
            {},
            {},
        ]})).toEqual(2);
    });

    it('should handle hidden nested data', () => {
        expect(getVisibleNodeCount({treeData: [
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
        ]})).toEqual(2);
    });

    it('should handle functions', () => {
        expect(getVisibleNodeCount({treeData: [
            {
                expanded: true,
                children: [
                    {
                        expanded: true,
                        children: [
                            {
                                expanded: true,
                                children: () => ({ key: 1 }),
                            },
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
        ]})).toEqual(6);
    });

    it('should handle partially expanded nested data', () => {
        expect(getVisibleNodeCount({treeData: [
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
        ]})).toEqual(6);
    });

    it('should handle fully expanded nested data', () => {
        expect(getVisibleNodeCount({treeData: [
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
        ]})).toEqual(7);
    });
});

describe('getVisibleNodeInfoAtIndex', () => {
    it('should handle empty data', () => {
        expect(getVisibleNodeInfoAtIndex({treeData: [], index: 1, getNodeKey: keyFromTreeIndex})).toEqual(null);
        expect(getVisibleNodeInfoAtIndex({treeData: null, index: 1, getNodeKey: keyFromTreeIndex})).toEqual(null);
        expect(getVisibleNodeInfoAtIndex({treeData: undefined, index: 1, getNodeKey: keyFromTreeIndex})).toEqual(null);
    });

    it('should handle flat data', () => {
        expect(getVisibleNodeInfoAtIndex({
            treeData: [ { key: 0 } ],
            index: 0,
            getNodeKey: keyFromTreeIndex
        }).node.key).toEqual(0);
        expect(getVisibleNodeInfoAtIndex({
            treeData: [ { key: 0 }, { key: 1 } ],
            index: 1,
            getNodeKey: keyFromTreeIndex
        }).node.key).toEqual(1);
    });

    it('should handle hidden nested data', () => {
        const result = getVisibleNodeInfoAtIndex({
            treeData: [
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
            ],
            index: 1,
            getNodeKey: keyFromTreeIndex
        });

        expect(result.node.key).toEqual(6);
        expect(result.path).toEqual([1]);
        expect(result.lowerSiblingCounts).toEqual([0]);
    });

    it('should handle partially expanded nested data', () => {
        const result = getVisibleNodeInfoAtIndex({
            treeData: [
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
            ],
            index: 3,
            getNodeKey: keyFromKey
        });

        expect(result.node.key).toEqual(5);
        expect(result.path).toEqual([0, 4, 5]);
        expect(result.lowerSiblingCounts).toEqual([1, 0, 0]);
    });

    it('should handle fully expanded nested data', () => {
        const result = getVisibleNodeInfoAtIndex({
            treeData: [
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
            ],
            index: 5,
            getNodeKey: keyFromTreeIndex
        });

        expect(result.node.key).toEqual(5);
        expect(result.path).toEqual([0, 4, 5]);
        expect(result.lowerSiblingCounts).toEqual([1, 0, 0]);
    });

    it('should handle an index that is larger than the data', () => {
        expect(getVisibleNodeInfoAtIndex({
            treeData: [
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
            ],
            index: 7,
            getNodeKey: keyFromTreeIndex
        })).toEqual(null);
    });
});


describe('getVisibleNodeInfoAtIndex', () => {
    it('should handle empty data', () => {
        expect(getVisibleNodeInfoFlattened({treeData: [], getNodeKey: keyFromTreeIndex})).toEqual([]);
        expect(getVisibleNodeInfoFlattened({treeData: null, getNodeKey: keyFromTreeIndex})).toEqual([]);
        expect(getVisibleNodeInfoFlattened({treeData: undefined, getNodeKey: keyFromTreeIndex})).toEqual([]);
    });

    it('should handle flat data', () => {
        expect(getVisibleNodeInfoFlattened({ treeData: [ { key: 0 } ], getNodeKey: keyFromTreeIndex })).toEqual([
            { node: { key: 0 }, path: [0], lowerSiblingCounts: [ 0 ] },
        ]);

        expect(getVisibleNodeInfoFlattened({
            treeData: [ { key: 0 }, { key: 1 } ],
            getNodeKey: keyFromTreeIndex
        })).toEqual([
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

        expect(getVisibleNodeInfoFlattened({ treeData, getNodeKey: keyFromTreeIndex })).toEqual([
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

        expect(getVisibleNodeInfoFlattened({ treeData, getNodeKey: keyFromKey })).toEqual([
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

        expect(getVisibleNodeInfoFlattened({ treeData, getNodeKey: keyFromTreeIndex })).toEqual([
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
                    expanded: true,
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
                            expanded: true,
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
            path: [0, 2, 5],
            newNode: {food: 'pancake'},
            getNodeKey: keyFromTreeIndex,
        });

        expect(result[0].children[1].children[2].food).toEqual('pancake');
    });

    it('should delete data when falsey node passed', () => {
        const result = changeNodeAtPath({
            treeData: [
                {
                    expanded: true,
                    key: 'b',
                    children: [
                        { key: 'f' },
                    ],
                },
                {
                    expanded: true,
                    key: 'r',
                    children: [
                        { key: 7 },
                    ],
                },
                { key: 6 },
            ],
            path: [2, 3],
            newNode: null,
            getNodeKey: keyFromTreeIndex,
        });

        expect(result[1].children.length).toEqual(0);
    });

    it('should delete data on the top level', () => {
        const treeData = [
            {
                expanded: true,
                key: 'b',
                children: [
                    { key: 'f' },
                ],
            },
            {
                expanded: true,
                key: 'r',
                children: [
                    { key: 7 },
                ],
            },
            { key: 6 },
        ];
        const result = changeNodeAtPath({
            treeData,
            path: [2],
            newNode: null,
            getNodeKey: keyFromTreeIndex,
        });

        expect(result).toEqual([treeData[0], treeData[2]]);
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
        })).toThrowError('No node found at the given path.');
    });
});

describe('walk', () => {
    it('should handle empty data', () => {
        [[], null, undefined].forEach(treeData => {
            expect(() => walk({
                treeData,
                getNodeKey: keyFromTreeIndex,
                callback: () => { throw new Error('callback ran'); },
            })).not.toThrow();
        });
    });

    it('should handle flat and nested data', () => {
        [
            {
                treeData: [{}],
                expected: 1,
            },
            {
                treeData: [{}, {}],
                expected: 2,
            },
            {
                treeData: [{}, { children: [{}] }, {}],
                expected: 3,
            },
            {
                treeData: [{}, { children: [{}] }, {}],
                ignoreCollapsed: false,
                expected: 4,
            },
        ].forEach(({ treeData, expected, ignoreCollapsed = true }) => {
            let callCount = 0;
            walk({
                treeData,
                ignoreCollapsed,
                getNodeKey: keyFromTreeIndex,
                callback: () => callCount++,
            });

            expect(callCount).toEqual(expected);
        });
    });


    it('should cut walk short when false is returned', () => {
        const treeData = [
            {
                expanded: true,
                key: 0,
                children: [
                    { key: 2 },
                    { key: 3 },
                ],
            },
            { key: 6 },
        ];

        expect(() => walk({
            treeData,
            getNodeKey: keyFromTreeIndex,
            callback: ({ node }) => {
                if (node.key === 2) {
                    // Cut walk short with false
                    return false;
                } else if (node.key === 3) {
                    throw new Error('walk not terminated by false');
                }
            },
        })).not.toThrow();
    });
});
