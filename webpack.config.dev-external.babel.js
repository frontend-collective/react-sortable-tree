import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

module.exports = {
  devtool: 'source-map',
  entry: {
    demo: './src/examples/externalNodeExample/app',
  },
  output: {
    path: 'build',
    filename: 'static/[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './src/examples/externalNodeExample/index.html',
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.NoErrorsPlugin(),
  ],
  postcss: [autoprefixer({ browsers: ['IE >= 9', 'last 2 versions', '> 1%'] })],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader?insertAt=top',
          'css-loader?modules&-autoprefixer&importLoaders=1&localIdentName=rst__[local]',
          'postcss-loader',
          'sass-loader',
        ],
        include: path.join(__dirname, 'src'),
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
        loaders: ['file-loader?name=static/[name].[ext]'],
        include: path.join(__dirname, 'src'),
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
