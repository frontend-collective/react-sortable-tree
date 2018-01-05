import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const rootEl = document.getElementById('app');
const render = Component => {
  const wrap = dragDropContext(HTML5Backend);
  const Wrapped = wrap(Component);
  ReactDOM.render(
    <AppContainer>
      <Wrapped />
    </AppContainer>,
    rootEl
  );
};

/* eslint-disable global-require, import/newline-after-import */
render(require('./app').default);
if (module.hot)
  module.hot.accept('./app', () => render(require('./app').default));
/* eslint-enable global-require, import/newline-after-import */
