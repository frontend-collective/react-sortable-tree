# React Sortable Tree

[![NPM](https://nodei.co/npm/react-sortable-tree.png)](https://npmjs.org/package/react-sortable-tree)

[![tree200](https://cloud.githubusercontent.com/assets/4413963/18860410/26f64de8-84b8-11e6-9284-350308eed30a.png)](https://fritz-c.github.io/react-sortable-tree/)

### [Demo](https://fritz-c.github.io/react-sortable-tree/)
[![demo](https://cloud.githubusercontent.com/assets/4413963/19334888/2be8261c-913a-11e6-9508-4b347ae114b4.gif)](https://fritz-c.github.io/react-sortable-tree/)

### Features

- Works right out of the box, but is highly customizable

## Example

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

## Options

Property                  | Type           | Default             | Required | Description
:-------------------------|:--------------:|:-------------------:|:--------:|:----------------------------------------
treeData                  | object[]       |                     |   yes    | Tree data with the following keys: <div>`title` is the primary label for the node.</div><div>`subtitle` is a secondary label for the node.</div><div>`expanded` shows children of the node if true, or hides them if false. Defaults to false.</div><div>`canHaveChildren` can be used to prevent a node from having children while being sorted using drag/drop. Defaults to true.</div><div>`alwaysAtRootLevel` can be used to prevent a node from being a child to a parent node while being sorted using drag/drop. Defaults to false.</div><div>`children` is an array of child nodes belonging to the node.</div><div>__Example__: `[{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]`
onChange                  | func           |                     |   yes    | Called whenever tree data changed. Just like with React input elements, you have to update your own component's data to see the changes reflected.<div>`( treeData: object[] ): void`</div>
style                     | object         | `{}`                |          | Style applied to the container wrapping the tree (style defaults to {height: '100%'})
className                 | string         |                     |          | Class name for the container wrapping the tree
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
reactVirtualizedListProps | object         |                     |          | Custom properties to hand to the [react-virtualized list](https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types)
rowHeight                 | number or func | `62`                |          | Used by react-virtualized. Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`
slideRegionSize           | number         | `100`               |          | Size in px of the region near the edges that initiates scrolling on dragover.
scaffoldBlockPxWidth      | number         | `44`                |          | The width of the blocks containing the lines representing the structure of the tree.
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
- __`map`__: Perform a change on every node in the tree
- __`walk`__: Visit every node in the tree in order

Documentation for each method is only available in the code at this time.
If your hobbies happen to include writing documentation, by all means submit a pull request. It would really help out.

## Browser Compatibility

| Browser | Works? |
|:-----|:-----|
| Chrome | Yes |
| Firefox | Yes |
| Safari | Yes |
| IE >= 10 | Yes |
| IE 9 | Broken due to flexbox issues. [Plan to fix.](https://github.com/fritz-c/react-sortable-tree/issues/6)  |

## Contributing

After cloning the repository and running `npm install` inside, you can use the following commands to develop and build the project.

```sh
# Starts a webpack dev server that hosts a demo page with the component.
# It uses react-hot-loader so changes are reflected on save.
npm start

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
