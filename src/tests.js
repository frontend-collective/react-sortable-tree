import Bluebird from 'bluebird';

// Polyfill a full ES6 environment
// Reference: https://babeljs.io/docs/usage/polyfill/
// Reference: https://github.com/zloirock/core-js
import 'babel-polyfill';

// Replace the scheduler with setImmediate so we can write sync tests
Bluebird.setScheduler(fn => {
    global.setImmediate(fn);
});
// Overwrite global.Promise with Bluebird
global.Promise = Bluebird;

// Reference: https://github.com/webpack/karma-webpack#alternative-usage
const tests = require.context('.', true, /\.test\.(js|jsx)$/);
tests.keys().forEach(tests);
