import React from 'react';
import SortableTree from '../../src/index';

import treeData from './treeData';

const maxDepth = 5;

const alertNodeInfo = ({ node, path, treeIndex }) => {
  const objectString = Object.keys(node)
    .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
    .join(',\n   ');

  alert(
    'Info passed to the button generator:\n\n' +
      `node: {\n   ${objectString}\n},\n` +
      `path: [${path.join(', ')}],\n` +
      `treeIndex: ${treeIndex}`
  );
};

export default App = () => {
  const {
    treeData,
    searchString,
    searchFocusIndex,
    searchFoundCount,
  } = this.state;

  return (
    <div className="wrapper">
      <div className="bar-wrapper">
        <button
          type="button"
          onClick={this.toggleNodeExpansion.bind(this, true)}
        >
          Expand all
        </button>
        <button
          type="button"
          className="collapse"
          onClick={this.toggleNodeExpansion.bind(this, false)}
        >
          Collapse all
        </button>
        <label>Search: </label>
        <input type="text" onChange={this.handleSearchOnChange} />
        <button
          type="button"
          className="previous"
          onClick={this.selectPrevMatch}
        >
          Previous
        </button>
        <button type="button" className="next" onClick={this.selectNextMatch}>
          Next
        </button>
        <label>
          {searchFocusIndex} / {searchFoundCount}
        </label>
      </div>
      <div className="tree-wrapper">
        <SortableTree
          treeData={treeData}
          onChange={this.handleTreeOnChange}
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
          isVirtualized
          generateNodeProps={rowInfo => ({
            buttons: [
              <button
                type="button"
                className="btn btn-outline-success"
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
    </div>
  );
};
