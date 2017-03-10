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
        path: path.join(__dirname, 'build'),
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
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    node: {
        fs: 'empty',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['react-hot-loader', 'babel-loader'],
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
            {
                test: /\.(jpe?g|png|gif|ico|svg)$/,
                use: [
                    { loader: 'file-loader', options: { name: 'static/[name].[ext]' } },
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
