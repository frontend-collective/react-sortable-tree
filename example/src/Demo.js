import React, { Component } from 'react';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import styles from './Demo.module.css';

const maxDepth = 5;

// const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

const alertNodeInfo = ({ node, path, treeIndex }) => {
  const objectString = Object.keys(node)
    .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
    .join(',\n   ');

  global.alert(
    'Info passed to the button generator:\n\n' +
      `node: {\n   ${objectString}\n},\n` +
      `path: [${path.join(', ')}],\n` +
      `treeIndex: ${treeIndex}`
  );
};

export default class Demo extends Component {
  constructor(props) {
    super(props);

    // this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.selectNextMatch = this.selectNextMatch.bind(this);
    this.selectPrevMatch = this.selectPrevMatch.bind(this);

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
    };
  }

  // updateTreeData(treeData) {
  //   this.setState({ treeData });
  // }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  selectPrevMatch() {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1,
    });
  }

  selectNextMatch() {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0,
    });
  }

  render() {
    const {
      // treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const { onChangeTreeData, treeData } = this.props;

    return (
      <div className={styles.demoWrapper}>
        <SortableTree
          treeData={treeData}
          // onChange={this.updateTreeData}
          onChange={onChangeTreeData}
          onMoveNode={({ node, treeIndex, path }) =>
            global.console.debug(
              'node:',
              node,
              'treeIndex:',
              treeIndex,
              'path:',
              path
            )
          }
          maxDepth={maxDepth}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          canDrag={({ node }) => !node.noDragging}
          canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
          searchFinishCallback={matches =>
            this.setState({
              searchFoundCount: matches.length,
              searchFocusIndex:
                matches.length > 0 ? searchFocusIndex % matches.length : 0,
            })
          }
          isVirtualized={true}
          generateNodeProps={rowInfo => ({
            buttons: [
              <button
                style={{
                  verticalAlign: 'middle',
                }}
                onClick={() => alertNodeInfo(rowInfo)}
              >
                ℹ
              </button>,
            ],
          })}
        />
      </div>
    );
  }
}
