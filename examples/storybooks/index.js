/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import AddRemoveExample from './add-remove';
import BarebonesExample from './barebones';
import CallbacksExample from './callbacks';
import CanDropExample from './can-drop';
import DragOutToRemoveExample from './drag-out-to-remove';
import ExternalNodeExample from './external-node';
import GenerateNodePropsExample from './generate-node-props';
import ModifyNodesExample from './modify-nodes';
import SearchExample from './search';
import ThemesExample from './themes';
import TouchSupportExample from './touch-support';
import TreeDataIOExample from './tree-data-io';
import TreeToTreeExample from './tree-to-tree';
import styles from './generic.scss';

// parameters
import { getParameters } from 'codesandbox/lib/api/define';

const GIT_URL =
  'https://api.github.com/repos/fritz-c/react-sortable-tree/contents/';

// full url for github api call
const getURL = file => `${GIT_URL}/examples/storybooks/${file}`;

// strip ../../src from the src
const strip = code => code.replace('../../src', 'react-sortable-tree');

const handleClick = file => event => {
  event.preventDefault();
  const url = getURL(file);
  fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      const stripped = strip(atob(response.content));
      const payload = getPayload(stripped);
      console.log(payload);
    });
};

const getPayload = example => {
  const index = `
import React from 'react';
import { render } from 'react-dom';
import App from './example';

render(<App />, document.getElementById('root'));
`;

  const html = `<div id="root"></div>`;
  return getParameters({
    files: {
      'package.json': {
        content: {
          dependencies: {
            react: 'latest',
            'react-dom': 'latest',
            'prop-types': 'latest',
            'react-dnd': 'latest',
            'react-dnd-html5-backend': 'latest',
            'react-sortable-tree-theme-file-explorer': 'latest',
            'react-dnd-touch-backend': 'latest',
          },
        },
      },
      'index.js': {
        content: index,
      },
      'example.js': {
        content: example,
      },
      'index.html': {
        content: html,
      },
    },
  });
};

const wrapWithSource = (node, src) => (
  <div>
    {node}

    <br />
    <a
      href="#"
      target="_top"
      rel="noopener noreferrer"
      className={styles.sandboxLink}
      onClick={handleClick(src)}
    >
      VIEW SANDBOX →
    </a>
    <a
      href={`https://github.com/fritz-c/react-sortable-tree/blob/master/examples/storybooks/${src}`}
      target="_top"
      rel="noopener noreferrer"
      className={styles.sourceLink}
    >
      VIEW SOURCE →
    </a>
  </div>
);

storiesOf('Basics', module)
  .add('Minimal implementation', () =>
    wrapWithSource(<BarebonesExample />, 'barebones.js')
  )
  .add('treeData import/export', () =>
    wrapWithSource(<TreeDataIOExample />, 'tree-data-io.js')
  )
  .add('Add and remove nodes programmatically', () =>
    wrapWithSource(<AddRemoveExample />, 'add-remove.js')
  )
  .add('Modify nodes', () =>
    wrapWithSource(<ModifyNodesExample />, 'modify-nodes.js')
  )
  .add('Prevent drop', () => wrapWithSource(<CanDropExample />, 'can-drop.js'))
  .add('Search', () => wrapWithSource(<SearchExample />, 'search.js'))
  .add('Themes', () => wrapWithSource(<ThemesExample />, 'themes.js'))
  .add('Callbacks', () => wrapWithSource(<CallbacksExample />, 'callbacks.js'));

storiesOf('Advanced', module)
  .add('Drag from external source', () =>
    wrapWithSource(<ExternalNodeExample />, 'external-node.js')
  )
  .add('Touch support (Experimental)', () =>
    wrapWithSource(<TouchSupportExample />, 'touch-support.js')
  )
  .add('Tree-to-tree dragging', () =>
    wrapWithSource(<TreeToTreeExample />, 'tree-to-tree.js')
  )
  .add('Playing with generateNodeProps', () =>
    wrapWithSource(<GenerateNodePropsExample />, 'generate-node-props.js')
  )
  .add('Drag out to remove', () =>
    wrapWithSource(<DragOutToRemoveExample />, 'drag-out-to-remove.js')
  );
