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

## Options

Property                  | Type           | Default             | Required | Description
:-------------------------|:--------------:|:-------------------:|:--------:|:----------------------------------------
treeData                  | object[]       |                     |   yes    | Tree data with the following keys: <div>`title` is the primary label for the node.</div><div>`subtitle` is a secondary label for the node.</div><div>`expanded` shows children of the node if true, or hides them if false. Defaults to false.</div><div>`children` is an array of child nodes belonging to the node.</div><div>__Example__: `[{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]`
onChange                  | func           |                     |   yes    | Called whenever tree data changed. Just like with React input elements, you have to update your own component's data to see the changes reflected.<div>`( treeData: object[] ): void`</div>
style                     | object         | `{}`                |          | Style applied to the container wrapping the tree (style defaults to {height: '100%'})
className                 | string         |                     |          | Class name for the container wrapping the tree
dndType                 | string        |                     |          | String value used by [react-dnd](http://react-dnd.github.io/react-dnd/docs-overview.html) (see overview at the link) for dropTargets and dragSources types. If not set explicitly, a default value is applied by react-sortable-tree for you for its internal use. __NOTE:__ Must be explicitly set and the same value used in order for correct functioning of external nodes
dropCancelled                | func         |                |          | The method used to correctly update each tree in a multi-tree parent component for a cancelled drop event. This method is only necessary if multiple trees all have the same `dndType` and are thus expected to interact. __NOTE:__ the `dropCancelled` method is essentially the `onChange` prop for _all_ `treeData` objects of _all_ the trees involved for multi-tree dragging and dropping.
innerStyle                | object         | `{}`                |          | Style applied to the inner, scrollable container (for padding, etc.)
maxDepth                  | number         |                     |          | Maximum depth nodes can be inserted at. Defaults to infinite.
searchMethod              | func           |                     |          | The method used to search nodes. Defaults to a function that uses the `searchQuery` string to search for nodes with matching `title` or `subtitle` values. NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.<div>`({ node: object, path: number[] or string[], treeIndex: number, searchQuery: any }): bool`</div>
searchQuery               | string or any  | `null`              |          | Used by the `searchMethod` to highlight and scroll to matched nodes. Should be a string for the default `searchMethod`, but can be anything when using a custom search.
searchFocusOffset         | number         |                     |          | Outline the <`searchFocusOffset`>th node and scroll to it.
searchFinishCallback      | func           |                     |          | Get the nodes that match the search criteria. Used for counting total matches, etc.<div>`(matches: { node: object, path: number[] or string[], treeIndex: number }[]): void`</div>
generateNodeProps         | func           |                     |          | Generate an object with additional props to be passed to the node renderer. Use this for adding buttons via the `buttons` key, or additional `style` / `className` settings.<div>`({ node: object, path: number[] or string[], treeIndex: number, lowerSiblingCounts: number[], isSearchMatch: bool, isSearchFocus: bool }): object`</div>
getNodeKey                | func           | defaultGetNodeKey   |          | Determine the unique key used to identify each node and generate the `path` array passed in callbacks. By default, returns the index in the tree (omitting hidden nodes).<div>`({ node: object, treeIndex: number }): string or number`</div>
onMoveNode                | func           |                     |          | Called after node move operation. <div>`({ treeData: object[], node: object, treeIndex: number, path: number[] or string[] }): void`</div>
onVisibilityToggle        | func           |                     |          | Called after children nodes collapsed or expanded. <div>`({ treeData: object[], node: object, expanded: bool }): void`</div>
canDrag                   | func or bool   | `true`              |          | Return false from callback to prevent node from dragging, by hiding the drag handle. Set prop to `false` to disable dragging on all nodes. <div>`({ node: object, path: number[] or string[], treeIndex: number, lowerSiblingCounts: number[], isSearchMatch: bool, isSearchFocus: bool }): bool`</div>
canDrop                   | func           |                     |          | Return false to prevent node from dropping in the given location. <div>`({ node: object, prevPath: number[] or string[], prevParent: object, prevTreeIndex: number, nextPath: number[] or string[], nextParent: object, nextTreeIndex: number}): bool`</div>
reactVirtualizedListProps | object         |                     |          | Custom properties to hand to the [react-virtualized list](https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types)
rowHeight                 | number or func | `62`                |          | Used by react-virtualized. Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`
slideRegionSize           | number         | `100`               |          | Size in px of the region near the edges that initiates scrolling on dragover.
scaffoldBlockPxWidth      | number         | `44`                |          | The width of the blocks containing the lines representing the structure of the tree.
isVirtualized             | bool           | `true`              |          | Set to false to disable virtualization. __NOTE__: Auto-scrolling while dragging, and scrolling to the `searchFocusOffset` will be disabled.
nodeContentRenderer       | any            | NodeRendererDefault |          | Override the default component for rendering nodes (but keep the scaffolding generator) This is an advanced option for complete customization of the appearance. It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.

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

## Adding External Nodes

### How to wrap your own component as an external node

To use your own components as external nodes, you can call `dndWrapExternalSource`, exported from [`drag-and-drop-utils.js`](https://github.com/fritz-c/react-sortable-tree/blob/master/src/utils/drag-and-drop-utils.js), like in this example below, as long as you also pass the exact same [react-dnd type](http://react-dnd.github.io/react-dnd/docs-overview.html) as set for your tree component, so your custom components can become valid react-dnd [DragSources](http://react-dnd.github.io/react-dnd/docs-drag-source.html), that can be dropped in to add nodes to your own tree component.

```jsx
import React, { Component } from 'react'
import { dndWrapExternalSource } from 'react-sortable-tree';

const YourExternalNodeComponent = ({ node }) =>
  <div>{node.title}</div>;

export const externalNodeType = 'yourNodeType';

// this will wrap your external node component as a valid react-dnd DragSource
export default dndWrapExternalSource(YourExternalNodeComponent, externalNodeType);
```

__NOTE:__ You need to implement a `dropCancelled` method and an `addNewItem` method, passed as props to your external node component from your parent component, so that your tree-component can effectively respond to your external node. Check out the external node demo for an example implementation. A simple example below:

```jsx
import React, { Component } from 'react'
import {
  SortableTreeWithoutDndContext as SortableTree,
  insertNode,
} from 'react-sortable-tree'
import YourExternalNodeComponent, {
  externalNodeType,
} from './YourExternalNodeComponent.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: [
        { title: 'node1' },
        { title: 'node2' },
      ],
    }
  }

  render() {
    return (
      <div>
        <div style={{ height: 200 }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            dndType={externalNodeType}
          />
        </div>

        <YourExternalNodeComponent 
          node={{ title: 'I am an external node' }}
          addNewItem={(newItem) => {
            const { treeData } = insertNode({
              treeData: this.state.treeData,
              newNode: newItem.node,
              depth: newItem.depth,
              minimumTreeIndex: newItem.minimumTreeIndex,
              expandParent: true,
              getNodeKey: ({ treeIndex }) => treeIndex,
            });
            this.setState({ treeData });
          }}
          // Update the tree appearance post-drag
          dropCancelled={() => this.setState(state => ({
            treeData: state.treeData.concat(),
          }))}
        />
      </div>
    )
  }
}
```


In addition, the external node wrapper assumes you are using the tree component as `SortableTreeWithoutDndContext`

## Drag and Drop Between Trees

To drag and drop between multiple trees, each tree should have the same `dndType` prop and each tree should have the same `dropCancelled` method given to it. For example:

```jsx
import React, { Component } from 'react'
import {SortableTreeWithoutDndContext as SortableTree} from 'react-sortable-tree'


class App extends Component {

  constructor(props) {
    super(props)

    ...

    this.dropCancelled = this.dropCancelled.bind(this)

    ...

    this.state = {

      // treeData object for tree #1
      treeDataOne: [
        {
          {title: 'node one', subtitle: 'tree one'}
        }
      ],
      // treeData object for tree #2
      treeDataTwo: [
        {
          {title: 'node one', subtitle: 'tree two'}
        }
      ]
    }
  }

  ...

    dropCancelled () {
    // cancel drop event handler for all RST trees if no valid dropTargets, for
    // clean 'reset' of treeData object on an invalid drop. This is nothing more 
    // than the typical onChange prop you'd normally give a single RST tree, 
    // but is designed for all RST trees that can interact, meaning
    // multiple trees with the same dndType prop passed to them
    this.setState(state => ({
      treeDataOne: state.treeDataOne.concat(),
      treeDataTwo: state.treeDataTwo.concat(),
    }))
  }

  ...

  render() {
    return (
      <div>

        <SortableTree
          treeData={this.state.treeDataOne}
          dndType={'SAME_DND_TYPE'}
          dropCancelled={this.dropCancelled}
          props={...props}
        />
        <SortableTree
          treeData={this.state.treeDataTwo}
          dndType={'SAME_DND_TYPE'}
          dropCancelled={this.dropCancelled}
          props={...props}
        />
      </div>
    )
  }
}



```

The multi-tree drag and drop feature expects `SortableTree` to be imported via `SortableTreeWithoutDndContext`, as well as trees that are to interact should all also have the same `dndType` prop passed to them.

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

# This script will start a webpack dev server for the external nodes demo.
npm run external-nodes-demo

# Lints the code with eslint and my custom rules.
npm run lint

# Lints and builds the code, placing the result in the dist directory.
# This build is necessary to reflect changes if you're 
#  `npm link`-ed to this repository from another local project.
npm run build
```

Pull requests are welcome!

## License

MIT
