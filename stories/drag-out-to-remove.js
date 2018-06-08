/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree } from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

// -------------------------
// Create an drop target component that can receive the nodes
// https://react-dnd.github.io/react-dnd/docs-drop-target.html
// -------------------------
// This type must be assigned to the tree via the `dndType` prop as well
const trashAreaType = 'yourNodeType';
const trashAreaSpec = {
  // The endDrag handler on the tree source will use some of the properties of
  // the source, like node, treeIndex, and path to determine where it was before.
  // The treeId must be changed, or it interprets it as dropping within itself.
  drop: (props, monitor) => ({ ...monitor.getItem(), treeId: 'trash' }),
};
const trashAreaCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
});

// The component will sit around the tree component and catch
// nodes dragged out
class trashAreaBaseComponent extends Component {
  render() {
    const { connectDropTarget, children, isOver } = this.props;

    return connectDropTarget(
      <div
        style={{
          height: '100vh',
          padding: 50,
          background: isOver ? 'pink' : 'transparent',
        }}
      >
        {children}
      </div>
    );
  }
}
trashAreaBaseComponent.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  isOver: PropTypes.bool.isRequired,
};
const TrashAreaComponent = DropTarget(
  trashAreaType,
  trashAreaSpec,
  trashAreaCollect
)(trashAreaBaseComponent);

class UnwrappedApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        { title: '1' },
        { title: '2' },
        { title: '3' },
        { title: '4', expanded: true, children: [{ title: '5' }] },
      ],
    };
  }

  render() {
    return (
      <div>
        <TrashAreaComponent>
          <div style={{ height: 250 }}>
            <SortableTree
              treeData={this.state.treeData}
              onChange={treeData => this.setState({ treeData })}
              dndType={trashAreaType}
            />
          </div>
        </TrashAreaComponent>
      </div>
    );
  }
}

const App = DragDropContext(HTML5Backend)(UnwrappedApp);
export default App;
