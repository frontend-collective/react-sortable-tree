import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SortableTree from '../../index';
import styles from './stylesheets/app.scss';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: [
                {
                    id: 'b12314',
                    title: 'Beast Man',
                    subtitle: 'Pancakes',
                    expanded: true,
                    children: [
                        {
                            id: 1,
                            title: 'Joe',
                            subtitle: 'Pancakes',
                            children: [], // null or undefined also ok
                        },
                        {
                            title: 2,
                        },
                        {
                            title: 2,
                            children: ({ done }) => { // Allow for lazy loading of children
                                setTimeout(() => {
                                    done([
                                        {
                                            key: 1215,
                                            title: 5,
                                        },
                                        {
                                            key: 2125,
                                            title: 215,
                                        },
                                    ]);
                                }, 2000);
                            },
                        },
                    ],
                },
                {
                    id: 'b12315',
                    title: 'Frank',
                },
                {
                    id: 'b12316',
                    title: 'Really Long Name Nicholas Who Always Got' +
                        ' Picked on in School For His Really Long Name',
                    subtitle: 'Really good icebreaker, though',
                    children: [
                        {
                            title: 'Bruce',
                            children: [
                                { title: 'Bruce Jr.' },
                                { title: 'Brucette Jr.' },
                            ],
                        },
                        {
                            title: 'Trevor',
                            children: [
                                { title: 'Trevor Jr.' },
                                { title: 'Trevor Jr. 2' },
                            ],
                        },
                    ],
                },
                {
                    id: 'b12336',
                    title: 'Tracy Page',
                    subtitle: 'Waffles',
                },
            ],
        };

        this.updateTreeData = this.updateTreeData.bind(this);
    }

    updateTreeData(treeData) {
        this.setState({ treeData });
    }

    render() {
        const projectName = 'React Sortable Tree';
        const authorName = 'Chris Fritz';
        const authorUrl = 'https://github.com/fritz-c';
        const githubUrl = 'https://github.com/fritz-c/react-sortable-tree';

        return (
            <div>
                <section className={styles['page-header']}>
                    <h1 className={styles['project-name']}>{projectName}</h1>

                    <h2 className={styles['project-tagline']}>
                        Drag-and-drop sortable representation of hierarchical data
                    </h2>
                </section>

                <section className={styles['main-content']}>
                    <span style={{ color: 'firebrick' }}>
                        Note: This is a work in progress; most of the features are not yet implemented.
                    </span>
                    <h3>Demo</h3>

                    <div style={{ height: 385 }}>
                        <SortableTree
                            treeData={this.state.treeData}
                            updateTreeData={this.updateTreeData}
                            generateNodeProps={({
                                node:               _node,
                                path:               _path,
                                lowerSiblingCounts: _lowerSiblingCounts,
                                listIndex:          _listIndex,
                            }) => ({
                                buttons: [
                                    <button>＋</button>,
                                    <button>ℹ</button>,
                                ],
                            })}
                        />
                    </div>

                    <h3>Features</h3>
                    <ul>
                        <li>Works right out of the box, but is highly customizable</li>
                        <li>No external CSS</li>
                    </ul>

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
}

ReactDOM.render(<App />, document.getElementById('app'));
