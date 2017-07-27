import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies

const rootEl = document.getElementById('app');
const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );
};

/* eslint-disable global-require, import/newline-after-import */
render(require('./app').default);
if (module.hot)
  module.hot.accept('./app', () => render(require('./app').default));
/* eslint-enable global-require, import/newline-after-import */
