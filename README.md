# React Sortable Tree

[![NPM](https://nodei.co/npm/react-sortable-tree.png)](https://npmjs.org/package/react-sortable-tree)

[![tree200](https://cloud.githubusercontent.com/assets/4413963/18860410/26f64de8-84b8-11e6-9284-350308eed30a.png)](https://fritz-c.github.io/react-sortable-tree/)

### [Demo](https://fritz-c.github.io/react-sortable-tree/)
[![demo](https://cloud.githubusercontent.com/assets/4413963/19334888/2be8261c-913a-11e6-9508-4b347ae114b4.gif)](https://fritz-c.github.io/react-sortable-tree/)

## Usage

```jsx
import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';

export default class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [{ title: 'Chicken', children: [ { title: 'Egg' } ] }],
    };
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    );
  }
}
```
Find more examples in the [Storybook](https://fritz-c.github.io/react-sortable-tree/storybook/)

Play with the code on an [example on WebpackBin](https://www.webpackbin.com/bins/-KudqEIsooxEdVHV4G8c)

## Options

Prop                      | Type           | <div style="width: 400px;">Description</div>
:-------------------------|:--------------:|:----------------------------------------
treeData<br/>_(required)_ | object[]       | Tree data with the following keys: <div>`title` is the primary label for the node.</div><div>`subtitle` is a secondary label for the node.</div><div>`expanded` shows children of the node if true, or hides them if false. Defaults to false.</div><div>`children` is an array of child nodes belonging to the node.</div><div>__Example__: `[{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]`
onChange<br/>_(required)_ | func           | Called whenever tree data changed. Just like with React input elements, you have to update your own component's data to see the changes reflected.<div>`( treeData: object[] ): void`</div>
style                     | object         | Style applied to the container wrapping the tree (style defaults to {height: '100%'})
className                 | string         | Class name for the container wrapping the tree
dndType                   | string         | String value used by [react-dnd](http://react-dnd.github.io/react-dnd/docs-overview.html) (see overview at the link) for dropTargets and dragSources types. If not set explicitly, a default value is applied by react-sortable-tree for you for its internal use. __NOTE:__ Must be explicitly set and the same value used in order for correct functioning of external nodes
innerStyle                | object         | Style applied to the inner, scrollable container (for padding, etc.)
maxDepth                  | number         | Maximum depth nodes can be inserted at. Defaults to infinite.
searchMethod              | func           | The method used to search nodes. Defaults to [`defaultSearchMethod`](https://github.com/fritz-c/react-sortable-tree/blob/master/src/utils/default-handlers.js), which uses the `searchQuery` string to search for nodes with matching `title` or `subtitle` values. NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.<div>`({ node: object, path: number[] or string[], treeIndex: number, searchQuery: any }): bool`</div>
searchQuery               | string or any  | Used by the `searchMethod` to highlight and scroll to matched nodes. Should be a string for the default `searchMethod`, but can be anything when using a custom search. Defaults to `null`.
searchFocusOffset         | number         | Outline the <`searchFocusOffset`>th node and scroll to it.
searchFinishCallback      | func           | Get the nodes that match the search criteria. Used for counting total matches, etc.<div>`(matches: { node: object, path: number[] or string[], treeIndex: number }[]): void`</div>
generateNodeProps         | func           | Generate an object with additional props to be passed to the node renderer. Use this for adding buttons via the `buttons` key, or additional `style` / `className` settings.<div>`({ node: object, path: number[] or string[], treeIndex: number, lowerSiblingCounts: number[], isSearchMatch: bool, isSearchFocus: bool }): object`</div>
getNodeKey                | func           | Determine the unique key used to identify each node and generate the `path` array passed in callbacks. It uses [`defaultGetNodeKey`](https://github.com/fritz-c/react-sortable-tree/blob/master/src/utils/default-handlers.js) by default, which returns the index in the tree (omitting hidden nodes).<div>`({ node: object, treeIndex: number }): string or number`</div>
onMoveNode                | func           | Called after node move operation. <div>`({ treeData: object[], node: object, prevPath: number[] or string[], prevTreeIndex: number, nextPath: number[] or string[], nextTreeIndex: number }): void`</div>
onVisibilityToggle        | func           | Called after children nodes collapsed or expanded. <div>`({ treeData: object[], node: object, expanded: bool }): void`</div>
canDrag                   | func or bool   | Return false from callback to prevent node from dragging, by hiding the drag handle. Set prop to `false` to disable dragging on all nodes. Defaults to `true`. <div>`({ node: object, path: number[] or string[], treeIndex: number, lowerSiblingCounts: number[], isSearchMatch: bool, isSearchFocus: bool }): bool`</div>
canDrop                   | func           | Return false to prevent node from dropping in the given location. <div>`({ node: object, prevPath: number[] or string[], prevParent: object, prevTreeIndex: number, nextPath: number[] or string[], nextParent: object, nextTreeIndex: number }): bool`</div>
shouldCopyOnOutsideDrop   | func or bool   | Return true, or a callback returning true, and dropping nodes to react-dnd drop targets outside of the tree will not remove them from the tree. Defaults to `false`. <div>`({ node: object, prevPath: number[] or string[], prevTreeIndex: number, }): bool`</div>
reactVirtualizedListProps | object         | Custom properties to hand to the [react-virtualized list](https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types)
rowHeight                 | number or func | Used by react-virtualized. Defaults to `62`. Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`
slideRegionSize           | number         | Size in px of the region near the edges that initiates scrolling on dragover.Defaults to `100`.
scaffoldBlockPxWidth      | number         | The width of the blocks containing the lines representing the structure of the tree.Defaults to `44`.
isVirtualized             | bool           | Set to false to disable virtualization. Defaults to `true`. __NOTE__: Auto-scrolling while dragging, and scrolling to the `searchFocusOffset` will be disabled.
nodeContentRenderer       | any            | Override the default component ([`NodeRendererDefault`](https://github.com/fritz-c/react-sortable-tree/blob/master/src/node-renderer-default.js)) for rendering nodes (but keep the scaffolding generator). This is a last resort for customization - most custom styling should be able to be solved with `generateNodeProps` or CSS rules. If you must use it, is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
placeholderRenderer       | any            | Override the default placeholder component ([`PlaceholderRendererDefault`](https://github.com/fritz-c/react-sortable-tree/blob/master/src/placeholder-renderer-default.js)) which is displayed when the tree is empty. This is an advanced option, and in most cases should probably be solved with custom CSS instead.

## Data Helper Functions

Need a hand turning your flat data into nested tree data?
Want to perform add/remove operations on the tree data without creating your own recursive function?
Check out the helper functions exported from [`tree-data-utils.js`](https://github.com/fritz-c/react-sortable-tree/blob/master/src/utils/tree-data-utils.js).

Notable among the available functions:

- __`getTreeFromFlatData`__: Convert flat data (like that from a database) into nested tree data
- __`getFlatDataFromTree`__: Convert tree data back to flat data
- __`addNodeUnderParent`__: Add a node under the parent node at the given path
- __`removeNodeAtPath`__: Remove the node at the given path
- __`changeNodeAtPath`__: Modify the node object at the given path
- __`map`__: Perform a change on every node in the tree
- __`walk`__: Visit every node in the tree in order

Documentation for each method is only available in the code at this time. You can also refer to the tests for simple usage examples.
If your hobbies happen to include writing documentation, by all means submit a pull request. It would really help out.

## Browser Compatibility

| Browser | Works? |
|:-----|:-----|
| Chrome | Yes |
| Firefox | Yes |
| Safari | Yes |
| IE >= 10 | Yes |
| IE 9 | Displays the tree, but drag-and-drop is hit-and-miss |

## Troubleshooting

### If it doesn't work with other components that use react-dnd

react-dnd only allows for one DragDropContext at a time (see: https://github.com/gaearon/react-dnd/issues/186). To get around this, you can import the context-less tree component via `SortableTreeWithoutDndContext`.
```js
// before
import SortableTree from 'react-sortable-tree';

// after
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
```

## Contributing

After cloning the repository and running `npm install` inside, you can use the following commands to develop and build the project.

```sh
# Starts a webpack dev server that hosts a demo page with the component.
# It uses react-hot-loader so changes are reflected on save.
npm start

# Start the storybook, which has several different examples to play with.
# Also hot-reloaded.
npm run storybook

# Runs the library tests
npm test

# Lints the code with eslint
npm run lint

# Lints and builds the code, placing the result in the dist directory.
# This build is necessary to reflect changes if you're 
#  `npm link`-ed to this repository from another local project.
npm run build
```

Pull requests are welcome!

## License

MIT
