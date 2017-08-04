import React, { Component } from 'react';
import SortableTree from '../../src';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData1: [
        { title: 'node1', children: [{ title: 'Child node' }] },
        { title: 'node2' },
      ],
      treeData2: [{ title: 'node3' }, { title: 'node4' }],
    };
  }

  render() {
    // Both trees need to share this same node type in their
    // `dndType` prop
    const externalNodeType = 'yourNodeType';
    return (
      <div>
        <div
          style={{
            height: 350,
            width: 350,
            float: 'left',
            border: 'solid black 1px',
          }}
        >
          <SortableTree
            treeData={this.state.treeData1}
            onChange={treeData1 => this.setState({ treeData1 })}
            dndType={externalNodeType}
          />
        </div>

        <div
          style={{
            height: 350,
            width: 350,
            float: 'left',
            border: 'solid black 1px',
          }}
        >
          <SortableTree
            treeData={this.state.treeData2}
            onChange={treeData2 => this.setState({ treeData2 })}
            dndType={externalNodeType}
          />
        </div>

        <div style={{ clear: 'both' }} />
      </div>
    );
  }
}

export default App;
