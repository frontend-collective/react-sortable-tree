import { getParameters } from 'codesandbox/lib/api/define';

const GIT_URL =
  'https://api.github.com/repos/fritz-c/react-sortable-tree/contents/';

export const SANDBOX_URL = 'https://codesandbox.io/api/v1/sandboxes/define';

// full url for github api call
const getURL = filename => `${GIT_URL}/examples/storybooks/${filename}`;

// strip ../../src from the src
const strip = code => code.replace('../../src', 'react-sortable-tree');

const index = `
import React from 'react';
import { render } from 'react-dom';
import App from './example';

render(<App />, document.getElementById('root'));
`;

const html = `<div id="root"></div>`;

// using codesandbox util
// returns the payload to send to the define endpoint
const getPayload = example =>
  getParameters({
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
            'react-sortable-tree': 'latest',
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

// set the form values and submit the form
const sendSandboxRequest = parameters => {
  document.getElementById('codesandbox-parameters').value = parameters;
  document.getElementById('codesandbox-form').submit();
};

// what is called when the view sandbox element is clicked
// get blob from github and the process it and send the POST request
export const handleClick = file => event => {
  event.preventDefault();
  const url = getURL(file);
  fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error getting blob from GitHub:', error)) // eslint-disable-line no-console
    .then(response => {
      const stripped = strip(atob(response.content));
      const payload = getPayload(stripped);
      sendSandboxRequest(payload);
    });
};
