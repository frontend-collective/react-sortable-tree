import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import '../style.css';

class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <div className="navigation-wrapper">
          <a
            className="title"
            href="https://github.com/frontend-collective/react-sortable-tree"
            taget="_blank"
          >
            React Sortable Tree
          </a>
          <a
            className="github-button"
            href="https://github.com/frontend-collective/react-sortable-tree"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star frontend-collective/react-sortable-tree on GitHub"
          >
            Star
          </a>
          <a className="link" href="./storybook" target="_blank">
            View Storybook
          </a>
        </div>
        <div className="description">
          Drag-and-drop sortable component for nested data and hierarchies
        </div>
        <iframe
          src="https://codesandbox.io/embed/github/frontend-collective/react-sortable-tree/tree/master/website/sandbox?odemirror=1&view=preview"
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        />
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
