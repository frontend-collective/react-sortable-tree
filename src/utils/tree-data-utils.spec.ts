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
import { TreeNode, TreeData } from '../types';

type OnlyChildren = {
  children?: OnlyChildren[] | Function;
  expanded?: boolean;
  nodeId?: string;
};
function fill(input: OnlyChildren): TreeNode;
function fill(input: OnlyChildren[]): TreeNode[];
function fill(input: OnlyChildren | OnlyChildren[]): TreeNode | TreeNode[] {
  if (Array.isArray(input)) {
    return input.map(a => fill(a));
  }

  let { children, ...otherInput } = input;
  if (input.children) {
    if (typeof input.children !== 'function') {
      children = fill(input.children);
    }
  }

  return children
    ? { nodeId: 'd', ...otherInput, children: children as TreeNode['children'] }
    : { nodeId: 'd', ...otherInput };
}

describe('getVisibleNodeCount', () => {
  it('should handle flat data', () => {
    expect(getVisibleNodeCount(fill([{}, {}]))).toEqual(2);
  });

  it('should handle hidden nested data', () => {
    expect(
      getVisibleNodeCount(
        fill([
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
        ])
      )
    ).toEqual(2);
  });

  it('should handle functions', () => {
    expect(
      getVisibleNodeCount(
        fill([
          {
            expanded: true,
            children: [
              {
                expanded: true,
                children: [
                  {
                    expanded: true,
                    children: () => ({ nodeId: '1' }),
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
        ])
      )
    ).toEqual(6);
  });

  it('should handle partially expanded nested data', () => {
    expect(
      getVisibleNodeCount(
        fill([
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
        ])
      )
    ).toEqual(6);
  });

  it('should handle fully expanded nested data', () => {
    expect(
      getVisibleNodeCount(
        fill([
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
        ])
      )
    ).toEqual(7);
  });
});

describe('getVisibleNodeInfoAtIndex', () => {
  it('should handle empty data', () => {
    expect(getVisibleNodeInfoAtIndex([], 1)).toEqual(null);
  });

  it('should handle flat data', () => {
    expect(
      getVisibleNodeInfoAtIndex(fill([{ nodeId: '0' }]), 0).node.nodeId
    ).toEqual('0');
    expect(
      getVisibleNodeInfoAtIndex(fill([{ nodeId: '0' }, { nodeId: '1' }]), 1)
        .node.nodeId
    ).toEqual('1');
  });

  it('should handle hidden nested data', () => {
    const result = getVisibleNodeInfoAtIndex(
      fill([
        {
          nodeId: '0',
          children: [
            {
              nodeId: '1',
              children: [{ nodeId: '2' }, { nodeId: '3' }],
            },
            {
              nodeId: '4',
              children: [{ nodeId: '5' }],
            },
          ],
        },
        { nodeId: '6' },
      ]),
      1
    );

    expect(result.node.nodeId).toEqual('6');
    expect(result.path).toEqual(['6']);
    expect(result.lowerSiblingCounts).toEqual([0]);
  });

  it('should handle partially expanded nested data', () => {
    const result = getVisibleNodeInfoAtIndex(
      [
        {
          expanded: true,
          nodeId: '0',
          children: [
            {
              nodeId: '1',
              children: [{ nodeId: '2' }, { nodeId: '3' }],
            },
            {
              expanded: true,
              nodeId: '4',
              children: [{ nodeId: '5' }],
            },
          ],
        },
        { nodeId: '6' },
      ],
      3
    );

    expect(result.node.nodeId).toEqual('5');
    expect(result.path).toEqual(['0', '4', '5']);
    expect(result.lowerSiblingCounts).toEqual([1, 0, 0]);
  });

  it('should handle fully expanded nested data', () => {
    const result = getVisibleNodeInfoAtIndex(
      [
        {
          expanded: true,
          nodeId: '0',
          children: [
            {
              expanded: true,
              nodeId: '1',
              children: [{ nodeId: '2' }, { nodeId: '3' }],
            },
            {
              expanded: true,
              nodeId: '4',
              children: [{ nodeId: '5' }],
            },
          ],
        },
        { nodeId: '6' },
      ],
      5
    );

    expect(result.node.nodeId).toEqual('5');
    expect(result.path).toEqual(['0', '4', '5']);
    expect(result.lowerSiblingCounts).toEqual([1, 0, 0]);
  });

  it('should handle an index that is larger than the data', () => {
    expect(
      getVisibleNodeInfoAtIndex(
        [
          {
            expanded: true,
            nodeId: '0',
            children: [
              {
                expanded: true,
                nodeId: '1',
                children: [{ nodeId: '2' }, { nodeId: '3' }],
              },
              {
                expanded: true,
                nodeId: '4',
                children: [{ nodeId: '5' }],
              },
            ],
          },
          { nodeId: '6' },
        ],
        7
      )
    ).toEqual(null);
  });
});

describe('getNodeAtPath', () => {
  it('should handle empty data', () => {
    expect(getNodeAtPath([], ['1'])).toEqual(null);
  });

  it('should handle flat data', () => {
    expect(getNodeAtPath([{ nodeId: '0' }], ['0']).node.nodeId).toEqual('0');
    expect(
      getNodeAtPath([{ nodeId: '0' }, { nodeId: '1' }], ['1']).node.nodeId
    ).toEqual('1');
  });

  it('should handle partially expanded nested data', () => {
    const result = getNodeAtPath(
      [
        {
          expanded: true,
          nodeId: '0',
          children: [
            {
              nodeId: '1',
              children: [{ nodeId: '2' }, { nodeId: '3' }],
            },
            {
              expanded: true,
              nodeId: '4',
              children: [{ nodeId: '5' }],
            },
          ],
        },
        { nodeId: '6' },
      ],
      ['0', '4', '5']
    );

    expect(result.node.nodeId).toEqual('5');
  });

  it('should handle fully expanded nested data', () => {
    const result = getNodeAtPath(
      [
        {
          expanded: true,
          nodeId: '0',
          children: [
            {
              expanded: true,
              nodeId: '1',
              children: [{ nodeId: '2' }, { nodeId: '3' }],
            },
            {
              expanded: true,
              nodeId: '4',
              children: [{ nodeId: '5' }],
            },
          ],
        },
        { nodeId: '6' },
      ],
      ['0', '4', '5']
    );

    expect(result.node.nodeId).toEqual('5');
  });

  it('should handle a nodeId not in the data', () => {
    expect(
      getNodeAtPath(
        [
          {
            expanded: true,
            nodeId: '0',
            children: [
              {
                expanded: true,
                nodeId: '1',
                children: [{ nodeId: '2' }, { nodeId: '3' }],
              },
              {
                expanded: true,
                nodeId: '4',
                children: [{ nodeId: '5' }],
              },
            ],
          },
          { nodeId: '6' },
        ],
        ['7']
      )
    ).toEqual(null);
  });
});

describe('getFlatDataFromTree', () => {
  it('should handle empty data', () => {
    expect(getFlatDataFromTree([])).toEqual([]);
  });

  it('should handle flat data', () => {
    expect(getFlatDataFromTree([{ nodeId: '0' }], true)).toEqual([
      {
        node: { nodeId: '0' },
        parentNode: null,
        path: ['0'],
        lowerSiblingCounts: [0],
        treeIndex: 0,
      },
    ]);

    expect(
      getFlatDataFromTree([{ nodeId: '0' }, { nodeId: '1' }], true)
    ).toEqual([
      {
        node: { nodeId: '0' },
        parentNode: null,
        path: ['0'],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: { nodeId: '1' },
        parentNode: null,
        path: ['1'],
        lowerSiblingCounts: [0],
        treeIndex: 1,
      },
    ]);
  });

  it('should handle hidden nested data', () => {
    const treeData = [
      {
        nodeId: '0',
        children: [
          {
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
          {
            nodeId: '4',
            children: [{ nodeId: '5' }],
          },
        ],
      },
      { nodeId: '6' },
    ];

    expect(getFlatDataFromTree(treeData, true)).toEqual([
      {
        node: treeData[0],
        parentNode: null,
        path: ['0'],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: treeData[1],
        parentNode: null,
        path: ['6'],
        lowerSiblingCounts: [0],
        treeIndex: 1,
      },
    ]);
  });

  it('should handle partially expanded nested data', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [
          {
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
          {
            expanded: true,
            nodeId: '4',
            children: [{ nodeId: '5' }],
          },
        ],
      },
      { nodeId: '6' },
    ];

    expect(getFlatDataFromTree(treeData, true)).toEqual([
      {
        node: treeData[0],
        parentNode: null,
        path: ['0'],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: treeData[0].children[0],
        parentNode: treeData[0],
        path: ['0', '1'],
        lowerSiblingCounts: [1, 1],
        treeIndex: 1,
      },
      {
        node: treeData[0].children[1],
        parentNode: treeData[0],
        path: ['0', '4'],
        lowerSiblingCounts: [1, 0],
        treeIndex: 2,
      },
      {
        node: treeData[0].children[1].children[0],
        parentNode: treeData[0].children[1],
        path: ['0', '4', '5'],
        lowerSiblingCounts: [1, 0, 0],
        treeIndex: 3,
      },
      {
        node: treeData[1],
        parentNode: null,
        path: ['6'],
        lowerSiblingCounts: [0],
        treeIndex: 4,
      },
    ]);
  });

  it('should handle fully expanded nested data', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [
          {
            expanded: true,
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
          {
            expanded: true,
            nodeId: '4',
            children: [{ nodeId: '5' }],
          },
        ],
      },
      { nodeId: '6' },
    ];

    expect(getFlatDataFromTree(treeData, true)).toEqual([
      {
        node: treeData[0],
        parentNode: null,
        path: ['0'],
        lowerSiblingCounts: [1],
        treeIndex: 0,
      },
      {
        node: treeData[0].children[0],
        parentNode: treeData[0],
        path: ['0', '1'],
        lowerSiblingCounts: [1, 1],
        treeIndex: 1,
      },
      {
        node: treeData[0].children[0].children[0],
        parentNode: treeData[0].children[0],
        path: ['0', '1', '2'],
        lowerSiblingCounts: [1, 1, 1],
        treeIndex: 2,
      },
      {
        node: treeData[0].children[0].children[1],
        parentNode: treeData[0].children[0],
        path: ['0', '1', '3'],
        lowerSiblingCounts: [1, 1, 0],
        treeIndex: 3,
      },
      {
        node: treeData[0].children[1],
        parentNode: treeData[0],
        path: ['0', '4'],
        lowerSiblingCounts: [1, 0],
        treeIndex: 4,
      },
      {
        node: treeData[0].children[1].children[0],
        parentNode: treeData[0].children[1],
        path: ['0', '4', '5'],
        lowerSiblingCounts: [1, 0, 0],
        treeIndex: 5,
      },
      {
        node: treeData[1],
        parentNode: null,
        path: ['6'],
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
    expect(() => changeNodeAtPath([], ['1'], fill({}))).toThrow(noNodeError);
  });

  it('should handle flat data', () => {
    expect(
      changeNodeAtPath([{ nodeId: '0' }], ['0'], { nodeId: '1' })
    ).toEqual([{ nodeId: '1' }]);

    expect(
      changeNodeAtPath([{ nodeId: '0' }, { nodeId: 'a' }], ['a'], {
        nodeId: '1',
      })
    ).toEqual([{ nodeId: '0' }, { nodeId: '1' }]);
  });

  it('should handle nested data', () => {
    const result = changeNodeAtPath(
      [
        {
          expanded: true,
          nodeId: '0',
          children: [
            {
              nodeId: 'b',
              children: [{ nodeId: '2' }, { nodeId: '3' }, { nodeId: 'f' }],
            },
            {
              expanded: true,
              nodeId: 'r',
              children: [{ nodeId: '5' }, { nodeId: '8' }, { nodeId: '7' }],
            },
          ],
        },
        { nodeId: '6' },
      ],
      ['0', 'r', '7'],
      { nodeId: 'pancake' }
    );

    expect(result[0].children[1].children[2].nodeId).toEqual('pancake');
  });

  it('should handle adding children', () => {
    const result = changeNodeAtPath(
      [
        {
          expanded: true,
          nodeId: '0',
          children: [
            {
              nodeId: 'b',
              children: [{ nodeId: '2' }, { nodeId: '3' }, { nodeId: 'f' }],
            },
            {
              expanded: true,
              nodeId: 'r',
              children: [{ nodeId: '5' }, { nodeId: '8' }, { nodeId: '7' }],
            },
          ],
        },
        { nodeId: '6' },
      ],
      ['0', 'r', '7'],
      ({ node }) => ({
        ...node,
        children: [{ nodeId: 'pancake' }],
      })
    );

    expect(result[0].children[1].children[2].children[0].nodeId).toEqual(
      'pancake'
    );
  });

  it('should handle adding children to the root', () => {
    expect(
      changeNodeAtPath([], [], ({ node }) => ({
        ...node,
        children: [...(node.children as TreeNode[]), { nodeId: '1' }],
      }))
    ).toEqual([{ nodeId: '1' }]);

    expect(
      changeNodeAtPath([{ nodeId: '0' }], [], ({ node }) => ({
        ...node,
        children: [...(node.children as TreeNode[]), { nodeId: '1' }],
      }))
    ).toEqual([{ nodeId: '0' }, { nodeId: '1' }]);
  });

  it('should delete data when falsey node passed', () => {
    const result = changeNodeAtPath(
      [
        {
          expanded: true,
          nodeId: 'b',
          children: [{ nodeId: 'f' }],
        },
        {
          expanded: true,
          nodeId: 'r',
          children: [{ nodeId: '7' }],
        },
        { nodeId: '6' },
      ],
      ['r', '7'],
      null
    );

    expect(result[1].children.length).toEqual(0);
  });

  it('should delete data on the top level', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: 'b',
        children: [{ nodeId: 'f' }],
      },
      {
        expanded: true,
        nodeId: 'r',
        children: [{ nodeId: '7' }],
      },
      { nodeId: '6' },
    ];
    const result = changeNodeAtPath(treeData, ['r'], null);

    expect(result).toEqual([treeData[0], treeData[2]]);
  });

  it('should handle a path that is too long', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [
          {
            expanded: true,
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
        ],
      },
    ];

    expect(() =>
      changeNodeAtPath(treeData, ['0', '1', '2', '4'], { nodeId: 'aa' })
    ).toThrow(new Error('Path referenced children of node with no children.'));
  });

  it('should handle a path that does not exist', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [
          {
            expanded: true,
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
        ],
      },
    ];

    expect(() =>
      changeNodeAtPath(treeData, ['0', '2'], { nodeId: 'aa' })
    ).toThrowError('No node found at the given path.');
  });
});

describe('addNodeUnderParent', () => {
  it('should handle empty data', () => {
    const node = fill({});
    expect(addNodeUnderParent([], node)).toEqual({
      treeData: [node],
      treeIndex: 0,
    });
  });

  it('should handle a parentPath that does not exist', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [
          {
            expanded: true,
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
        ],
      },
    ];

    expect(() =>
      addNodeUnderParent(treeData, { nodeId: '1' }, 'fake')
    ).toThrowError('No node found with the given nodeId.');
  });

  it('should handle flat data', () => {
    // Older sibling of only node
    expect(
      addNodeUnderParent([{ nodeId: '0' }], { nodeId: '1' }, null)
    ).toEqual({ treeData: [{ nodeId: '0' }, { nodeId: '1' }], treeIndex: 1 });

    // Child of only node
    expect(addNodeUnderParent([{ nodeId: '0' }], { nodeId: '1' }, '0')).toEqual(
      {
        treeData: [{ nodeId: '0', children: [{ nodeId: '1' }] }],
        treeIndex: 1,
      }
    );

    expect(
      addNodeUnderParent(
        [{ nodeId: '0' }, { nodeId: 'a' }],
        { nodeId: '1' },
        'a'
      )
    ).toEqual({
      treeData: [{ nodeId: '0' }, { nodeId: 'a', children: [{ nodeId: '1' }] }],
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
        nodeId: '0',
        children: [
          {
            expanded: true,
            nodeId: '1',
            children: [
              { nodeId: '2' },
              {
                expanded: false,
                nodeId: '3',
                children: [{ nodeId: '4' }],
              },
            ],
          },
          { nodeId: '5' },
        ],
      },
      { nodeId: '6' },
    ],
    newNode: { nodeId: 'new' },
  };

  it('should handle nested data #1', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '0'
    );

    expect(result.treeData[0].children[2]).toEqual(nestedParams.newNode);
    expect(result.treeIndex).toEqual(5);
  });

  it('should handle nested data #2', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '1'
    );

    expect(result.treeData[0].children[0].children[2]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(4);
  });

  it('should handle nested data #3', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '3'
    );

    expect(result.treeData[0].children[0].children[1].children[1]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
  });

  it('should handle nested data #1 (using tree index as key)', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '0'
    );

    expect(result.treeData[0].children[2]).toEqual(nestedParams.newNode);
    expect(result.treeIndex).toEqual(5);
  });

  it('should handle nested data #2 (using tree index as key)', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '1'
    );

    expect(result.treeData[0].children[0].children[2]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(4);
  });

  it('should handle nested data #3 (using tree index as key)', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '3'
    );

    expect(result.treeData[0].children[0].children[1].children[1]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
  });

  it('should add new node as last child by default', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '0'
    );

    const [existingChild0, existingChild1, expectedNewNode] = result.treeData[0]
      .children as TreeNode[];

    expect(expectedNewNode).toEqual(nestedParams.newNode);
    expect([existingChild0, existingChild1]).toEqual(
      nestedParams.treeData[0].children
    );
  });

  it('should add new node as first child if addAsFirstChild is true', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      '0',
      true
    );

    const [expectedNewNode, ...previousChildren] = result.treeData[0]
      .children as TreeNode[];

    expect(expectedNewNode).toEqual(nestedParams.newNode);
    expect(previousChildren).toEqual(nestedParams.treeData[0].children);
  });

  it('should add new node as first child under root if addAsFirstChild is true', () => {
    const result = addNodeUnderParent(
      nestedParams.treeData,
      nestedParams.newNode,
      null,
      true
    );

    const [expectedNewNode, ...previousTreeData] = result.treeData;

    expect(expectedNewNode).toEqual(nestedParams.newNode);
    expect(previousTreeData).toEqual(nestedParams.treeData);
  });
});

describe('insertNode', () => {
  it('should handle empty data', () => {
    const node = { nodeId: '0' };
    expect(insertNode([], node, 0, 0)).toEqual({
      parentNode: null,
      treeData: [node],
      treeIndex: 0,
      path: ['0'],
    });
  });

  it('should handle a depth that is deeper than any branch in the tree', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [
          {
            expanded: true,
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
        ],
      },
    ];

    expect(insertNode(treeData, { nodeId: 'new' }, 4, 0).treeData[0]).toEqual({
      nodeId: 'new',
    });
  });

  it('should handle a minimumTreeIndex that is too big', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [
          {
            expanded: true,
            nodeId: '1',
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
        ],
      },
      { nodeId: '4' },
    ];

    let insertResult = insertNode(treeData, { nodeId: 'new' }, 0, 15);
    expect(insertResult.treeData[2]).toEqual({ nodeId: 'new' });
    expect(insertResult.treeIndex).toEqual(5);
    expect(insertResult.path).toEqual(['new']);

    insertResult = insertNode(treeData, { nodeId: 'new' }, 2, 15);

    expect(insertResult.treeData[1].children[0]).toEqual({ nodeId: 'new' });
    expect(insertResult.treeIndex).toEqual(5);
    expect(insertResult.path).toEqual(['4', 'new']);
  });

  it('should handle flat data (before)', () => {
    expect(insertNode([{ nodeId: '0' }], { nodeId: '1' }, 0, 0)).toEqual({
      parentNode: null,
      treeData: [{ nodeId: '1' }, { nodeId: '0' }],
      treeIndex: 0,
      path: ['1'],
    });
  });

  it('should handle flat data (after)', () => {
    expect(insertNode([{ nodeId: '0' }], { nodeId: '1' }, 0, 1)).toEqual({
      parentNode: null,
      treeData: [{ nodeId: '0' }, { nodeId: '1' }],
      treeIndex: 1,
      path: ['1'],
    });
  });

  it('should handle flat data (child)', () => {
    expect(insertNode([{ nodeId: '0' }], { nodeId: '1' }, 1, 1)).toEqual({
      parentNode: { nodeId: '0', children: [{ nodeId: '1' }] },
      treeData: [{ nodeId: '0', children: [{ nodeId: '1' }] }],
      treeIndex: 1,
      path: ['0', '1'],
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
        nodeId: '0',
        children: [
          // Depth 1
          {
            expanded: true,
            nodeId: '1',
            children: [
              // Depth 2
              { nodeId: '2' },
              {
                expanded: false,
                nodeId: '3',
                children: [
                  // Depth 3
                  { nodeId: '4' },
                ],
              },
              { nodeId: '5' },
            ],
          },
          { nodeId: '6' },
        ],
      },
      { nodeId: '7' },
    ],
    newNode: { nodeId: 'new' },
  };

  it('should handle nested data #1', () => {
    const result = insertNode(
      nestedParams.treeData,
      nestedParams.newNode,
      1,
      4
    );

    expect(result.treeData[0].children[1]).toEqual(nestedParams.newNode);
    expect(result.treeIndex).toEqual(5);
    expect(result.path).toEqual(['0', 'new']);
  });

  it('should handle nested data #2', () => {
    let result = insertNode(
      nestedParams.treeData,
      nestedParams.newNode,
      2,
      5,
      true
    );

    expect(result.treeData[0].children[0].children[3]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
    expect(result.path).toEqual(['0', '1', 'new']);

    result = insertNode(
      nestedParams.treeData,
      nestedParams.newNode,
      2,
      5,
      false
    );

    expect(result.treeData[0].children[0].children[2]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(5);
    expect(result.path).toEqual(['0', '1', 'new']);
  });

  it('should handle nested data #3', () => {
    const result = insertNode(
      nestedParams.treeData,
      nestedParams.newNode,
      3,
      3
    );

    expect(result.treeData[0].children[0].children[0].children[0]).toEqual(
      nestedParams.newNode
    );
    expect(result.treeIndex).toEqual(3);
    expect(result.path).toEqual(['0', '1', '2', 'new']);
  });

  it('should handle nested data #4', () => {
    expect(
      insertNode(
        [
          { nodeId: '0', expanded: true, children: [{ nodeId: '1' }] },
          { nodeId: '2' },
        ],
        { nodeId: 'new' },
        1,
        3
      )
    ).toEqual({
      parentNode: { nodeId: '2', children: [{ nodeId: 'new' }] },
      treeData: [
        { nodeId: '0', expanded: true, children: [{ nodeId: '1' }] },
        { nodeId: '2', children: [{ nodeId: 'new' }] },
      ],
      treeIndex: 3,
      path: ['2', 'new'],
    });
  });

  it('should work with a preceding node with children #1', () => {
    expect(
      insertNode(
        [
          { nodeId: '0', children: [{ nodeId: '1' }] },
          {
            nodeId: '2',
            expanded: true,
            children: [{ nodeId: '3' }, { nodeId: '4' }],
          },
        ],
        { nodeId: 'new' },
        1,
        3
      )
    ).toEqual({
      parentNode: {
        nodeId: '2',
        expanded: true,
        children: [{ nodeId: '3' }, { nodeId: 'new' }, { nodeId: '4' }],
      },
      treeData: [
        { nodeId: '0', children: [{ nodeId: '1' }] },
        {
          nodeId: '2',
          expanded: true,
          children: [{ nodeId: '3' }, { nodeId: 'new' }, { nodeId: '4' }],
        },
      ],
      treeIndex: 3,
      path: ['2', 'new'],
    });
  });

  it('should work with a preceding node with children #2', () => {
    expect(
      insertNode(
        [
          { nodeId: '0', children: [{ nodeId: '1' }] },
          {
            nodeId: '2',
            expanded: true,
            children: [{ nodeId: '3' }, { nodeId: '4' }],
          },
        ],
        { nodeId: 'new' },
        2,
        4
      )
    ).toEqual({
      parentNode: { nodeId: '4', children: [{ nodeId: 'new' }] },
      treeData: [
        { nodeId: '0', children: [{ nodeId: '1' }] },
        {
          nodeId: '2',
          expanded: true,
          children: [
            { nodeId: '3' },
            { nodeId: '4', children: [{ nodeId: 'new' }] },
          ],
        },
      ],
      treeIndex: 4,
      path: ['2', '4', 'new'],
    });
  });

  it('should work with a preceding node with children #3', () => {
    expect(
      insertNode(
        [
          {
            nodeId: '0',
            children: [
              { nodeId: '01' },
              { nodeId: '02' },
              { nodeId: '03' },
              { nodeId: '04' },
            ],
          },
          {
            nodeId: '1',
            expanded: true,
            children: [{ nodeId: '2' }, { nodeId: '3' }],
          },
        ],
        { nodeId: 'new' },
        2,
        4
      )
    ).toEqual({
      parentNode: { nodeId: '3', children: [{ nodeId: 'new' }] },
      treeData: [
        {
          nodeId: '0',
          children: [
            { nodeId: '01' },
            { nodeId: '02' },
            { nodeId: '03' },
            { nodeId: '04' },
          ],
        },
        {
          nodeId: '1',
          expanded: true,
          children: [
            { nodeId: '2' },
            { nodeId: '3', children: [{ nodeId: 'new' }] },
          ],
        },
      ],
      treeIndex: 4,
      path: ['1', '3', 'new'],
    });
  });

  it('should work with nodes with an empty children array', () => {
    expect(
      insertNode(
        [
          {
            nodeId: '0',
            expanded: true,
            children: [
              {
                nodeId: '1',
                expanded: true,
                children: [{ nodeId: '2', children: [] }],
              },
            ],
          },
        ],
        { nodeId: 'new' },
        2,
        2
      )
    ).toEqual({
      parentNode: {
        nodeId: '1',
        expanded: true,
        children: [{ nodeId: 'new' }, { nodeId: '2', children: [] }],
      },
      treeData: [
        {
          nodeId: '0',
          expanded: true,
          children: [
            {
              nodeId: '1',
              expanded: true,
              children: [{ nodeId: 'new' }, { nodeId: '2', children: [] }],
            },
          ],
        },
      ],
      treeIndex: 2,
      path: ['0', '1', 'new'],
    });
  });
});

describe('walk', () => {
  it('should handle empty data', () => {
    expect(() =>
      walk([], () => {
        throw new Error('callback ran');
      })
    ).not.toThrow();
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
      walk(
        fill(treeData),
        () => {
          callCount += 1;
        },
        ignoreCollapsed
      );

      expect(callCount).toEqual(expected);
    });
  });

  it('should return correct params', () => {
    const paths = [['0'], ['1'], ['1', '2'], ['3']];
    let counter = 0;

    walk(
      [
        { nodeId: '0' },
        { nodeId: '1', children: [{ nodeId: '2' }] },
        { nodeId: '3' },
      ],
      ({ treeIndex, path }) => {
        expect(treeIndex).toEqual(counter);
        expect(path).toEqual(paths[treeIndex]);
        counter += 1;
      },
      false
    );
  });

  it('should cut walk short when false is returned', () => {
    const treeData = [
      {
        expanded: true,
        nodeId: '0',
        children: [{ nodeId: '2' }, { nodeId: '3' }],
      },
      { nodeId: '6' },
    ];

    expect(() =>
      walk(treeData, ({ node }) => {
        if (node.nodeId === '2') {
          // Cut walk short with false
          return false;
        }
        if (node.nodeId === '3') {
          throw new Error('walk not terminated by false');
        }
      })
    ).not.toThrow();
  });

  it('can get parents while walking', () => {
    const treeData = [
      {
        nodeId: '1',
        children: [
          { nodeId: '12', children: [{ nodeId: '3' }] },
          { nodeId: '4' },
        ],
      },
      { nodeId: '5' },
    ];
    const results = [];
    walk(
      treeData,
      ({ parentNode }) => {
        results.push(parentNode ? parentNode.nodeId : null);
      },
      false
    );

    expect(results).toEqual([null, '1', '12', '1', null]);
  });
});

describe('getTreeFromFlatData', () => {
  const rootId = '-1';
  const argDefaults = {
    rootId,
    getNodeId: node => node.id,
    getParentNodeId: node => node.parentId,
  };

  const checkFunction = ({ flatData, expected }) => {
    expect(
      getTreeFromFlatData(
        flatData,
        argDefaults.getNodeId,
        argDefaults.getParentNodeId,
        argDefaults.rootId
      )
    ).toEqual(expected);
  };

  it('should handle empty data', () => {
    [{ flatData: [], expected: [] }].forEach(checkFunction);
  });

  it('should handle [depth == 1] data', () => {
    [
      {
        flatData: [
          { id: '1', parentId: rootId },
          { id: '2', parentId: rootId },
        ],
        expected: [
          { nodeId: '1', id: '1', parentId: rootId },
          { nodeId: '2', id: '2', parentId: rootId },
        ],
      },
      {
        flatData: [
          { id: '1', parentId: rootId },
          { id: '2', parentId: rootId },
        ],
        expected: [
          { nodeId: '1', id: '1', parentId: rootId },
          { nodeId: '2', id: '2', parentId: rootId },
        ],
      },
    ].forEach(checkFunction);
  });

  it('should handle [depth == 2] data', () => {
    [
      {
        flatData: [
          { id: '1', parentId: rootId },
          { id: '2', parentId: '1' },
        ],
        expected: [
          {
            nodeId: '1',
            id: '1',
            parentId: rootId,
            children: [{ nodeId: '2', id: '2', parentId: '1' }],
          },
        ],
      },
      {
        flatData: [
          { id: '1', parentId: rootId },
          { id: '2', parentId: '1' },
        ],
        expected: [
          {
            nodeId: '1',
            id: '1',
            parentId: rootId,
            children: [{ nodeId: '2', id: '2', parentId: '1' }],
          },
        ],
      },
    ].forEach(checkFunction);
  });

  it('should handle [depth > 2] nested data', () => {
    [
      {
        flatData: [
          { id: '3', parentId: '2' },
          { id: '1', parentId: rootId },
          { id: '2', parentId: '1' },
        ],
        expected: [
          {
            nodeId: '1',
            id: '1',
            parentId: rootId,
            children: [
              {
                nodeId: '2',
                id: '2',
                parentId: '1',
                children: [{ nodeId: '3', id: '3', parentId: '2' }],
              },
            ],
          },
        ],
      },
      {
        flatData: [
          { id: '4', parentId: '2' },
          { id: '3', parentId: '2' },
          { id: '7', parentId: rootId },
          { id: '1', parentId: rootId },
          { id: '2', parentId: '1' },
          { id: '6', parentId: '1' },
        ],
        expected: [
          { nodeId: '7', id: '7', parentId: rootId },
          {
            nodeId: '1',
            id: '1',
            parentId: rootId,
            children: [
              {
                nodeId: '2',
                id: '2',
                parentId: '1',
                children: [
                  { nodeId: '4', id: '4', parentId: '2' },
                  { nodeId: '3', id: '3', parentId: '2' },
                ],
              },
              { nodeId: '6', id: '6', parentId: '1' },
            ],
          },
        ],
      },
    ].forEach(checkFunction);
  });
});

describe('map', () => {
  const checkFunction = ({ treeData, callback, ignoreCollapsed, expected }) => {
    expect(map(treeData, callback, ignoreCollapsed)).toEqual(expected);
  };

  it('should handle empty data', () => {
    [
      {
        treeData: [],
        callback: ({ node }) => node,
        expected: [],
      },
      {
        treeData: null,
        callback: ({ node }) => node,
        expected: [],
      },
      {
        treeData: undefined,
        callback: ({ node }) => node,
        expected: [],
      },
    ].forEach(checkFunction);
  });

  it('can return tree as-is', () => {
    [
      {
        callback: ({ node }) => node,
        treeData: [{ nodeId: '1' }, { nodeId: '2' }],
        expected: [{ nodeId: '1' }, { nodeId: '2' }],
      },
      {
        callback: ({ node }) => node,
        treeData: [{ nodeId: '1', children: [{ nodeId: '2' }] }],
        expected: [{ nodeId: '1', children: [{ nodeId: '2' }] }],
      },
      {
        callback: ({ node }) => node,
        treeData: [
          {
            nodeId: '1',
            children: [
              { nodeId: '12', children: [{ nodeId: '3' }] },
              { nodeId: '4' },
            ],
          },
          { nodeId: '5' },
        ],
        expected: [
          {
            nodeId: '1',
            children: [
              { nodeId: '12', children: [{ nodeId: '3' }] },
              { nodeId: '4' },
            ],
          },
          { nodeId: '5' },
        ],
      },
    ].forEach(checkFunction);
  });

  it('can truncate part of the tree', () => {
    [
      {
        callback: ({ node }) =>
          node.nodeId === '1' ? { ...node, children: [] } : node,
        treeData: [
          {
            nodeId: '1',
            children: [
              { nodeId: '12', children: [{ nodeId: '3' }] },
              { nodeId: '4' },
            ],
          },
          { nodeId: '5' },
        ],
        expected: [{ nodeId: '1', children: [] }, { nodeId: '5' }],
      },
    ].forEach(checkFunction);
  });

  it('can get parents', () => {
    checkFunction({
      callback: ({ node, parentNode }) => ({
        ...node,
        parentId: parentNode ? parentNode.nodeId : null,
      }),
      ignoreCollapsed: false,
      treeData: [
        {
          nodeId: '1',
          children: [
            {
              nodeId: '12',
              children: [{ nodeId: '3' }],
            },
            { nodeId: '4' },
          ],
        },
        { nodeId: '5' },
      ],
      expected: [
        {
          nodeId: '1',
          parentId: null,
          children: [
            {
              nodeId: '12',
              parentId: '1',
              children: [
                {
                  nodeId: '3',
                  parentId: '12',
                },
              ],
            },
            {
              nodeId: '4',
              parentId: '1',
            },
          ],
        },
        {
          nodeId: '5',
          parentId: null,
        },
      ],
    });
  });

  it('can sort part of the tree', () => {
    [
      {
        callback: ({ node }) =>
          !node.children
            ? node
            : {
                ...node,
                children: node.children.sort((a, b) => a.nodeId - b.nodeId),
              },
        treeData: [
          {
            nodeId: '1',
            expanded: true,
            children: [
              {
                nodeId: '12',
                expanded: true,
                children: [{ nodeId: '33' }, { nodeId: '3' }],
              },
              { nodeId: '4' },
            ],
          },
          { nodeId: '5' },
        ],
        expected: [
          {
            nodeId: '1',
            expanded: true,
            children: [
              { nodeId: '4' },
              {
                nodeId: '12',
                expanded: true,
                children: [{ nodeId: '3' }, { nodeId: '33' }],
              },
            ],
          },
          { nodeId: '5' },
        ],
      },
    ].forEach(checkFunction);
  });

  it('can modify every node in the tree', () => {
    [
      {
        callback: ({ node }) => ({ ...node, expanded: true }),
        ignoreCollapsed: false,
        treeData: [
          {
            nodeId: '1',
            children: [
              {
                nodeId: '12',
                children: [{ nodeId: '33' }, { nodeId: '3' }],
              },
              { nodeId: '4' },
            ],
          },
          { nodeId: '5' },
        ],
        expected: [
          {
            nodeId: '1',
            expanded: true,
            children: [
              {
                nodeId: '12',
                expanded: true,
                children: [
                  { nodeId: '33', expanded: true },
                  { nodeId: '3', expanded: true },
                ],
              },
              { nodeId: '4', expanded: true },
            ],
          },
          { nodeId: '5', expanded: true },
        ],
      },
    ].forEach(checkFunction);
  });
});

describe('isDescendant', () => {
  const treeData = [
    {
      nodeId: '1',
      children: [
        {
          nodeId: '12',
          children: [{ nodeId: '33' }, { nodeId: '3' }],
        },
        { nodeId: '4' },
      ],
    },
    { nodeId: '5' },
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
      nodeId: '1',
      children: [
        {
          nodeId: '12',
          children: [{ nodeId: '33' }, { nodeId: '3' }],
        },
        { nodeId: '4' },
      ],
    },
    { nodeId: '5' },
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
    expect(getDescendantCount(fill({}), false)).toEqual(0);
    expect(getDescendantCount(fill({ children: [] }), false)).toEqual(0);
    expect(getDescendantCount(fill({ children: [{}] }), false)).toEqual(1);
    expect(getDescendantCount(fill({ children: [{}, {}] }), false)).toEqual(2);
  });

  it('should count nested data', () => {
    const nested = fill({
      expanded: true,
      children: [{}, { children: [{}] }, {}],
    });

    expect(getDescendantCount(nested, false)).toEqual(4);
    expect(getDescendantCount(nested, true)).toEqual(3);
  });
});

describe('find', () => {
  const offsetDefault = 0;
  const check = (treeData: TreeData, searchFocusOffset = offsetDefault) => {
    return find(
      treeData,
      '42',
      ({ node, searchQuery }) => node.nodeId === searchQuery,
      searchFocusOffset,
      false,
      true
    );
  };

  it('should work with flat data', () => {
    let result: ReturnType<typeof find>;

    result = check(fill([{}]));
    expect(result.matches).toEqual([]);

    result = check([{ nodeId: '41' }]);
    expect(result.matches).toEqual([]);

    result = check([{ nodeId: '42' }]);
    expect(result.matches).toEqual([
      { node: { nodeId: '42' }, treeIndex: 0, path: ['42'] },
    ]);
    expect(result.matches[offsetDefault].treeIndex).toEqual(0);

    result = check([{ nodeId: '41' }, { nodeId: '42' }]);
    expect(result.matches).toEqual([
      { node: { nodeId: '42' }, treeIndex: 1, path: ['42'] },
    ]);
    expect(result.matches[offsetDefault].treeIndex).toEqual(1);

    result = check([{ nodeId: '42' }, { nodeId: '42' }]);
    expect(result.matches).toEqual([
      { node: { nodeId: '42' }, treeIndex: 0, path: ['42'] },
      { node: { nodeId: '42' }, treeIndex: 1, path: ['42'] },
    ]);
    expect(result.matches[offsetDefault].treeIndex).toEqual(0);

    result = check(
      [
        { nodeId: '1' },
        { nodeId: '42' },
        { nodeId: '3' },
        { nodeId: '3' },
        { nodeId: '3' },
        { nodeId: '4' },
        { nodeId: '42' },
        { nodeId: '42' },
        { nodeId: '4' },
        { nodeId: '42' },
      ],
      3
    );
    expect(result.matches).toEqual([
      { node: { nodeId: '42' }, treeIndex: 1, path: ['42'] },
      { node: { nodeId: '42' }, treeIndex: 6, path: ['42'] },
      { node: { nodeId: '42' }, treeIndex: 7, path: ['42'] },
      { node: { nodeId: '42' }, treeIndex: 9, path: ['42'] },
    ]);
    expect(result.matches[3].treeIndex).toEqual(9);
  });

  it('should work with nested data', () => {
    let result: ReturnType<typeof find>;

    result = check(fill([{ children: [{ nodeId: '42' }] }]));
    expect(result.matches.length).toEqual(1);
    expect(result.matches[offsetDefault].treeIndex).toEqual(1);

    result = check(
      fill([{ children: [{ nodeId: '41' }] }, { children: [{ nodeId: '42' }] }])
    );
    expect(result.matches.length).toEqual(1);
    expect(result.matches[offsetDefault].treeIndex).toEqual(2);
    expect(result.treeData).toEqual(
      fill([
        { children: [{ nodeId: '41' }] },
        { expanded: true, children: [{ nodeId: '42' }] },
      ])
    );

    result = check(fill([{ children: [{ children: [{ nodeId: '42' }] }] }]));
    expect(result.matches.length).toEqual(1);
    expect(result.matches[offsetDefault].treeIndex).toEqual(2);

    result = check(
      fill([{ children: [{ nodeId: '42', children: [{ nodeId: '42' }] }] }])
    );
    expect(result.matches.length).toEqual(2);
    expect(result.matches[offsetDefault].treeIndex).toEqual(1);

    result = check(
      fill([
        {},
        {
          children: [
            { nodeId: '42', expanded: true, children: [{ nodeId: '42' }] },
          ],
        },
      ])
    );
    expect(result.matches.length).toEqual(2);
    expect(result.matches[offsetDefault].treeIndex).toEqual(2);

    result = check(
      fill([
        {},
        {
          children: [
            { nodeId: '1', expanded: true, children: [{ nodeId: '1' }] },
          ],
        },
      ])
    );
    expect(result.matches.length).toEqual(0);
  });
});

describe('toggleExpandedForAll', () => {
  it('should expand all', () => {
    expect(
      toggleExpandedForAll(
        [
          {
            nodeId: '0',
            children: [{ nodeId: '1', children: [{ nodeId: '2' }] }],
          },
        ],
        true
      )
    ).toEqual([
      {
        nodeId: '0',
        expanded: true,
        children: [
          {
            nodeId: '1',
            expanded: true,
            children: [{ expanded: true, nodeId: '2' }],
          },
        ],
      },
    ]);
  });
  it('should collapse all', () => {
    expect(
      toggleExpandedForAll(
        [
          {
            expanded: true,
            nodeId: '0',
            children: [
              {
                nodeId: '1',
                expanded: true,
                children: [{ nodeId: '2', expanded: true }],
              },
            ],
          },
        ],
        false
      )
    ).toEqual([
      {
        expanded: false,
        nodeId: '0',
        children: [
          {
            nodeId: '1',
            expanded: false,
            children: [{ nodeId: '2', expanded: false }],
          },
        ],
      },
    ]);
  });
});
