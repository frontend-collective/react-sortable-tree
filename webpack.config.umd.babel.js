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
    devtool: 'source-map',
    plugins: [
        new webpack.EnvironmentPlugin([
            "NODE_ENV",
        ]),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            mangle: false,
            beautify: true,
            comments: true,
            sourceMap: true,
        }),
    ],
    node: {
        fs: 'empty',
    },
    externals,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader', options: { insertAt: 'top' } },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            '-autoprefixer': true,
                            importLoaders: 1,
                            localIdentName: 'rst__[local]',
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader', options: { insertAt: 'top' } },
                    { loader: 'css-loader', options: { '-autoprefixer': true } },
                    'postcss-loader',
                ],
            },
        ]
    }
};
