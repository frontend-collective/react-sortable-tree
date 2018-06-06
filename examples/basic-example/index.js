import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import App from './app';

const rootEl = document.getElementById('app');
const wrap = dragDropContext(HTML5Backend);
const Wrapped = wrap(App);

ReactDOM.render(<Wrapped />, rootEl);
