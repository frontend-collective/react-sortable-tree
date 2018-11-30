import {
  getVisibleNodeCount,
  getVisibleNodeInfoAtIndex,
  changeNodeAtPath,
  addNodeUnderParent,
  getTreeFromFlatData,
  getNodeAtPath,
  getFlatDataFromTree,
  walk,
  map,
  insertNode,
  isDescendant,
  getDepth,
  getDescendantCount,
  find,
  toggleExpandedForAll,
} from './tree-data-utils';

const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const keyFromKey = ({ node }) => node.key;

describe('getVisibleNodeCount', () => {
  it('should handle flat data', () => {
    expect(
      getVisibleNodeCount({
        treeData: [{}, {}],
      })
    ).toEqual(2);
  });

  it('should handle hidden nested data', () => {
    expect(
      getVisibleNodeCount({
        treeData: [
          {
            children: [
              {
                children: [{}, {}],
              },
              {
                children: [{}],
              },
            ],
          },
          {},
        ],
      })
    ).toEqual(2);
  });

  it('should handle functions', () => {
    expect(
      getVisibleNodeCount({
        treeData: [
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
                children: [{}],
              },
            ],
          },
          {},
        ],
      })
    ).toEqual(6);
  });

  it('should handle partially expanded nested data', () => {
    expect(
      getVisibleNodeCount({
        treeData: [
          {
            expanded: true,
            children: [
              {
                expanded: true,
                children: [{}, {}],
              },
              {
                children: [{}],
              },
            ],
          },
          {},
        ],
      })
    ).toEqual(6);
  });

  it('should handle fully expanded nested data', () => {
    expect(
      getVisibleNodeCount({
        treeData: [
          {
            expanded: true,
            children: [
              {
                expanded: true,
                children: [{}, {}],
              },
              {
                expanded: true,
                children: [{}],
              },
            ],
          },
          {},
        ],
      })
    ).toEqual(7);
  });
});

describe('getVisibleNodeInfoAtIndex', () => {
  it('should handle empty data', () => {
    expect(
      getVisibleNodeInfoAtIndex({
        treeData: [],
        index: 1,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
    expect(
      getVisibleNodeInfoAtIndex({
        treeData: null,
        index: 1,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
    expect(
      getVisibleNodeInfoAtIndex({
        treeData: undefined,
        index: 1,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
  });

  it('should handle flat data', () => {
    expect(
      getVisibleNodeInfoAtIndex({
        treeData: [{ key: 0 }],
        index: 0,
        getNodeKey: keyFromTreeIndex,
      }).node.key
    ).toEqual(0);
    expect(
      getVisibleNodeInfoAtIndex({
        treeData: [{ key: 0 }, { key: 1 }],
        index: 1,
        getNodeKey: keyFromTreeIndex,
      }).node.key
    ).toEqual(1);
  });

  it('should handle hidden nested data', () => {
    const result = getVisibleNodeInfoAtIndex({
      treeData: [
        {
          key: 0,
          children: [
            {
              key: 1,
              children: [{ key: 2 }, { key: 3 }],
            },
            {
              key: 4,
              children: [{ key: 5 }],
            },
          ],
        },
        { key: 6 },
      ],
      index: 1,
      getNodeKey: keyFromTreeIndex,
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
              children: [{ key: 2 }, { key: 3 }],
            },
            {
              expanded: true,
              key: 4,
              children: [{ key: 5 }],
            },
          ],
        },
        { key: 6 },
      ],
      index: 3,
      getNodeKey: keyFromKey,
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
              children: [{ key: 2 }, { key: 3 }],
            },
            {
              expanded: true,
              key: 4,
              children: [{ key: 5 }],
            },
          ],
        },
        { key: 6 },
      ],
      index: 5,
      getNodeKey: keyFromTreeIndex,
    });

    expect(result.node.key).toEqual(5);
    expect(result.path).toEqual([0, 4, 5]);
    expect(result.lowerSiblingCounts).toEqual([1, 0, 0]);
  });

  it('should handle an index that is larger than the data', () => {
    expect(
      getVisibleNodeInfoAtIndex({
        treeData: [
          {
            expanded: true,
            key: 0,
            children: [
              {
                expanded: true,
                key: 1,
                children: [{ key: 2 }, { key: 3 }],
              },
              {
                expanded: true,
                key: 4,
                children: [{ key: 5 }],
              },
            ],
          },
          { key: 6 },
        ],
        index: 7,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
  });
});

describe('getNodeAtPath', () => {
  it('should handle empty data', () => {
    expect(
      getNodeAtPath({
        treeData: [],
        path: 1,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
    expect(
      getNodeAtPath({
        treeData: null,
        path: 1,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
    expect(
      getNodeAtPath({
        treeData: undefined,
        path: 1,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
  });

  it('should handle flat data', () => {
    expect(
      getNodeAtPath({
        treeData: [{ key: 0 }],
        path: [0],
        getNodeKey: keyFromTreeIndex,
      }).node.key
    ).toEqual(0);
    expect(
      getNodeAtPath({
        treeData: [{ key: 0 }, { key: 1 }],
        path: [1],
        getNodeKey: keyFromTreeIndex,
      }).node.key
    ).toEqual(1);
  });

  it('should handle hidden nested data', () => {
    const result = getNodeAtPath({
      treeData: [
        {
          key: 0,
          children: [
            {
              key: 1,
              children: [{ key: 2 }, { key: 3 }],
            },
            {
              key: 4,
              children: [{ key: 5 }],
            },
          ],
        },
        { key: 6 },
      ],
      path: [1],
      getNodeKey: keyFromTreeIndex,
    });

    expect(result.node.key).toEqual(6);
  });

  it('should handle partially expanded nested data', () => {
    const result = getNodeAtPath({
      treeData: [
        {
          expanded: true,
          key: 0,
          children: [
            {
              key: 1,
              children: [{ key: 2 }, { key: 3 }],
            },
            {
              expanded: true,
              key: 4,
              children: [{ key: 5 }],
            },
          ],
        },
        { key: 6 },
      ],
      path: [0, 4, 5],
      getNodeKey: keyFromKey,
    });

    expect(result.node.key).toEqual(5);
  });

  it('should handle fully expanded nested data', () => {
    const result = getNodeAtPath({
      treeData: [
        {
          expanded: true,
          key: 0,
          children: [
            {
              expanded: true,
              key: 1,
              children: [{ key: 2 }, { key: 3 }],
            },
            {
              expanded: true,
              key: 4,
              children: [{ key: 5 }],
            },
          ],
        },
        { key: 6 },
      ],
      path: [0, 4, 5],
      getNodeKey: keyFromTreeIndex,
    });

    expect(result.node.key).toEqual(5);
  });

  it('should handle an index that is larger than the data', () => {
    expect(
      getNodeAtPath({
        treeData: [
          {
            expanded: true,
            key: 0,
            children: [
              {
                expanded: true,
                key: 1,
                children: [{ key: 2 }, { key: 3 }],
              },
              {
                expanded: true,
                key: 4,
                children: [{ key: 5 }],
              },
            ],
          },
          { key: 6 },
        ],
        path: [7],
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual(null);
  });
});

describe('getFlatDataFromTree', () => {
  it('should handle empty data', () => {
    expect(
      getFlatDataFromTree({ treeData: [], getNodeKey: keyFromTreeIndex })
    ).toEqual([]);
    expect(
      getFlatDataFromTree({ treeData: null, getNodeKey: keyFromTreeIndex })
    ).toEqual([]);
    expect(
      getFlatDataFromTree({ treeData: undefined, getNodeKey: keyFromTreeIndex })
    ).toEqual([]);
  });

  it('should handle flat data', () => {
    expect(
      getFlatDataFromTree({
        ignoreCollapsed: true,
        getNodeKey: keyFromTreeIndex,
        treeData: [{ key: 0 }],
      })
    ).toEqual([
      {
        node: { key: 0 },
        parentNode: null,
        path: [0],
        lowerSiblingCounts: [0],
        treeIndex: 0,
      },
    ]);

    expect(
      getFlatDataFromTree({
        ignoreCollapsed: true,
        treeData: [{ key: 0 }, { key: 1 }],
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual([
      {
        node: { key: 0 },
        parentNode: null,
        path: [0],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: { key: 1 },
        parentNode: null,
        path: [1],
        lowerSiblingCounts: [0],
        treeIndex: 1,
      },
    ]);
  });

  it('should handle hidden nested data', () => {
    const treeData = [
      {
        key: 0,
        children: [
          {
            key: 1,
            children: [{ key: 2 }, { key: 3 }],
          },
          {
            key: 4,
            children: [{ key: 5 }],
          },
        ],
      },
      { key: 6 },
    ];

    expect(
      getFlatDataFromTree({
        ignoreCollapsed: true,
        getNodeKey: keyFromTreeIndex,
        treeData,
      })
    ).toEqual([
      {
        node: treeData[0],
        parentNode: null,
        path: [0],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: treeData[1],
        parentNode: null,
        path: [1],
        lowerSiblingCounts: [0],
        treeIndex: 1,
      },
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
            children: [{ key: 2 }, { key: 3 }],
          },
          {
            expanded: true,
            key: 4,
            children: [{ key: 5 }],
          },
        ],
      },
      { key: 6 },
    ];

    expect(
      getFlatDataFromTree({
        ignoreCollapsed: true,
        getNodeKey: keyFromKey,
        treeData,
      })
    ).toEqual([
      {
        node: treeData[0],
        parentNode: null,
        path: [0],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: treeData[0].children[0],
        parentNode: treeData[0],
        path: [0, 1],
        lowerSiblingCounts: [1, 1],
        treeIndex: 1,
      },
      {
        node: treeData[0].children[1],
        parentNode: treeData[0],
        path: [0, 4],
        lowerSiblingCounts: [1, 0],
        treeIndex: 2,
      },
      {
        node: treeData[0].children[1].children[0],
        parentNode: treeData[0].children[1],
        path: [0, 4, 5],
        lowerSiblingCounts: [1, 0, 0],
        treeIndex: 3,
      },
      {
        node: treeData[1],
        parentNode: null,
        path: [6],
        lowerSiblingCounts: [0],
        treeIndex: 4,
      },
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
            children: [{ key: 2 }, { key: 3 }],
          },
          {
            expanded: true,
            key: 4,
            children: [{ key: 5 }],
          },
        ],
      },
      { key: 6 },
    ];

    expect(
      getFlatDataFromTree({
        ignoreCollapsed: true,
        treeData,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual([
      {
        node: treeData[0],
        parentNode: null,
        path: [0],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: treeData[0].children[0],
        parentNode: treeData[0],
        path: [0, 1],
        lowerSiblingCounts: [1, 1],
        treeIndex: 1,
      },
      {
        node: treeData[0].children[0].children[0],
        parentNode: treeData[0].children[0],
        path: [0, 1, 2],
        lowerSiblingCounts: [1, 1, 1],
        treeIndex: 2,
      },
      {
        node: treeData[0].children[0].children[1],
        parentNode: treeData[0].children[0],
        path: [0, 1, 3],
        lowerSiblingCounts: [1, 1, 0],
        treeIndex: 3,
      },
      {
        node: treeData[0].children[1],
        parentNode: treeData[0],
        path: [0, 4],
        lowerSiblingCounts: [1, 0],
        treeIndex: 4,
      },
      {
        node: treeData[0].children[1].children[0],
        parentNode: treeData[0].children[1],
        path: [0, 4, 5],
        lowerSiblingCounts: [1, 0, 0],
        treeIndex: 5,
      },
      {
        node: treeData[1],
        parentNode: null,
        path: [6],
        lowerSiblingCounts: [0],
        treeIndex: 6,
      },
    ]);
  });
});

describe('changeNodeAtPath', () => {
  it('should handle empty data', () => {
    const noChildrenError = new Error(
      'Path referenced children of node with no children.'
    );
    const noNodeError = new Error('No node found at the given path.');
    expect(() =>
      changeNodeAtPath({
        treeData: [],
        path: [1],
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toThrow(noNodeError);
    expect(() =>
      changeNodeAtPath({
        treeData: null,
        path: [1],
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toThrow(noChildrenError);
    expect(() =>
      changeNodeAtPath({
        treeData: null,
        path: [1, 2],
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toThrow(noChildrenError);
    expect(() =>
      changeNodeAtPath({
        treeData: undefined,
        path: [1],
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toThrow(noChildrenError);
  });

  it('should handle flat data', () => {
    expect(
      changeNodeAtPath({
        treeData: [{ key: 0 }],
        path: [0],
        newNode: { key: 1 },
        getNodeKey: keyFromKey,
      })
    ).toEqual([{ key: 1 }]);

    expect(
      changeNodeAtPath({
        treeData: [{ key: 0 }, { key: 'a' }],
        path: ['a'],
        newNode: { key: 1 },
        getNodeKey: keyFromKey,
      })
    ).toEqual([{ key: 0 }, { key: 1 }]);
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
              children: [{ key: 2 }, { key: 3 }, { key: 'f' }],
            },
            {
              expanded: true,
              key: 'r',
              children: [{ key: 5 }, { key: 8 }, { key: 7 }],
            },
          ],
        },
        { key: 6 },
      ],
      path: [0, 2, 5],
      newNode: { food: 'pancake' },
      getNodeKey: keyFromTreeIndex,
    });

    expect(result[0].children[1].children[2].food).toEqual('pancake');
  });

  it('should handle adding children', () => {
    const result = changeNodeAtPath({
      treeData: [
        {
          expanded: true,
          key: 0,
          children: [
            {
              key: 'b',
              children: [{ key: 2 }, { key: 3 }, { key: 'f' }],
            },
            {
              expanded: true,
              key: 'r',
              children: [{ key: 5 }, { key: 8 }, { key: 7 }],
            },
          ],
        },
        { key: 6 },
      ],
      path: [0, 2, 5],
      newNode: ({ node }) => ({
        ...node,
        children: [{ food: 'pancake' }],
      }),
      getNodeKey: keyFromTreeIndex,
    });

    expect(result[0].children[1].children[2].children[0].food).toEqual(
      'pancake'
    );
  });

  it('should handle adding children to the root', () => {
    expect(
      changeNodeAtPath({
        treeData: [],
        path: [],
        newNode: ({ node }) => ({
          ...node,
          children: [...node.children, { key: 1 }],
        }),
        getNodeKey: keyFromKey,
      })
    ).toEqual([{ key: 1 }]);

    expect(
      changeNodeAtPath({
        treeData: [{ key: 0 }],
        path: [],
        newNode: ({ node }) => ({
          ...node,
          children: [...node.children, { key: 1 }],
        }),
        getNodeKey: keyFromKey,
      })
    ).toEqual([{ key: 0 }, { key: 1 }]);
  });

  it('should delete data when falsey node passed', () => {
    const result = changeNodeAtPath({
      treeData: [
        {
          expanded: true,
          key: 'b',
          children: [{ key: 'f' }],
        },
        {
          expanded: true,
          key: 'r',
          children: [{ key: 7 }],
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
        children: [{ key: 'f' }],
      },
      {
        expanded: true,
        key: 'r',
        children: [{ key: 7 }],
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
            children: [{ key: 2 }, { key: 3 }],
          },
        ],
      },
    ];

    expect(() =>
      changeNodeAtPath({
        treeData,
        path: [0, 1, 2, 4],
        newNode: { a: 1 },
        getNodeKey: keyFromKey,
      })
    ).toThrow(new Error('Path referenced children of node with no children.'));
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
            children: [{ key: 2 }, { key: 3 }],
          },
        ],
      },
    ];

    expect(() =>
      changeNodeAtPath({
        treeData,
        path: [0, 2],
        newNode: { a: 1 },
        getNodeKey: keyFromKey,
      })
    ).toThrowError('No node found at the given path.');
  });
});

describe('addNodeUnderParent', () => {
  it('should handle empty data', () => {
    expect(
      addNodeUnderParent({
        treeData: [],
        parentKey: null,
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ treeData: [{}], treeIndex: 0 });
    expect(
      addNodeUnderParent({
        treeData: null,
        parentKey: null,
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ treeData: [{}], treeIndex: 0 });
    expect(
      addNodeUnderParent({
        treeData: undefined,
        parentKey: null,
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ treeData: [{}], treeIndex: 0 });
  });

  it('should handle a parentPath that does not exist', () => {
    const treeData = [
      {
        expanded: true,
        key: 0,
        children: [
          {
            expanded: true,
            key: 1,
            children: [{ key: 2 }, { key: 3 }],
          },
        ],
      },
    ];

    expect(() =>
      addNodeUnderParent({
        treeData,
        parentKey: 'fake',
        newNode: { a: 1 },
        getNodeKey: keyFromKey,
      })
    ).toThrowError('No node found with the given key.');
  });

  it('should handle flat data', () => {
    // Older sibling of only node
    expect(
      addNodeUnderParent({
        treeData: [{ key: 0 }],
        parentKey: null,
        newNode: { key: 1 },
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ treeData: [{ key: 0 }, { key: 1 }], treeIndex: 1 });

    // Child of only node
    expect(
      addNodeUnderParent({
        treeData: [{ key: 0 }],
        parentKey: 0,
        newNode: { key: 1 },
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ treeData: [{ key: 0, children: [{ key: 1 }] }], treeIndex: 1 });

    expect(
      addNodeUnderParent({
        treeData: [{ key: 0 }, { key: 'a' }],
        parentKey: 'a',
        newNode: { key: 1 },
        getNodeKey: keyFromKey,
      })
    ).toEqual({
      treeData: [{ key: 0 }, { key: 'a', children: [{ key: 1 }] }],
      treeIndex: 2,
    });
  });

  // Tree looks like this
  //      /\
  //     0  6
  //    / \
  //   1   5
  //  / \
  // 2   3
  //      \
  //       4
  const nestedParams = {
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
              {
                expanded: false,
                key: 3,
                children: [{ key: 4 }],
              },
            ],
          },
          { key: 5 },
        ],
      },
      { key: 6 },
    ],
    newNode: { key: 'new' },
  };

  it('should handle nested data #1', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 0,
      getNodeKey: keyFromKey,
    });

    expect(result.treeData[0].children[2]).toEqual(nestedParams.newNode);
    expect(result.treeIndex).toEqual(5);
  });

  it('should handle nested data #2', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 1,
      getNodeKey: keyFromKey,
    });

    expect(result.treeData[0].children[0].children[2]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(4);
  });

  it('should handle nested data #3', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 3,
      getNodeKey: keyFromKey,
    });

    expect(result.treeData[0].children[0].children[1].children[1]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
  });

  it('should handle nested data #1 (using tree index as key)', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 0,
      getNodeKey: keyFromTreeIndex,
    });

    expect(result.treeData[0].children[2]).toEqual(nestedParams.newNode);
    expect(result.treeIndex).toEqual(5);
  });

  it('should handle nested data #2 (using tree index as key)', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 1,
      getNodeKey: keyFromTreeIndex,
    });

    expect(result.treeData[0].children[0].children[2]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(4);
  });

  it('should handle nested data #3 (using tree index as key)', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 3,
      getNodeKey: keyFromTreeIndex,
    });

    expect(result.treeData[0].children[0].children[1].children[1]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
  });

  it('should add new node as last child by default', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 0,
      getNodeKey: keyFromKey,
    });

    const [
      existingChild0,
      existingChild1,
      expectedNewNode,
    ] = result.treeData[0].children;

    expect(expectedNewNode).toEqual(nestedParams.newNode);
    expect([existingChild0, existingChild1]).toEqual(
      nestedParams.treeData[0].children
    );
  });

  it('should add new node as first child if addAsFirstChild is true', () => {
    const result = addNodeUnderParent({
      ...nestedParams,
      parentKey: 0,
      getNodeKey: keyFromKey,
      addAsFirstChild: true,
    });

    const [expectedNewNode, ...previousChildren] = result.treeData[0].children;

    expect(expectedNewNode).toEqual(nestedParams.newNode);
    expect(previousChildren).toEqual(nestedParams.treeData[0].children);
  });
});

describe('insertNode', () => {
  it('should handle empty data', () => {
    expect(
      insertNode({
        treeData: [],
        depth: 0,
        minimumTreeIndex: 0,
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ parentNode: null, treeData: [{}], treeIndex: 0, path: [0] });
    expect(
      insertNode({
        treeData: null,
        depth: 0,
        minimumTreeIndex: 0,
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ parentNode: null, treeData: [{}], treeIndex: 0, path: [0] });
    expect(
      insertNode({
        treeData: undefined,
        depth: 0,
        minimumTreeIndex: 0,
        newNode: {},
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({ parentNode: null, treeData: [{}], treeIndex: 0, path: [0] });
  });

  it('should handle a depth that is deeper than any branch in the tree', () => {
    const treeData = [
      {
        expanded: true,
        key: 0,
        children: [
          {
            expanded: true,
            key: 1,
            children: [{ key: 2 }, { key: 3 }],
          },
        ],
      },
    ];

    expect(
      insertNode({
        treeData,
        depth: 4,
        minimumTreeIndex: 0,
        newNode: { key: 'new' },
        getNodeKey: keyFromKey,
      }).treeData[0]
    ).toEqual({ key: 'new' });
  });

  it('should handle a minimumTreeIndex that is too big', () => {
    const treeData = [
      {
        expanded: true,
        key: 0,
        children: [
          {
            expanded: true,
            key: 1,
            children: [{ key: 2 }, { key: 3 }],
          },
        ],
      },
      { key: 4 },
    ];

    let insertResult = insertNode({
      treeData,
      depth: 0,
      minimumTreeIndex: 15,
      newNode: { key: 'new' },
      getNodeKey: keyFromKey,
    });
    expect(insertResult.treeData[2]).toEqual({ key: 'new' });
    expect(insertResult.treeIndex).toEqual(5);
    expect(insertResult.path).toEqual(['new']);

    insertResult = insertNode({
      treeData,
      depth: 2,
      minimumTreeIndex: 15,
      newNode: { key: 'new' },
      getNodeKey: keyFromKey,
    });

    expect(insertResult.treeData[1].children[0]).toEqual({ key: 'new' });
    expect(insertResult.treeIndex).toEqual(5);
    expect(insertResult.path).toEqual([4, 'new']);
  });

  it('should handle flat data (before)', () => {
    expect(
      insertNode({
        treeData: [{ key: 0 }],
        depth: 0,
        minimumTreeIndex: 0,
        newNode: { key: 1 },
        getNodeKey: keyFromKey,
      })
    ).toEqual({
      parentNode: null,
      treeData: [{ key: 1 }, { key: 0 }],
      treeIndex: 0,
      path: [1],
    });
  });

  it('should handle flat data (after)', () => {
    expect(
      insertNode({
        treeData: [{ key: 0 }],
        depth: 0,
        minimumTreeIndex: 1,
        newNode: { key: 1 },
        getNodeKey: keyFromKey,
      })
    ).toEqual({
      parentNode: null,
      treeData: [{ key: 0 }, { key: 1 }],
      treeIndex: 1,
      path: [1],
    });
  });

  it('should handle flat data (child)', () => {
    expect(
      insertNode({
        treeData: [{ key: 0 }],
        depth: 1,
        minimumTreeIndex: 1,
        newNode: { key: 1 },
        getNodeKey: keyFromKey,
      })
    ).toEqual({
      parentNode: { key: 0, children: [{ key: 1 }] },
      treeData: [{ key: 0, children: [{ key: 1 }] }],
      treeIndex: 1,
      path: [0, 1],
    });
  });

  // Tree looks like this
  //      /\
  //     0  6
  //    / \
  //   1   5
  //  / \
  // 2   3
  //      \
  //       4
  const nestedParams = {
    treeData: [
      // Depth 0
      {
        expanded: true,
        key: 0,
        children: [
          // Depth 1
          {
            expanded: true,
            key: 1,
            children: [
              // Depth 2
              { key: 2 },
              {
                expanded: false,
                key: 3,
                children: [
                  // Depth 3
                  { key: 4 },
                ],
              },
              { key: 5 },
            ],
          },
          { key: 6 },
        ],
      },
      { key: 7 },
    ],
    newNode: { key: 'new' },
    getNodeKey: keyFromKey,
  };

  it('should handle nested data #1', () => {
    const result = insertNode({
      ...nestedParams,
      depth: 1,
      minimumTreeIndex: 4,
    });

    expect(result.treeData[0].children[1]).toEqual(nestedParams.newNode);
    expect(result.treeIndex).toEqual(5);
    expect(result.path).toEqual([0, 'new']);
  });

  it('should handle nested data #2', () => {
    let result = insertNode({
      ...nestedParams,
      depth: 2,
      ignoreCollapsed: true,
      minimumTreeIndex: 5,
    });

    expect(result.treeData[0].children[0].children[3]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
    expect(result.path).toEqual([0, 1, 'new']);

    result = insertNode({
      ...nestedParams,
      depth: 2,
      ignoreCollapsed: false,
      minimumTreeIndex: 5,
    });

    expect(result.treeData[0].children[0].children[2]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
    expect(result.path).toEqual([0, 1, 'new']);
  });

  it('should handle nested data #3', () => {
    const result = insertNode({
      ...nestedParams,
      depth: 3,
      minimumTreeIndex: 3,
    });

    expect(result.treeData[0].children[0].children[0].children[0]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(3);
    expect(result.path).toEqual([0, 1, 2, 'new']);
  });

  it('should handle nested data #4', () => {
    expect(
      insertNode({
        treeData: [
          { key: 0, expanded: true, children: [{ key: 1 }] },
          { key: 2 },
        ],
        newNode: { key: 'new' },
        depth: 1,
        minimumTreeIndex: 3,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({
      parentNode: { key: 2, children: [{ key: 'new' }] },
      treeData: [
        { key: 0, expanded: true, children: [{ key: 1 }] },
        { key: 2, children: [{ key: 'new' }] },
      ],
      treeIndex: 3,
      path: [2, 3],
    });
  });

  it('should work with a preceding node with children #1', () => {
    expect(
      insertNode({
        treeData: [{ children: [{}] }, { expanded: true, children: [{}, {}] }],
        newNode: { key: 'new' },
        depth: 1,
        minimumTreeIndex: 3,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({
      parentNode: { expanded: true, children: [{}, { key: 'new' }, {}] },
      treeData: [
        { children: [{}] },
        { expanded: true, children: [{}, { key: 'new' }, {}] },
      ],
      treeIndex: 3,
      path: [1, 3],
    });
  });

  it('should work with a preceding node with children #2', () => {
    expect(
      insertNode({
        treeData: [{ children: [{}] }, { expanded: true, children: [{}, {}] }],
        newNode: { key: 'new' },
        depth: 2,
        minimumTreeIndex: 4,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({
      parentNode: { children: [{ key: 'new' }] },
      treeData: [
        { children: [{}] },
        { expanded: true, children: [{}, { children: [{ key: 'new' }] }] },
      ],
      treeIndex: 4,
      path: [1, 3, 4],
    });
  });

  it('should work with a preceding node with children #3', () => {
    expect(
      insertNode({
        treeData: [
          { children: [{}, {}, {}, {}] },
          { expanded: true, children: [{}, {}] },
        ],
        newNode: { key: 'new' },
        depth: 2,
        minimumTreeIndex: 4,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({
      parentNode: { children: [{ key: 'new' }] },
      treeData: [
        { children: [{}, {}, {}, {}] },
        { expanded: true, children: [{}, { children: [{ key: 'new' }] }] },
      ],
      treeIndex: 4,
      path: [1, 3, 4],
    });
  });

  it('should work with nodes with an empty children array', () => {
    expect(
      insertNode({
        treeData: [
          {
            expanded: true,
            children: [
              {
                expanded: true,
                children: [{ children: [] }],
              },
            ],
          },
        ],
        newNode: { key: 'new' },
        depth: 2,
        minimumTreeIndex: 2,
        getNodeKey: keyFromTreeIndex,
      })
    ).toEqual({
      parentNode: {
        expanded: true,
        children: [{ key: 'new' }, { children: [] }],
      },
      treeData: [
        {
          expanded: true,
          children: [
            {
              expanded: true,
              children: [{ key: 'new' }, { children: [] }],
            },
          ],
        },
      ],
      treeIndex: 2,
      path: [0, 1, 2],
    });
  });
});

describe('walk', () => {
  it('should handle empty data', () => {
    [[], null, undefined].forEach(treeData => {
      expect(() =>
        walk({
          treeData,
          getNodeKey: keyFromTreeIndex,
          callback: () => {
            throw new Error('callback ran');
          },
        })
      ).not.toThrow();
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
        callback: () => {
          callCount += 1;
        },
      });

      expect(callCount).toEqual(expected);
    });
  });

  it('should return correct params', () => {
    const paths = [[0], [1], [1, 2], [3]];
    let counter = 0;

    walk({
      treeData: [{}, { children: [{}] }, {}],
      ignoreCollapsed: false,
      getNodeKey: keyFromTreeIndex,
      callback: ({ treeIndex, path }) => {
        expect(treeIndex).toEqual(counter);
        expect(path).toEqual(paths[treeIndex]);
        counter += 1;
      },
    });
  });

  it('should cut walk short when false is returned', () => {
    const treeData = [
      {
        expanded: true,
        key: 0,
        children: [{ key: 2 }, { key: 3 }],
      },
      { key: 6 },
    ];

    expect(() =>
      walk({
        treeData,
        getNodeKey: keyFromTreeIndex,
        callback: ({ node }) => {
          if (node.key === 2) {
            // Cut walk short with false
            return false;
          }
          if (node.key === 3) {
            throw new Error('walk not terminated by false');
          }

          return true;
        },
      })
    ).not.toThrow();
  });

  it('can get parents while walking', () => {
    const treeData = [
      { key: 1, children: [{ key: 12, children: [{ key: 3 }] }, { key: 4 }] },
      { key: 5 },
    ];
    const results = [];
    walk({
      treeData,
      getNodeKey: keyFromTreeIndex,
      ignoreCollapsed: false,
      callback: ({ parentNode }) => {
        results.push(parentNode ? parentNode.key : null);
      },
    });

    expect(results).toEqual([null, 1, 12, 1, null]);
  });
});

describe('getTreeFromFlatData', () => {
  const rootKey = -1;
  const argDefaults = {
    rootKey,
    getKey: node => node.key,
    getParentKey: node => node.parentKey,
  };

  const checkFunction = ({ flatData, expected }) => {
    expect(
      getTreeFromFlatData({
        ...argDefaults,
        flatData,
      })
    ).toEqual(expected);
  };

  it('should handle empty data', () => {
    [
      { flatData: [], expected: [] },
      { flatData: null, expected: [] },
      { flatData: undefined, expected: [] },
    ].forEach(checkFunction);
  });

  it('should handle [depth == 1] data', () => {
    [
      {
        flatData: [
          { key: 1, parentKey: rootKey },
          { key: 2, parentKey: rootKey },
        ],
        expected: [
          { key: 1, parentKey: rootKey },
          { key: 2, parentKey: rootKey },
        ],
      },
      {
        flatData: [
          { key: '1', parentKey: rootKey },
          { key: '2', parentKey: rootKey },
        ],
        expected: [
          { key: '1', parentKey: rootKey },
          { key: '2', parentKey: rootKey },
        ],
      },
    ].forEach(checkFunction);
  });

  it('should handle [depth == 2] data', () => {
    [
      {
        flatData: [{ key: 1, parentKey: rootKey }, { key: 2, parentKey: 1 }],
        expected: [
          {
            key: 1,
            parentKey: rootKey,
            children: [{ key: 2, parentKey: 1 }],
          },
        ],
      },
      {
        flatData: [
          { key: '1', parentKey: rootKey },
          { key: '2', parentKey: '1' },
        ],
        expected: [
          {
            key: '1',
            parentKey: rootKey,
            children: [{ key: '2', parentKey: '1' }],
          },
        ],
      },
    ].forEach(checkFunction);
  });

  it('should handle [depth > 2] nested data', () => {
    [
      {
        flatData: [
          { key: 3, parentKey: 2 },
          { key: 1, parentKey: rootKey },
          { key: 2, parentKey: 1 },
        ],
        expected: [
          {
            key: 1,
            parentKey: rootKey,
            children: [
              {
                key: 2,
                parentKey: 1,
                children: [{ key: 3, parentKey: 2 }],
              },
            ],
          },
        ],
      },
      {
        flatData: [
          { key: 4, parentKey: 2 },
          { key: 3, parentKey: 2 },
          { key: 7, parentKey: rootKey },
          { key: 1, parentKey: rootKey },
          { key: 2, parentKey: 1 },
          { key: 6, parentKey: 1 },
        ],
        expected: [
          { key: 7, parentKey: rootKey },
          {
            key: 1,
            parentKey: rootKey,
            children: [
              {
                key: 2,
                parentKey: 1,
                children: [{ key: 4, parentKey: 2 }, { key: 3, parentKey: 2 }],
              },
              { key: 6, parentKey: 1 },
            ],
          },
        ],
      },
    ].forEach(checkFunction);
  });
});

describe('map', () => {
  const checkFunction = ({
    treeData,
    getNodeKey,
    callback,
    ignoreCollapsed,
    expected,
  }) => {
    expect(
      map({
        treeData,
        getNodeKey,
        callback,
        ignoreCollapsed,
      })
    ).toEqual(expected);
  };

  it('should handle empty data', () => {
    [
      {
        treeData: [],
        getNodeKey: keyFromKey,
        callback: ({ node }) => node,
        expected: [],
      },
      {
        treeData: null,
        getNodeKey: keyFromKey,
        callback: ({ node }) => node,
        expected: [],
      },
      {
        treeData: undefined,
        getNodeKey: keyFromKey,
        callback: ({ node }) => node,
        expected: [],
      },
    ].forEach(checkFunction);
  });

  it('can return tree as-is', () => {
    [
      {
        getNodeKey: keyFromKey,
        callback: ({ node }) => node,
        treeData: [{ key: 1 }, { key: 2 }],
        expected: [{ key: 1 }, { key: 2 }],
      },
      {
        getNodeKey: keyFromKey,
        callback: ({ node }) => node,
        treeData: [{ key: 1, children: [{ key: 2 }] }],
        expected: [{ key: 1, children: [{ key: 2 }] }],
      },
      {
        getNodeKey: keyFromKey,
        callback: ({ node }) => node,
        treeData: [
          {
            key: 1,
            children: [{ key: 12, children: [{ key: 3 }] }, { key: 4 }],
          },
          { key: 5 },
        ],
        expected: [
          {
            key: 1,
            children: [{ key: 12, children: [{ key: 3 }] }, { key: 4 }],
          },
          { key: 5 },
        ],
      },
    ].forEach(checkFunction);
  });

  it('can truncate part of the tree', () => {
    [
      {
        getNodeKey: keyFromKey,
        callback: ({ node }) =>
          node.key === 1 ? { ...node, children: [] } : node,
        treeData: [
          {
            key: 1,
            children: [{ key: 12, children: [{ key: 3 }] }, { key: 4 }],
          },
          { key: 5 },
        ],
        expected: [{ key: 1, children: [] }, { key: 5 }],
      },
    ].forEach(checkFunction);
  });

  it('can get parents', () => {
    checkFunction({
      getNodeKey: keyFromKey,
      callback: ({ node, parentNode }) => ({
        ...node,
        parentKey: parentNode ? parentNode.key : null,
      }),
      ignoreCollapsed: false,
      treeData: [
        {
          key: 1,
          children: [
            {
              key: 12,
              children: [{ key: 3 }],
            },
            { key: 4 },
          ],
        },
        { key: 5 },
      ],
      expected: [
        {
          key: 1,
          parentKey: null,
          children: [
            {
              key: 12,
              parentKey: 1,
              children: [
                {
                  key: 3,
                  parentKey: 12,
                },
              ],
            },
            {
              key: 4,
              parentKey: 1,
            },
          ],
        },
        {
          key: 5,
          parentKey: null,
        },
      ],
    });
  });

  it('can sort part of the tree', () => {
    [
      {
        getNodeKey: keyFromKey,
        callback: ({ node }) =>
          !node.children
            ? node
            : {
                ...node,
                children: node.children.sort((a, b) => a.key - b.key),
              },
        treeData: [
          {
            key: 1,
            expanded: true,
            children: [
              {
                key: 12,
                expanded: true,
                children: [{ key: 33 }, { key: 3 }],
              },
              { key: 4 },
            ],
          },
          { key: 5 },
        ],
        expected: [
          {
            key: 1,
            expanded: true,
            children: [
              { key: 4 },
              {
                key: 12,
                expanded: true,
                children: [{ key: 3 }, { key: 33 }],
              },
            ],
          },
          { key: 5 },
        ],
      },
    ].forEach(checkFunction);
  });

  it('can modify every node in the tree', () => {
    [
      {
        getNodeKey: keyFromKey,
        callback: ({ node }) => ({ ...node, expanded: true }),
        ignoreCollapsed: false,
        treeData: [
          {
            key: 1,
            children: [
              {
                key: 12,
                children: [{ key: 33 }, { key: 3 }],
              },
              { key: 4 },
            ],
          },
          { key: 5 },
        ],
        expected: [
          {
            key: 1,
            expanded: true,
            children: [
              {
                key: 12,
                expanded: true,
                children: [
                  { key: 33, expanded: true },
                  { key: 3, expanded: true },
                ],
              },
              { key: 4, expanded: true },
            ],
          },
          { key: 5, expanded: true },
        ],
      },
    ].forEach(checkFunction);
  });
});

describe('isDescendant', () => {
  const treeData = [
    {
      key: 1,
      children: [
        {
          key: 12,
          children: [{ key: 33 }, { key: 3 }],
        },
        { key: 4 },
      ],
    },
    { key: 5 },
  ];

  it('should work at the base', () => {
    expect(isDescendant(treeData[0], treeData[0])).toEqual(false);
    expect(isDescendant(treeData[0], treeData[1])).toEqual(false);
    expect(isDescendant(treeData[0], treeData[0].children[1])).toEqual(true);
  });

  it('should work deeper in the tree', () => {
    expect(
      isDescendant(treeData[0].children[0], treeData[0].children[0].children[1])
    ).toEqual(true);
  });
});

describe('getDepth', () => {
  const treeData = [
    {
      key: 1,
      children: [
        {
          key: 12,
          children: [{ key: 33 }, { key: 3 }],
        },
        { key: 4 },
      ],
    },
    { key: 5 },
  ];

  it('should work at the base', () => {
    expect(getDepth(treeData[0])).toEqual(2);
    expect(getDepth(treeData[1])).toEqual(0);
  });

  it('should work deeper in the tree', () => {
    expect(getDepth(treeData[0].children[0])).toEqual(1);
  });
});

describe('getDescendantCount', () => {
  it('should count flat data', () => {
    expect(getDescendantCount({ ignoreCollapsed: false, node: {} })).toEqual(0);
    expect(
      getDescendantCount({ ignoreCollapsed: false, node: { children: [] } })
    ).toEqual(0);
    expect(
      getDescendantCount({ ignoreCollapsed: false, node: { children: [{}] } })
    ).toEqual(1);
    expect(
      getDescendantCount({
        ignoreCollapsed: false,
        node: { children: [{}, {}] },
      })
    ).toEqual(2);
  });

  it('should count nested data', () => {
    const nested = {
      expanded: true,
      children: [{}, { children: [{}] }, {}],
    };

    expect(
      getDescendantCount({ ignoreCollapsed: false, node: nested })
    ).toEqual(4);
    expect(getDescendantCount({ ignoreCollapsed: true, node: nested })).toEqual(
      3
    );
  });
});

describe('find', () => {
  const commonArgs = {
    searchQuery: 42,
    searchMethod: ({ node, searchQuery }) => node.key === searchQuery,
    expandAllMatchPaths: false,
    expandFocusMatchPaths: true,
    getNodeKey: keyFromKey,
    searchFocusOffset: 0,
  };

  it('should work with flat data', () => {
    let result;

    result = find({ ...commonArgs, treeData: [{}] });
    expect(result.matches).toEqual([]);

    result = find({ ...commonArgs, treeData: [{ key: 41 }] });
    expect(result.matches).toEqual([]);

    result = find({ ...commonArgs, treeData: [{ key: 42 }] });
    expect(result.matches).toEqual([
      { node: { key: 42 }, treeIndex: 0, path: [42] },
    ]);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(0);

    result = find({ ...commonArgs, treeData: [{ key: 41 }, { key: 42 }] });
    expect(result.matches).toEqual([
      { node: { key: 42 }, treeIndex: 1, path: [42] },
    ]);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(1);

    result = find({ ...commonArgs, treeData: [{ key: 42 }, { key: 42 }] });
    expect(result.matches).toEqual([
      { node: { key: 42 }, treeIndex: 0, path: [42] },
      { node: { key: 42 }, treeIndex: 1, path: [42] },
    ]);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(0);

    result = find({
      ...commonArgs,
      searchFocusOffset: 3,
      treeData: [
        { key: 1 },
        { key: 42 },
        { key: 3 },
        { key: 3 },
        { key: 3 },
        { key: 4 },
        { key: 42 },
        { key: 42 },
        { key: 4 },
        { key: 42 },
      ],
    });
    expect(result.matches).toEqual([
      { node: { key: 42 }, treeIndex: 1, path: [42] },
      { node: { key: 42 }, treeIndex: 6, path: [42] },
      { node: { key: 42 }, treeIndex: 7, path: [42] },
      { node: { key: 42 }, treeIndex: 9, path: [42] },
    ]);
    expect(result.matches[3].treeIndex).toEqual(9);
  });

  it('should work with nested data', () => {
    let result;

    result = find({
      ...commonArgs,
      treeData: [{ children: [{ key: 42 }] }],
    });
    expect(result.matches.length).toEqual(1);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(1);

    result = find({
      ...commonArgs,
      treeData: [{ children: [{ key: 41 }] }, { children: [{ key: 42 }] }],
    });
    expect(result.matches.length).toEqual(1);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(2);
    expect(result.treeData).toEqual([
      { children: [{ key: 41 }] },
      { expanded: true, children: [{ key: 42 }] },
    ]);

    result = find({
      ...commonArgs,
      treeData: [{ children: [{ children: [{ key: 42 }] }] }],
    });
    expect(result.matches.length).toEqual(1);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(2);

    result = find({
      ...commonArgs,
      treeData: [{ children: [{ key: 42, children: [{ key: 42 }] }] }],
    });
    expect(result.matches.length).toEqual(2);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(1);

    result = find({
      ...commonArgs,
      treeData: [
        {},
        { children: [{ key: 42, expanded: true, children: [{ key: 42 }] }] },
      ],
    });
    expect(result.matches.length).toEqual(2);
    expect(result.matches[commonArgs.searchFocusOffset].treeIndex).toEqual(2);

    result = find({
      ...commonArgs,
      treeData: [
        {},
        { children: [{ key: 1, expanded: true, children: [{ key: 1 }] }] },
      ],
    });
    expect(result.matches.length).toEqual(0);
  });
});

describe('toggleExpandedForAll', () => {
  it('should expand all', () => {
    expect(
      toggleExpandedForAll({
        treeData: [{ children: [{ children: [{}] }] }],
      })
    ).toEqual([
      {
        expanded: true,
        children: [{ expanded: true, children: [{ expanded: true }] }],
      },
    ]);
  });
  it('should collapse all', () => {
    expect(
      toggleExpandedForAll({
        expanded: false,
        treeData: [
          {
            expanded: true,
            children: [{ expanded: true, children: [{ expanded: true }] }],
          },
        ],
      })
    ).toEqual([
      {
        expanded: false,
        children: [{ expanded: false, children: [{ expanded: false }] }],
      },
    ]);
  });
});
