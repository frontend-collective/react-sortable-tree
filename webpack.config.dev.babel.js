import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

module.exports = {
    devtool: 'source-map',
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
        new webpack.NoErrorsPlugin(),
    ],
    postcss: [
        autoprefixer({ browsers: ['IE >= 9', '> 1%'] }),
    ],
    module: {
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
                    'css-loader?modules&importLoaders=1&localIdentName=rst__[local]',
                    'postcss-loader',
                    'sass-loader',
                ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader?insertAt=top',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                loaders: [
                    'file-loader?name=static/[name]-[hash:6].[ext]',
                ],
                include: path.join(__dirname, 'src')
            },
        ],
    },
    devServer: {
        contentBase: 'build',
        port: 3001,
        stats: {
            chunks: false,
            hash: false,
            version: false,
            assets: false,
            children: false,
        },
    },
};
