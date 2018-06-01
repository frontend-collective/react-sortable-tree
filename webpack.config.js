const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const target = process.env.TARGET || 'umd';

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

const defaultCssLoaders = [cssLoader, postcssLoader];

const cssLoaders =
  target !== 'development' && target !== 'demo'
    ? ExtractTextPlugin.extract({
        fallback: styleLoader,
        use: defaultCssLoaders,
      })
    : [styleLoader, ...defaultCssLoaders];

const config = {
  mode: 'production',
  entry: { 'dist/umd/react-sortable-tree': './src/index' },
  output: {
    path: __dirname,
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactSortableTree',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('style.css'),
  ],
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
        exclude: [path.join(__dirname, 'examples')],
      },
      {
        test: /\.css$/,
        use: [styleLoader, ...defaultCssLoaders],
        include: path.join(__dirname, 'examples'),
      },
    ],
  },
};

switch (target) {
  case 'umd':
    // Exclude library dependencies from the bundle
    config.externals = [
      nodeExternals({
        // load non-javascript files with extensions, presumably via loaders
        whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      }),
    ];

    // Keep the minimizer from mangling variable names
    // (we keep minimization enabled to remove dead code)
    config.optimization = {
      minimizer: [
        new UglifyJSPlugin({
          uglifyOptions: {
            mangle: false,
            compress: {
              warnings: false,
            },
            output: {
              beautify: true,
              comments: true,
            },
          },
        }),
      ],
    };
    break;
  case 'development':
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      exclude: path.join(__dirname, 'node_modules'),
    });
    config.entry = ['react-hot-loader/patch', './examples/basic-example/index'];
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    };
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './examples/basic-example/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      new webpack.NoEmitOnErrorsPlugin(),
    ];
    config.devServer = {
      contentBase: path.join(__dirname, 'build'),
      port: process.env.PORT || 3001,
      stats: 'minimal',
    };

    break;
  case 'demo':
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      exclude: path.join(__dirname, 'node_modules'),
    });
    config.entry = './examples/basic-example/index';
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    };
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './examples/basic-example/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
    ];

    break;
  default:
}

module.exports = config;
