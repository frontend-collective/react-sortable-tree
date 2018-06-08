/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        {
          title: 'The file explorer theme',
          expanded: true,
          children: [
            {
              title: 'Imported from react-sortable-tree-theme-file-explorer',
              expanded: true,
              children: [
                {
                  title: (
                    <div>
                      Find it on{' '}
                      <a href="https://www.npmjs.com/package/react-sortable-tree-theme-file-explorer">
                        npm
                      </a>
                    </div>
                  ),
                },
              ],
            },
          ],
        },
        { title: 'More compact than the default' },
        {
          title: (
            <div>
              Simply set it to the <code>theme</code> prop and you&rsquo;re
              done!
            </div>
          ),
        },
      ],
    };
  }

  render() {
    return (
      <div style={{ height: 300 }}>
        <SortableTree
          theme={FileExplorerTheme}
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    );
  }
}
