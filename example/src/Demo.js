import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import styles from './Demo.module.css';

const maxDepth = 5;

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

    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.selectNextMatch = this.selectNextMatch.bind(this);
    this.selectPrevMatch = this.selectPrevMatch.bind(this);

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { treeData: nextProps.treeData };
  }

  expandAll() {
    this.props.expand(true);
  }

  collapseAll() {
    this.props.expand(false);
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
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const { onChangeTreeData } = this.props;

    return (
      <div className={styles.demoWrapper}>
        <div className={styles.buttons}>
          <div>
            <button className="btn btn-primary" onClick={this.expandAll}>
              Expand All
            </button>
            <button className="btn btn-warning" onClick={this.collapseAll}>
              Collapse All
            </button>
          </div>
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })
                }
              />
            </label>

            <button
              className="btn btn-info"
              type="button"
              disabled={!searchFoundCount}
              onClick={this.selectPrevMatch}
            >
              &lt;
            </button>

            <button
              className="btn btn-info"
              type="submit"
              disabled={!searchFoundCount}
              onClick={this.selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              {' / '}
              {searchFoundCount || 0}
            </span>
          </form>
        </div>
        <div className={styles.treeWrapper}>
          <SortableTree
            treeData={treeData}
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
  }
}
