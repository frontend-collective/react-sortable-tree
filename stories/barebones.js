import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        { title: 'Chicken',
        expanded: false,
        children: [
          { title: 'Egg' , expanded: false},
          { title: 'eggfry' , expanded: false},
          { title: 'Eggnog', expanded: false,
          children: [
            { title: 'liquid' , expanded: false},
            { title: 'juice' , expanded: false},
            { title: 'water' , expanded: false}
          ]},
          { title: 'lettuce' , expanded: false,
          children: [
            { title: 'liquid2' , expanded: false},
            { title: 'juic32e' , expanded: false},
            { title: 'wat123er' , expanded: false}
          ]},
          { title: 'greens' , expanded: false},
          { title: 'chick', expanded: false },
          { title: 'omlete', expanded: false },
          { title: 'yolo ' , expanded: false,
          children: [
            { title: 'liquidwater' , expanded: false},
            { title: 'juiceorgane' , expanded: false},
            { title: 'waterice' , expanded: false}
          ]},
          { title: 'watermelon', expanded: false },
          { title: 'apple0', expanded: false },
          { title: 'banana', expanded: false },
          { title: 'mango', expanded: false },
          { title: 'berry' , expanded: false},
          { title: 'fruit' , expanded: false},
          { title: 'muskmelon', expanded: false }
        ] },
        {title: 'hen'},
        {title: 'bird'},
        {title: 'ostrich'},
        {title: 'peacock'},
        {title: 'sparrow'},
        {title: 'brocolli'},
        {title: 'road '},
        {title: 'lane '},

        {title: 'river '},
        {title: 'lifeguard '},
        {title: 'mansion '},
        {title: 'boat '},

      ],
    };
  }

  render() {
    return (
      <div style={{ height: 600 }}>
        <SortableTree
          scaffoldBlockPxWidth = { 100 }
          treeData={this.state.treeData}
          isNodeDepthFixed = { false }
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    );
  }
}
