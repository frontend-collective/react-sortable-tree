import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        {
          title: 'Managers',
          expanded: true,
          children: [
            {
              title: 'Rob',
              children: [],
              isPerson: true,
            },
            {
              title: 'Joe',
              children: [],
              isPerson: true,
            },
          ],
        },
        {
          title: 'Clerks',
          expanded: true,
          children: [
            {
              title: 'Bertha',
              children: [],
              isPerson: true,
            },
            {
              title: 'Billy',
              children: [],
              isPerson: true,
            },
          ],
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <div style={{ height: 300 }}>
          <SortableTree
            treeData={this.state.treeData}
            canNodeHaveChildren={node => !node.isPerson}
            onChange={treeData => this.setState({ treeData })}
          />
        </div>
      </div>
    );
  }
}
