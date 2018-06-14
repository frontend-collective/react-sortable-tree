/* eslint-disable import/no-extraneous-dependencies */
import { getParameters } from 'codesandbox/lib/api/define';

const GIT_URL =
  'https://api.github.com/repos/frontend-collective/react-sortable-tree/contents';

export const SANDBOX_URL = 'https://codesandbox.io/api/v1/sandboxes/define';

// full url for github api call
const getURL = filename => `${GIT_URL}/stories/${filename}`;

// strip ../src from the src
const strip = code =>
  code.replace('../src', 'react-sortable-tree').replace(
    `// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';`,
    ''
  );

// modify code so we can just have one file in the sandbox. index.js
const modify = code => {
  const addToTop = `import { render } from 'react-dom';\nimport 'react-sortable-tree/style.css';\n`;
  const addToBottom = `\nrender(<App />, document.getElementById('root'));`;
  return addToTop + code + addToBottom;
};

// parse. Possible the atob throws an exception
const parse = base64 => {
  let parsed;
  try {
    parsed = atob(base64);
  } catch (error) {
    console.error('Failed to parse base64 from GitHub', error); // eslint-disable-line no-console
  }
  return parsed;
};

const html = `<div id="root"></div>`;

// using codesandbox util
// returns the payload to send to the define endpoint
const getPayload = code =>
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
        content: code,
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
      const parsed = parse(response.content);
      if (!parsed) {
        return;
      }
      const payload = getPayload(modify(strip(parsed)));
      sendSandboxRequest(payload);
    });
};
