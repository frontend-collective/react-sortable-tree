import React, { Component } from 'react';
import SortableTree from '../../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        { title: 'Chicken', expanded: true, children: [{ title: 'Egg' }] },
        {
          title: 'Spaceship',
          children: ({ done }) => {
            setTimeout(() => {
              done([
                { title: 'Orbiter' },
                { title: 'Main Engines' },
                { title: 'External Tank' },
                { title: 'Solid Rocket Boosters' },
              ]);
            }, 1000);
          },
        },
      ],
    };
  }

  render() {
    return (
      <div style={{ height: 300 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    );
  }
}
