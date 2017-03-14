import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext, DragSource} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree, toggleExpandedForAll } from '../../index';
import styles from './stylesheets/app.scss';
import '../shared/favicon/apple-touch-icon.png';
import '../shared/favicon/favicon-16x16.png';
import '../shared/favicon/favicon-32x32.png';
import '../shared/favicon/favicon.ico';
import '../shared/favicon/safari-pinned-tab.svg';

const dragSource = {
  beginDrag(props) {
    return {node: {...props.node}, path: []}
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const Node = DragSource('NEW_NODE', dragSource, collect)(
class Node extends Component {
    render () {
        const {connectDragSource} = this.props

        return connectDragSource(
            <span className={styles['new-node']}>{this.props.node.title}</span>
        )
    }
})

const newNodes = [
    {title: 'Just title'},
    {title: 'Title with subtitle', subtitle: 'This is subtitle'},
]

const maxDepth = 5;

const App = DragDropContext(HTML5Backend)(
class App extends Component {
    constructor(props) {
        super(props);

        const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

        this.state = {
            searchString: '',
            searchFocusIndex: 0,
            searchFoundCount: null,
            treeData: [
                {
                    title: '`title`',
                    subtitle: '`subtitle`',
                    expanded: true,
                    children: [
                        {
                            title: 'Child Node',
                            subtitle: 'Defined in `children` array belonging to parent',
                        },
                        {
                            title: 'Nested structure is rendered virtually',
                            subtitle: (
                                <span>
                                    The tree uses&nbsp;
                                    <a href="https://github.com/bvaughn/react-virtualized">
                                        react-virtualized
                                    </a>
                                    &nbsp;and the relationship lines are more of a visual trick.
                                </span>
                            ),
                        },
                    ],
                },
                {
                    expanded: true,
                    title: 'Any node can be the parent or child of any other node',
                    children: [
                        {
                            expanded: true,
                            title: 'Chicken',
                            children: [
                                { title: 'Egg' },
                            ],
                        },
                    ],
                },
                {
                    title: 'Button(s) can be added to the node',
                    subtitle: 'Node info is passed when generating so you can use it in your onClick handler',
                },
                {
                    title: 'Show node children by setting `expanded`',
                    subtitle: ({ node }) => `expanded: ${node.expanded ? 'true' : 'false'}`,
                    children: [
                        {
                            title: 'Bruce',
                            subtitle: ({ node }) => `expanded: ${node.expanded ? 'true' : 'false'}`,
                            children: [
                                { title: 'Bruce Jr.' },
                                { title: 'Brucette' },
                            ],
                        },
                    ],
                },
                {
                    title: 'Advanced',
                    subtitle: 'Settings, behavior, etc.',
                    children: [
                        {
                            title: (
                                <div>
                                    <div
                                        style={{
                                            backgroundColor: 'gray',
                                            display: 'inline-block',
                                            borderRadius: 10,
                                            color: '#FFF',
                                            padding: '0 5px',
                                        }}
                                    >
                                        Any Component
                                    </div>

                                    &nbsp;can be used for `title`
                                </div>
                            ),
                        },
                        {
                            expanded: true,
                            title: 'Limit nesting with `maxDepth`',
                            subtitle: `It's set to ${maxDepth} for this example`,
                            children: [
                                {
                                    expanded: true,
                                    title: renderDepthTitle,
                                    children: [
                                        {
                                            expanded: true,
                                            title: renderDepthTitle,
                                            children: [
                                                { title: renderDepthTitle },
                                                {
                                                    title: ({ path }) => (path.length >= maxDepth ?
                                                        'This cannot be dragged deeper' :
                                                        'This can be dragged deeper'
                                                    ),
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            title: 'When node contents are really long, it will cause a horizontal scrollbar' +
                                ' to appear. Deeply nested elements will also trigger the scrollbar.',
                        },
                    ],
                },
            ],
        };

        this.updateTreeData = this.updateTreeData.bind(this);
        this.expandAll = this.expandAll.bind(this);
        this.collapseAll = this.collapseAll.bind(this);
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

    render() {
        const projectName = 'React Sortable Tree';
        const authorName = 'Chris Fritz';
        const authorUrl = 'https://github.com/fritz-c';
        const githubUrl = 'https://github.com/fritz-c/react-sortable-tree';

        const {
            treeData,
            searchString,
            searchFocusIndex,
            searchFoundCount,
        } = this.state;

        const alertNodeInfo = ({
            node,
            path,
            treeIndex,
            lowerSiblingCounts: _lowerSiblingCounts,
        }) => {
            const objectString = Object.keys(node)
                .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
                .join(',\n   ');

            alert( // eslint-disable-line no-alert
                'Info passed to the button generator:\n\n' +
                `node: {\n   ${objectString}\n},\n` +
                `path: [${path.join(', ')}],\n` +
                `treeIndex: ${treeIndex}`
            );
        };

        const selectPrevMatch = () => this.setState({
            searchFocusIndex: searchFocusIndex !== null ?
                ((searchFoundCount + searchFocusIndex - 1) % searchFoundCount) :
                searchFoundCount - 1,
        });

        const selectNextMatch = () => this.setState({
            searchFocusIndex: searchFocusIndex !== null ?
                ((searchFocusIndex + 1) % searchFoundCount) :
                0,
        });

        const isVirtualized = true;
        const treeContainerStyle = isVirtualized ? { height: 450 } : {};

        return (
            <div>
                <section className={styles['page-header']}>
                    <h1 className={styles['project-name']}>{projectName}</h1>

                    <h2 className={styles['project-tagline']}>
                        Drag-and-drop sortable representation of hierarchical data
                    </h2>
                </section>

                <section className={styles['main-content']}>
                    <h3>Demo</h3>

                    <p>Drag below nodes into the tree to insert.</p>

                    <div>
                        {newNodes.map((node, index) =>
                            <Node key={index} node={node} />
                        )}
                    </div>

                    <button onClick={this.expandAll}>
                        Expand All
                    </button>

                    <button onClick={this.collapseAll}>
                        Collapse All
                    </button>

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <form
                        style={{ display: 'inline-block' }}
                        onSubmit={(event) => {
                            event.preventDefault();
                        }}
                    >
                        <label htmlFor="find-box">
                            Search:&nbsp;

                            <input
                                id="find-box"
                                type="text"
                                value={searchString}
                                onChange={event => this.setState({ searchString: event.target.value })}
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
                            {searchFoundCount > 0 ? (searchFocusIndex + 1) : 0}
                            &nbsp;/&nbsp;
                            {searchFoundCount || 0}
                        </span>
                    </form>

                    <div style={treeContainerStyle}>
                        <SortableTree
                            treeData={treeData}
                            dndDropTypes={['NEW_NODE']}
                            onChange={this.updateTreeData}
                            onMoveNode={({ node, treeIndex, path }) =>
                                console.debug( // eslint-disable-line no-console
                                    'node:', node,
                                    'treeIndex:', treeIndex,
                                    'path:', path,
                                )
                            }
                            maxDepth={maxDepth}
                            searchQuery={searchString}
                            searchFocusOffset={searchFocusIndex}
                            searchFinishCallback={matches =>
                                this.setState({
                                    searchFoundCount: matches.length,
                                    searchFocusIndex: matches.length > 0 ? searchFocusIndex % matches.length : 0,
                                })
                            }
                            isVirtualized={isVirtualized}
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

                    <a href={githubUrl}>Documentation on Github</a>

                    <footer className={styles['site-footer']}>
                        <span className={styles['site-footer-owner']}>
                            <a href={githubUrl}>{projectName}</a> is maintained by <a href={authorUrl}>{authorName}</a>.
                        </span>

                        <span className={styles['site-footer-credits']}>
                            This page was generated by <a href="https://pages.github.com">GitHub Pages</a> using the <a href="https://github.com/jasonlong/cayman-theme">Cayman theme</a> by <a href="https://twitter.com/jasonlong">Jason Long</a>.
                        </span>
                    </footer>
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
})

ReactDOM.render(<App />, document.getElementById('app'));
