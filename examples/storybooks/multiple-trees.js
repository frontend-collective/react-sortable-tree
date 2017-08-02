import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {
  SortableTreeWithoutDndContext as SortableTree,
} from '../../src';

class App extends Component {
  constructor(props) {
    super(props);

    this.dropCancelled = this.dropCancelled.bind(this)

    this.state = {
      treeDataOne: [
        { 
          title: 'node1', 
          subtitle: 'treeOne', 
          expanded: true,
          children: [
            { 
              title: 'child1', 
              subtitle: 'treeOne'
            }
          ] 
        }, 
        { 
          title: 'node2', 
          subtitle: 'treeOne' 
        }
      ],
      treeDataTwo: [
        { 
          title: 'node1', 
          subtitle: 'treeTwo',
          expanded: true,
          children: [
            { 
              title: 'child1', 
              subtitle: 'treeTwo'
            }
          ] 
        }, 
        { 
          title: 'node2', 
          subtitle: 'treeTwo' 
        }
      ],
    };
  }

  dropCancelled () {
    // cancels drop event for ALL trees if no current valid dropTargets
    // this is nothing more than the typical onChange prop you'd normally give an RST tree,
    // but is designed for all trees that can interact, meaning multiple trees with the same
    // dndType prop
    this.setState(state => ({
      treeDataOne: state.treeDataOne.concat(),
      treeDataTwo: state.treeDataTwo.concat(),
    }))
  }


  render() {
    return (
      <div>
        <div style={{ height: 250, borderBottom: '1px solid black ' }}>
          <SortableTree
            treeData={this.state.treeDataOne}
            onChange={treeDataOne => this.setState({ treeDataOne })}
            dndType={'SAME_DND_TYPE'}
            // single new prop for multi-trees feature         
            dropCancelled={this.dropCancelled}  
          />
        </div>
        <div style={{ height: 250 }}>
          <SortableTree
            treeData={this.state.treeDataTwo}
            onChange={treeDataTwo => this.setState({ treeDataTwo })}
            dndType={'SAME_DND_TYPE'}
            // single new prop for multi-trees feature
            dropCancelled={this.dropCancelled}
          />
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
