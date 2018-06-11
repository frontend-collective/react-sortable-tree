import React, { Component, Fragment } from 'react';
import SplitPane from 'react-split-pane';
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
  }

  componentDidMount() {
    if (this._editor) {
      this._editor.set(treeData);
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

  render() {
    const { treeData } = this.state;

    return (
      <Fragment>
        <Title />
        <SplitPane split="vertical" defaultSize={700}>
          <Demo onChangeTreeData={this.onChangeTreeData} treeData={treeData} />
          <Editor onChange={this.getNewTreeData} editorRef={this.editorRef} />
        </SplitPane>
      </Fragment>
    );
  }
}

export default App;
