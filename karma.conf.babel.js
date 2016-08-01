import KarmaCoverage from 'karma-coverage';
import KarmaJasmine from 'karma-jasmine';
import KarmaWebpack from 'karma-webpack';
import KarmaSpecReporter from 'karma-spec-reporter';
import KarmaJunitReporter from 'karma-junit-reporter';
import KarmaSourcemapLoader from 'karma-sourcemap-loader';
import KarmaPhantomjsLauncher from 'karma-phantomjs-launcher';
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
            KarmaSourcemapLoader,
            KarmaPhantomjsLauncher,
        ],
        reporters: ['progress', 'coverage'],
        webpack: webpackConfig,
        coverageReporter: {
            dir: 'coverage',
            file: 'coverage.json',
            type: 'json'
        }
    });
}
