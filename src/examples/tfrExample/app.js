import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Freezer from 'freezer-js'

import SortableTree, { toggleExpandedForAll } from '../../index'
import styles from './stylesheets/app.scss'

import '../shared/favicon/apple-touch-icon.png'
import '../shared/favicon/favicon-16x16.png'
import '../shared/favicon/favicon-32x32.png'
import '../shared/favicon/favicon.ico'
import '../shared/favicon/safari-pinned-tab.svg'

/*

npm run start-tfr-example
localhost:3002

The parts of speech of English can be modeled using a tree, and SortableTree is thus
a great tool for doing the UI for the same. The purpose of this example is to demonstrate a variety of
UI and tree manipulation operations on a simplified piece of English.  More particularly, this
example will demonstrate:

1. The use of SortableTree with immutable data.  In this example I use freezer-js.

2. The ability to build the treeData for SortableTree programmatically.  In this example
I start with an empty treeData array and then add new nodes in response to UI events.

3. A slightly more advanced use of canDrop where the decision to drop is made based on
properties of the drop target and the node to drop.  For example, a noun can be dropped on a noun phrase
but not a verb phrase.

 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = new Freezer({
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: []
    },{live:true})

    // Listen to changes in the state
    this.state.on('update', ( currentState, prevState ) => {
      console.log( 'I was updated' )
      console.log(prevState)
      console.log(currentState)
    })

    this.updateTreeData = this.updateTreeData.bind(this)
    this.expandAll = this.expandAll.bind(this)
    this.collapseAll = this.collapseAll.bind(this)
    this.canDrop = this.canDrop.bind(this)
    this.updateSearchString = this.updateSearchString.bind(this)
    this.updateSearchStats = this.updateSearchStats.bind(this)
    this.updateSearchFocusIndex = this.updateSearchFocusIndex.bind(this)

    this.insertPOS = this.insertPOS.bind(this)
    this.insertAdj = this.insertAdj.bind(this)
    this.insertClause = this.insertClause.bind(this)
    this.insertNoun = this.insertNoun.bind(this)
    this.insertNP = this.insertNP.bind(this)
    this.insertVerb = this.insertVerb.bind(this)
    this.insertVP = this.insertVP.bind(this)
  }

  updateTreeData(treeData) {
    this.state.get().set('treeData',treeData)
    this.forceUpdate()
  }

  canDrop(nextParent, node) {

      if(nextParent) {
          if(nextParent.accept) {
              if(nextParent.accept.indexOf(node.type) >= 0 ) {
                  return true // the parent exists and it accepts this node.type
              }
          }
      } else return true // no parent. this means we're moving the node to the root level, but that's cool.

      return false
  }

  // Acutally, expand or collapse.
  expand(expanded) {
      this.state.get().set('treeData',toggleExpandedForAll({treeData: this.state.get().treeData, expanded}))
      this.forceUpdate()
  }

  expandAll() {this.expand(true)}
  collapseAll() {this.expand(false)}

  updateSearchString(newString) {
      this.state.get().set('searchString', newString)
      this.forceUpdate()
  }

  updateSearchStats(searchFoundCount, searchFocusIndex) {
    this.state.get().set('searchFoundCount', searchFoundCount)
    this.state.get().set('searchFocusIndex', searchFocusIndex)
    this.forceUpdate()
  }

  updateSearchFocusIndex(newSearchFocusIndex) {
    this.state.get().set('searchFocusIndex', newSearchFocusIndex)
    this.forceUpdate()
  }

  insertPOS(pos) {
    this.state.get().set('treeData',this.state.get().treeData.push(pos))
    this.forceUpdate()
  }

  // A nodeA can be dropped onto another nodeB if nodeB.accept contains nodeA.type
  insertAdj()    {this.insertPOS({title:'new adj', type:'Adj'})}
  insertClause() {this.insertPOS({title:'new clause', accept:['NP','VP']})}
  insertNoun()   {this.insertPOS({title:'new noun', type:'N'})}
  insertNP()     {this.insertPOS({title:'new noun phrase', type:'NP', accept:['N','Adj']})}
  insertVerb()   {this.insertPOS({title:'new verb',type:'V'})}
  insertVP()     {this.insertPOS({title:'new verb phrase', type:'VP', accept:['V']})}
    
  render() {
    const projectName = 'React Sortable Tree';
    const authorName = 'Chris Fritz';
    const authorUrl = 'https://github.com/fritz-c';
    const githubUrl = 'https://github.com/fritz-c/react-sortable-tree';

    const treeData = this.state.get().treeData
    const searchString = this.state.get().searchString
    const searchFocusIndex = this.state.get().searchFocusIndex
    const searchFoundCount = this.state.get().searchFoundCount
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

    const selectPrevMatch = () => {
      this.updateSearchFocusIndex(
        searchFocusIndex !== null ?
          (searchFoundCount + searchFocusIndex - 1) % searchFoundCount  :
          searchFoundCount - 1
      )
    }

    const selectNextMatch = () => {
      this.updateSearchFocusIndex(
        searchFocusIndex !== null ?
          (searchFocusIndex + 1) % searchFoundCount : 0
      )
    }

    const isVirtualized = true
    const treeContainerStyle = isVirtualized ? { height: 450 } : {}

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

          <button onClick={this.expandAll}>
            Expand All
          </button>

          <button onClick={this.collapseAll}>
            Collapse All
          </button>
          
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
                onChange={event => this.updateSearchString(event.target.value)}
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

          <div>
            <button onClick={this.insertClause}>New Clause</button>
            <button onClick={this.insertNP}>New Noun Phrase</button>
            <button onClick={this.insertVP}>New Verb Phrase</button>
            <button onClick={this.insertNoun}>New Noun</button>
            <button onClick={this.insertVerb}>New Verb</button>
            <button onClick={this.insertAdj}>New Adj</button>
          </div>

          <div style={treeContainerStyle}>
            <SortableTree
              treeData={treeData}
              onChange={this.updateTreeData}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              canDrag={({ node }) => !node.noDragging}
              canDrop={({ nextParent, node }) => this.canDrop(nextParent, node)}
              searchFinishCallback={matches => {
                this.updateSearchStats(
                  matches.length,
                  matches.length > 0 ?
                    searchFocusIndex % matches.length : 0
                  )
                }
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
              <a href={githubUrl}>{projectName}</a> is maintained by{' '}
              <a href={authorUrl}>{authorName}</a>.
            </span>

            <span className={styles['site-footer-credits']}>
              This page was generated by{' '}
              <a href="https://pages.github.com">GitHub Pages</a> using the{' '}
              <a href="https://github.com/jasonlong/cayman-theme">
                Cayman theme
              </a>{' '}
              by <a href="https://twitter.com/jasonlong">Jason Long</a>.
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
