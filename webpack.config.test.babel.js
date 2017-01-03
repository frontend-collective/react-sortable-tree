import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

module.exports = {
    devtool: 'eval',
    entry: {
        demo: './src/examples/basicExample/app',
    },
    output: {
        path: 'build',
        filename: 'static/[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: true,
            template: './src/examples/basicExample/index.html'
        }),
        new webpack.EnvironmentPlugin([
            "NODE_ENV",
        ]),
    ],
    postcss: [
        autoprefixer({ browsers: ['IE >= 9', 'last 2 versions', '> 1%'] }),
    ],
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                include: path.join(__dirname, 'src')
            },
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel'],
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
            {
                test: /\.(jpe?g|png|gif|ico|svg)$/,
                loaders: [
                    'file-loader?name=static/[name].[ext]',
                ],
                include: path.join(__dirname, 'src')
            },
            { test: /\.json$/, loader: 'json' }, // For the cheerio dependency of enzyme
        ],
    },
    externals: { // All of these are for enzyme
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
    },
    devServer: {
        contentBase: 'build',
        port: 3001
    },
};
