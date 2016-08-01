import KarmaCoverage from 'karma-coverage';
import KarmaJasmine from 'karma-jasmine';
import KarmaWebpack from 'karma-webpack';
import KarmaSpecReporter from 'karma-spec-reporter';
import KarmaJunitReporter from 'karma-junit-reporter';
import KarmaSourcemapLoader from 'karma-sourcemap-loader';
import KarmaPhantomjsLauncher from 'karma-phantomjs-launcher';
import KarmaNotifyReporter from 'karma-notify-reporter';
import webpackConfig from './webpack.config.dev.babel';

export default function setConfig(config) {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: ['src/tests.js'],
        preprocessors: {
            'src/tests.js': ['webpack', 'sourcemap']
        },
        junitReporter: {
            outputDir: (process.env.CIRCLE_TEST_REPORTS || 'public') + '/karma',
            suite: 'karma'
        },
        singleRun: true,
        plugins: [
            KarmaCoverage,
            KarmaJasmine,
            KarmaWebpack,
            KarmaSpecReporter,
            KarmaJunitReporter,
            KarmaNotifyReporter,
            KarmaSourcemapLoader,
            KarmaPhantomjsLauncher,
        ],
        reporters: ['progress', 'coverage', 'notify'],
        webpack: webpackConfig,
        coverageReporter: {
            dir: 'coverage',
            file: 'coverage.json',
            type: 'json'
        },
        notifyReporter: {
            reportEachFailure: true, // Default: false, Will notify on every failed spec
            reportSuccess: false, // Default: true, Will notify when a suite was successful
        },
    });
}
