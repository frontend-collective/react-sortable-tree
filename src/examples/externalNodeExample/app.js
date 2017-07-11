import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {
  SortableTreeWithoutDndContext as SortableTree,
  toggleExpandedForAll,
} from '../../index';
import styles from './stylesheets/app.scss';
import ExternalNode from './ExternalNode';
import { defaultGetNodeKey } from './../../utils/default-handlers';
import { insertNode } from './../../utils/tree-data-utils';

import '../shared/favicon/apple-touch-icon.png';
import '../shared/favicon/favicon-16x16.png';
import '../shared/favicon/favicon-32x32.png';
import '../shared/favicon/favicon.ico';
import '../shared/favicon/safari-pinned-tab.svg';

// example of external node objects
const newNodes = [
  { title: 'Just a title' },
  { title: 'Title with subtitle', subtitle: 'This is a subtitle' },
  { title: 'Another External Node', subtitle: 'another subtitle' },
];

const maxDepth = 5;

const App = DragDropContext(HTML5Backend)(
  class App extends Component {
    constructor(props) {
      super(props);

      this.state = {
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
        treeData: [
          {
            title: 'title1',
            subtitle: 'subtitle1',
          },
          {
            title: 'title2',
            subtitle: 'subtitle2',
          },
          {
            title: 'title3',
            subtitle: 'subtitle3',
          },
        ],
      };

      this.updateTreeData = this.updateTreeData.bind(this);
      this.expandAll = this.expandAll.bind(this);
      this.collapseAll = this.collapseAll.bind(this);
      this.addItem = this.addItem.bind(this);
      this.dropCancelled = this.dropCancelled.bind(this);
    }

    updateTreeData(treeData) {
      this.setState({ treeData });
    }

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

    addItem(newItem) {
      const { treeData } = insertNode({
        treeData: this.state.treeData,
        newNode: newItem.node,
        depth: newItem.depth,
        minimumTreeIndex: newItem.minimumTreeIndex,
        expandParent: true,
        getNodeKey: defaultGetNodeKey,
      });
      this.setState({ treeData });
    }

    dropCancelled() {
      // Update the tree appearance post-drag
      this.setState({
        treeData: this.state.treeData.concat(),
      });
    }

    render() {
      const projectName = 'React Sortable Tree - Adding External Nodes';
      const authorName = 'Chris Fritz';
      const authorUrl = 'https://github.com/fritz-c';
      const githubUrl = 'https://github.com/fritz-c/react-sortable-tree';

      const {
        treeData,
        searchString,
        searchFocusIndex,
        searchFoundCount,
      } = this.state;

      const alertNodeInfo = ({ node, path, treeIndex }) => {
        const objectString = Object.keys(node)
          .map(
            k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`)
          )
          .join(',\n   ');

        // eslint-disable-next-line no-alert
        alert(
          'Info passed to the button generator:\n\n' +
            `node: {\n   ${objectString}\n},\n` +
            `path: [${path.join(', ')}],\n` +
            `treeIndex: ${treeIndex}`
        );
      };

      const selectPrevMatch = () =>
        this.setState({
          searchFocusIndex:
            searchFocusIndex !== null
              ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
              : searchFoundCount - 1,
        });

      const selectNextMatch = () =>
        this.setState({
          searchFocusIndex:
            searchFocusIndex !== null
              ? (searchFocusIndex + 1) % searchFoundCount
              : 0,
        });

      const isVirtualized = true;
      const treeContainerStyle = isVirtualized
        ? { height: 450, width: 675, padding: 10 }
        : {};

      return (
        <div>
          <section className={styles['page-header']}>
            <h1 className={styles['project-name']}>
              {projectName}
            </h1>

            <h2 className={styles['project-tagline']}>
              Drag-and-drop sortable representation of hierarchical data
            </h2>
          </section>

          <section className={styles['main-content']}>
            <h3>External Nodes Demo</h3>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }}>
                <button onClick={this.expandAll}>Expand All</button>
                <button onClick={this.collapseAll}>Collapse All</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                        this.setState({ searchString: event.target.value })}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={!searchFoundCount}
                    onClick={selectPrevMatch}
                  >
                    &lt;
                  </button>
                  <button
                    type="submit"
                    disabled={!searchFoundCount}
                    onClick={selectNextMatch}
                  >
                    &gt;
                  </button>
                  <span>
                    &nbsp;
                    {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                    &nbsp;/&nbsp;
                    {searchFoundCount || 0}
                  </span>
                </form>
                <div style={treeContainerStyle}>
                  <SortableTree
                    treeData={treeData}
                    dndType="NEW_NODE"
                    onChange={this.updateTreeData}
                    onMoveNode={({ node, treeIndex, path }) =>
                      // eslint-disable-next-line no-console
                      console.debug(
                        'node:',
                        node,
                        'treeIndex:',
                        treeIndex,
                        'path:',
                        path
                      )}
                    maxDepth={maxDepth}
                    searchQuery={searchString}
                    searchFocusOffset={searchFocusIndex}
                    canDrag={({ node }) => !node.noDragging}
                    canDrop={({ nextParent }) =>
                      !nextParent || !nextParent.noChildren}
                    searchFinishCallback={matches =>
                      this.setState({
                        searchFoundCount: matches.length,
                        searchFocusIndex:
                          matches.length > 0
                            ? searchFocusIndex % matches.length
                            : 0,
                      })}
                    isVirtualized={isVirtualized}
                    generateNodeProps={rowInfo => ({
                      buttons: [
                        <button
                          style={{ verticalAlign: 'middle' }}
                          onClick={() => alertNodeInfo(rowInfo)}
                        >
                          ℹ
                        </button>,
                      ],
                    })}
                  />
                </div>
                <a href={githubUrl}>Documentation on Github</a>
                <footer className={styles['site-footer']}>
                  <span className={styles['site-footer-owner']}>
                    <a href={githubUrl}>{projectName}</a> is maintained by{' '}
                    <a href={authorUrl}>{authorName}</a>.
                  </span>
                  <span className={styles['site-footer-credits']}>
                    This page was generated by{' '}
                    <a href="https://pages.github.com">GitHub Pages</a> using
                    the{' '}
                    <a href="https://github.com/jasonlong/cayman-theme">
                      Cayman theme
                    </a>{' '}
                    by <a href="https://twitter.com/jasonlong">Jason Long</a>.
                  </span>
                </footer>
              </div>
              <div style={{ padding: 10, flexGrow: 1 }}>
                <p>Drag nodes below into the tree and drop to add.</p>
                <div className={styles['external-node-container']}>
                  {newNodes.map((node, index) =>
                    <ExternalNode
                      key={`externalNode-${index + 1}`}
                      node={node}
                      addNewItem={this.addItem}
                      dropCancelled={this.dropCancelled}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
          <a href={githubUrl}>
            <img
              style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
              src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
              alt="Fork me on GitHub"
              data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            />
          </a>
        </div>
      );
    }
  }
);

ReactDOM.render(<App />, document.getElementById('app'));
