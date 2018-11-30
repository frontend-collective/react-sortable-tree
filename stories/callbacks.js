import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        { title: 'A', expanded: true, children: [{ title: 'B' }] },
        { title: 'C' },
      ],
      lastMovePrevPath: null,
      lastMoveNextPath: null,
      lastMoveNode: null,
    };
  }

  render() {
    const { lastMovePrevPath, lastMoveNextPath, lastMoveNode } = this.state;

    const recordCall = (name, args) => {
      // eslint-disable-next-line no-console
      console.log(`${name} called with arguments:`, args);
    };

    return (
      <div>
        Open your console to see callback parameter info
        <div style={{ height: 300 }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            // Need to set getNodeKey to get meaningful ids in paths
            getNodeKey={({ node }) => `node${node.title}`}
            onVisibilityToggle={args => recordCall('onVisibilityToggle', args)}
            onMoveNode={args => {
              recordCall('onMoveNode', args);
              const { prevPath, nextPath, node } = args;
              this.setState({
                lastMovePrevPath: prevPath,
                lastMoveNextPath: nextPath,
                lastMoveNode: node,
              });
            }}
            onDragStateChanged={args => recordCall('onDragStateChanged', args)}
          />
        </div>
        {lastMoveNode && (
          <div>
            Node &quot;{lastMoveNode.title}&quot; moved from path [
            {lastMovePrevPath.join(',')}] to path [{lastMoveNextPath.join(',')}
            ].
          </div>
        )}
      </div>
    );
  }
}
