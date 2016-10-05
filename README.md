# React Sortable Tree

[![tree200](https://cloud.githubusercontent.com/assets/4413963/18860410/26f64de8-84b8-11e6-9284-350308eed30a.png)](https://fritz-c.github.io/react-sortable-tree/)

__Note: This is a work in progress; most of the features are not yet implemented.__

[DEMO](https://fritz-c.github.io/react-sortable-tree/)

### Features

- Works right out of the box, but is highly customizable

## Example

```jsx
import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';

export default class Tree extends Component {
    constructor() {
        this.state = {
            treeData: { title: 'Chicken', children: [ { title: 'Egg' } ] },
        };
    }

    render() {
        return (
            <SortableTree
                treeData={treeData}
                onChange={treeData => this.setState({ treeData })}
            />
        );
    }
}

```

## Options

Property                  | Type           | Default             | Required | Description
:-------------------------|:--------------:|:-------------------:|:--------:|:----------------------------------------
treeData                  | object[]       |                     |   yes    | Tree data in the following format: `[{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]`.<br>`title` is the primary label for the node<br>`subtitle` is a secondary label for the node `expanded` shows children of the node if true, or hides them if false. Defaults to false.<br>`children` is an array of child nodes belonging to the node.
style                     | object         |                     |    {}    | Style applied to the container wrapping the tree (style defaults to {height: '100%'}) 
className                 | string         |                     |          | Class name for the container wrapping the tree 
innerStyle                | object         |                     |    {}    | Style applied to the inner, scrollable container (for padding, etc.) 
rowHeight                 | number or func | `62`                |          | Used by react-virtualized Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`
reactVirtualizedListProps | object         |                     |          | Custom properties to hand to the [react-virtualized list](https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types) 
scaffoldBlockPxWidth      | number         | `44`                |          | The width of the blocks containing the lines representing the structure of the tree. 
maxDepth                  | number         |                     |          | Maximum depth nodes can be inserted at. Defaults to infinite. 
searchMethod              | func           |                     |          | The method used to search nodes. Defaults to a function that uses the `searchQuery` string to search for nodes with matching `title` or `subtitle` values. NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.
searchQuery               | any            |                     |   null   | Used by the `searchMethod` to highlight and scroll to matched nodes. Should be a string for the default `searchMethod`, but can be anything when using a custom search. 
searchFocusOffset         | number         |                     |          | Outline the <`searchFocusOffset`>th node and scroll to it. 
searchFinishCallback      | func           |                     |          | Get the nodes that match the search criteria. Used for counting total matches, etc. 
generateNodeProps         | func           |                     |          | Generate an object with additional props to be passed to the node renderer. Use this for adding buttons via the `buttons` key, or additional `style` / `className` settings.
nodeContentRenderer       | any            | NodeRendererDefault |          | Override the default component for rendering nodes (but keep the scaffolding generator) This is an advanced option for complete customization of the appearance. It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
getNodeKey                | func           | defaultGetNodeKey   |          | Determine the unique key used to identify each node and generate the `path` array passed in callbacks. By default, returns the index in the tree (omitting hidden nodes).
onChange                  | func           |                     |   yes    | Called whenever tree data changed. Just like with React input elements, you have to update your own component's data to see the changes reflected.
onMoveNode                | func           |                     |          | Called after node move operation. 
onVisibilityToggle        | func           |                     |          | Called after children nodes collapsed or expanded. 

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
