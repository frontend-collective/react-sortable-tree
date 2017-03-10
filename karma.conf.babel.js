// import KarmaJasmine from 'karma-jasmine';
// import KarmaWebpack from 'karma-webpack';
// import KarmaJasmineDiffReporter from 'karma-jasmine-diff-reporter';
// import KarmaJasmineHtmlReporter from 'karma-jasmine-html-reporter';
// import KarmaNotifyReporter from 'karma-notify-reporter';
// import KarmaSourcemapLoader from 'karma-sourcemap-loader';
// import KarmaPhantomjsLauncher from 'karma-phantomjs-launcher';
import webpackConfig from './webpack.config.test.babel';

export default function setConfig(config) {
    config.set({
        browsers: ['HeadlessChrome'],
        frameworks: ['jasmine'],
        files: ['src/tests.js'],
        preprocessors: {
            'src/tests.js': ['webpack', 'sourcemap']
        },
        // you can define custom flags
        customLaunchers: {
            'HeadlessChrome': {
                base: 'Chrome',
                flags: ['--headless'],
            },
        },
        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true,
        },
        // plugins: [
        //     KarmaJasmine,
        //     KarmaWebpack,
        //     KarmaJasmineDiffReporter,
        //     KarmaJasmineHtmlReporter,
        //     KarmaNotifyReporter,
        //     KarmaSourcemapLoader,
        //     KarmaPhantomjsLauncher,
        // ],
        reporters: [
            'jasmine-diff',
            'progress',
            'kjhtml',
            'notify',
        ],
        jasmineDiffReporter: {
            pretty: 4,
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
