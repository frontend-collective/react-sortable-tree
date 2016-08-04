// Reference: https://github.com/webpack/karma-webpack#alternative-usage
const tests = require.context('.', true, /\.test\.(js|jsx)$/);
tests.keys().forEach(tests);
