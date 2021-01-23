import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    const iconSize = 32;

    this.state = {
      treeData: [
        {
          title: 'Homer Simpson',
          icon: `https://icons.iconarchive.com/icons/jonathan-rey/simpsons/${iconSize}/Homer-Simpson-04-Happy-icon.png`,
          expanded: true,
          children: [
            {
              title: 'Bart Simpson',
              icon: `https://icons.iconarchive.com/icons/jonathan-rey/simpsons/${iconSize}/Bart-Simpson-01-icon.png`
            },
            {
              title: 'Lisa Simpson',
              icon: `https://icons.iconarchive.com/icons/jonathan-rey/simpsons/${iconSize}/Lisa-Simpson-icon.png`
            },
            {
              title: 'Maggie Simpson',
              icon: `https://icons.iconarchive.com/icons/jonathan-rey/simpsons/${iconSize}/Maggie-Simpson-icon.png`
            }
          ]
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
