import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import packageObj from './package.json';

// Get the external packages used by the project
const externals = {};
[ 'dependencies', 'peerDependencies' ].forEach(depGroup => {
    if (packageObj[depGroup]) {
        Object.keys(packageObj[depGroup]).forEach(dep => {
            externals[dep] = dep;
        });
    }
});

module.exports = {
    entry: {
        'react-sortable-tree': './src/index',
    },
    output: {
        path: path.join(__dirname, 'dist', 'umd'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'ReactSortableTree',
    },
    resolve: {
        extensions: ['', '.js']
    },
    devtool: 'source-map',
    plugins: [
        new webpack.EnvironmentPlugin([
            "NODE_ENV",
        ]),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle: false,
            beautify: true,
            comments: true,
        }),
    ],
    postcss: [
        autoprefixer({ browsers: ['IE >= 9', 'last 2 versions', '> 1%'] }),
    ],
    externals,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader?insertAt=top',
                    'css-loader?modules&-autoprefixer&importLoaders=1&localIdentName=rst__[local]',
                    'postcss-loader',
                    'sass-loader',
                ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader?insertAt=top',
                    'css-loader?-autoprefixer',
                    'postcss-loader',
                ],
            },
        ]
    }
};
