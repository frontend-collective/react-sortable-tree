const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;

const styleLoader = {
  loader: 'style-loader',
  options: { insertAt: 'top' },
};

const fileLoader = {
  loader: 'file-loader',
  options: { name: 'static/[name].[ext]' },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [autoprefixer()],
  },
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: true,
  },
};

const cssLoaders = [styleLoader, cssLoader, postcssLoader];

const config = {
  devtool: 'source-map',
  entry: './examples/basic-example/index',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'static/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css$/,
        use: cssLoaders,
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg)$/,
        use: [fileLoader],
        exclude: path.join(__dirname, 'node_modules'),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './examples/basic-example/index.html',
    }),
  ],
};

switch (env) {
  case 'development':
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    config.plugins.push(
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      new webpack.NoEmitOnErrorsPlugin()
    );
    config.devServer = {
      contentBase: path.join(__dirname, 'build'),
      port: process.env.PORT || 3001,
      stats: 'minimal',
    };

    break;
  case 'production':
    config.mode = 'production';
    config.plugins.push(
      new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })
    );
    break;
  default:
}

module.exports = config;
