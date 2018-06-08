import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData1: [
        { title: 'node1', children: [{ title: 'Child node' }] },
        { title: 'node2' },
      ],
      treeData2: [{ title: 'node3' }, { title: 'node4' }],
      shouldCopyOnOutsideDrop: false,
    };
  }

  render() {
    // Both trees need to share this same node type in their
    // `dndType` prop
    const externalNodeType = 'yourNodeType';
    const { shouldCopyOnOutsideDrop } = this.state;
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
            shouldCopyOnOutsideDrop={shouldCopyOnOutsideDrop}
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
            shouldCopyOnOutsideDrop={shouldCopyOnOutsideDrop}
          />
        </div>

        <div style={{ clear: 'both' }} />

        <div>
          <label htmlFor="should-copy" style={{ fontSize: '0.8rem' }}>
            Enable node copy via <b>shouldCopyOnOutsideDrop</b>:
            <input
              type="checkbox"
              id="should-copy"
              value={shouldCopyOnOutsideDrop}
              onChange={event =>
                this.setState({
                  shouldCopyOnOutsideDrop: event.target.checked,
                })
              }
            />
          </label>
        </div>
      </div>
    );
  }
}

export default App;
