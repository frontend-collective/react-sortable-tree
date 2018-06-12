import React, { Component, Fragment } from 'react';
import SplitPane from 'react-split-pane';
import { toggleExpandedForAll } from 'react-sortable-tree';
import Demo from './Demo';
import Editor from './Editor';
import Title from './Title';

import treeData from './defaultTreeData';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData,
    };

    this.onChangeTreeData = this.onChangeTreeData.bind(this);
    this.getNewTreeData = this.getNewTreeData.bind(this);
    this.editorRef = this.editorRef.bind(this);
    this.expand = this.expand.bind(this);
  }

  componentDidMount() {
    if (this._editor) {
      this._editor.set(treeData);
      this._editor.expandAll();
    }
  }

  onChangeTreeData(treeData) {
    if (this._editor) {
      this._editor.set(treeData);
      this.setState({
        treeData,
      });
    }
  }

  getNewTreeData() {
    if (this._editor) {
      this.setState({
        treeData: this._editor.get(),
      });
    }
  }

  editorRef(editor) {
    this._editor = editor;
  }

  expand(expanded) {
    const newTreeData = toggleExpandedForAll({
      treeData: this.state.treeData,
      expanded,
    });

    this._editor.set(newTreeData);

    this.setState({
      treeData: newTreeData,
    });
  }

  render() {
    const { treeData } = this.state;

    return (
      <Fragment>
        <Title />
        <SplitPane split="vertical" defaultSize="50%">
          <Demo
            onChangeTreeData={this.onChangeTreeData}
            treeData={treeData}
            expand={this.expand}
          />
          {/* <SplitPane split="horizontal" defaultSize="25%">
            <div /> */}
          <Editor onChange={this.getNewTreeData} editorRef={this.editorRef} />
          {/* </SplitPane> */}
        </SplitPane>
      </Fragment>
    );
  }
}

export default App;
