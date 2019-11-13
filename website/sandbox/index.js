import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './styles.css';
import '../../src/react-sortable-tree.css';
import '../../src/node-renderer-default.css';
import '../../src/tree-node.css';

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
