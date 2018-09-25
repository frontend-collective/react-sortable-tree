import React, { Component } from 'react';
import SortableTree, { changeNodeAtPath } from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [{
        name: 'Managers',
        expanded: true,
        children: [{
          name: 'Rob',
          children: [],
          hasNoChildren: true
        }, {
          name: 'Joe',
          children: [],
          hasNoChildren: true
        }]
      }, {
        name: 'Clerks',
        expanded: true,
        children: [{
          name: 'Bertha',
          children: [],
          hasNoChildren: true
        }, {
          name: 'Billy',
          children: [],
          hasNoChildren: true
        }]
      }],
    };
  }

  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;
    return (
      <div>
        <div style={{ height: 300 }}>
          <SortableTree
            treeData={this.state.treeData}
            canNodeHaveChildren={node => !node.hasNoChildren}
            onChange={treeData => this.setState({ treeData })}
            generateNodeProps={({ node, path }) => ({
              title: (
                <input
                  style={{ fontSize: '1.1rem' }}
                  value={node.name}
                  onChange={event => {
                    const name = event.target.value;

                    this.setState(state => ({
                      treeData: changeNodeAtPath({
                        treeData: state.treeData,
                        path,
                        getNodeKey,
                        newNode: { ...node, name },
                      }),
                    }));
                  }}
                />
              ),
            })}
          />
        </div>
      </div>
    );
  }
}
