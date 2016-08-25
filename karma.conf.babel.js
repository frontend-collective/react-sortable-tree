import KarmaJasmine from 'karma-jasmine';
import KarmaWebpack from 'karma-webpack';
import KarmaJasmineDiffReporter from 'karma-jasmine-diff-reporter';
import KarmaJasmineHtmlReporter from 'karma-jasmine-html-reporter';
import KarmaNotifyReporter from 'karma-notify-reporter';
import KarmaSourcemapLoader from 'karma-sourcemap-loader';
import KarmaPhantomjsLauncher from 'karma-phantomjs-launcher';
import webpackConfig from './webpack.config.test.babel';

export default function setConfig(config) {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: ['src/tests.js'],
        preprocessors: {
            'src/tests.js': ['webpack', 'sourcemap']
        },
        plugins: [
            KarmaJasmine,
            KarmaWebpack,
            KarmaJasmineDiffReporter,
            KarmaJasmineHtmlReporter,
            KarmaNotifyReporter,
            KarmaSourcemapLoader,
            KarmaPhantomjsLauncher,
        ],
        reporters: [
            'jasmine-diff',
            'progress',
            'kjhtml',
            'notify',
        ],
        jasmineDiffReporter: {
            pretty: true,
            json: true,
            multiline: {
                before: 2, // 2 newlines
                after:  2, // 2 newlines
                indent: 4, // 4 spaces
            },
            color: {
                actualFg: 'red',
                expectedFg: 'green',
                actualBg: 'inverse',
                expectedBg: 'inverse',
                actualWhitespaceBg: '',
                expectedWhitespaceBg: '',
            }
        },
        webpack: webpackConfig,
        notifyReporter: {
            reportEachFailure: false, // Default: false, Will notify on every failed spec
            reportSuccess: false, // Default: true, Will notify when a suite was successful
        },
    });
}
