import React, { Component } from 'react';
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
} from '../../src';

const initialData = [
  { id: '1', name: 'N1', parent: null },
  { id: '2', name: 'N2', parent: null },
  { id: '3', name: 'N3', parent: 2 },
  { id: '4', name: 'N4', parent: 3 },
];

const getNodeKey = ({ node }) => node.id;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: getTreeFromFlatData({
        flatData: initialData.map(node => ({ ...node, title: node.name })),
        getKey: node => node.id,
        getParentKey: node => node.parent,
        rootKey: null,
      }),
    };
  }

  render() {
    const flatData = getFlatDataFromTree({
      treeData: this.state.treeData,
      getNodeKey,
      ignoreCollapsed: false,
    }).map(({ node, path }) => ({
      id: node.id,
      name: node.name,
      parent: path.length > 1 ? path[path.length - 2] : null,
    }));

    return (
      <div>
        ↓treeData for this tree was generated from flat data similar to DB rows↓
        <div style={{ height: 250 }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            getNodeKey={getNodeKey}
          />
        </div>
        <hr />
        ↓This flat data is generated from the modified tree data↓
        <ul>
          {flatData.map(({ id, name, parent }) =>
            <li key={id}>
              id: {id}, name: {name}, parent: {parent || 'null'}
            </li>
          )}
        </ul>
      </div>
    );
  }
}
