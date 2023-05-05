import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.sortableTree = null;
    this.state = {
      treeData: [
        {
          title:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Vivamus ac leo pretium faucibus. Morbi scelerisque luctus velit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nullam sit amet magna in magna gravida vehicula. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Nullam faucibus mi quis velit. Mauris elementum mauris vitae tortor. Pellentesque sapien. Sed convallis magna eu sem. Aliquam erat volutpat. Nullam faucibus mi quis velit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Fusce aliquam vestibulum ipsum. Donec ipsum massa, ullamcorper in, auctor et, scelerisque sed, est. Vivamus luctus egestas leo. ',
          expanded: true,
          children: [{ title: 'Egg' }],
        },
      ],
    };
  }

  updateDimensions = () => {
    if (this.sortableTree !== null) {
      this.sortableTree.recomputeRowHeights();
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  render() {
    return (
      <div style={{ height: 300 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          isDynamicRowHeight
          ref={sortableTree => {
            this.sortableTree = sortableTree;
          }}
        />
      </div>
    );
  }
}
