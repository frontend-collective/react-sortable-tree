/* eslint-disable import/no-extraneous-dependencies */
process.env.TARGET = 'test';
const webpackConfig = require('./webpack.config');

module.exports = function setConfig(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: ['./src/tests.js'],
    preprocessors: {
      'src/tests.js': ['webpack', 'sourcemap'],
    },
    reporters: ['jasmine-diff', 'progress', 'kjhtml', 'notify'],
    jasmineDiffReporter: {
      pretty: 4,
      json: true,
      multiline: {
        before: 2, // 2 newlines
        after: 2, // 2 newlines
        indent: 4, // 4 spaces
      },
      color: {
        actualFg: 'red',
        expectedFg: 'green',
        actualBg: 'inverse',
        expectedBg: 'inverse',
        actualWhitespaceBg: '',
        expectedWhitespaceBg: '',
      },
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: {
        chunks: false,
        hash: false,
        version: false,
        assets: false,
        children: false,
      },
    },
    notifyReporter: {
      reportEachFailure: false, // Default: false, Will notify on every failed spec
      reportSuccess: false, // Default: true, Will notify when a suite was successful
    },
  });
}
