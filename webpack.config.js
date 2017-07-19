const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    plugins: () => [
      autoprefixer({ browsers: ['IE >= 9', 'last 2 versions', '> 1%'] }),
    ],
  },
};

const cssLoader = isLocal => ({
  loader: 'css-loader',
  options: {
    modules: true,
    '-autoprefixer': true,
    importLoaders: true,
    localIdentName: isLocal ? 'rst__[local]' : null,
  },
});

const config = {
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactSortableTree',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: false,
      beautify: true,
      comments: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        use: [styleLoader, cssLoader(true), postcssLoader, 'sass-loader'],
        include: path.join(__dirname, 'src'),
      },
      {
        // Used for importing css from external modules (react-virtualized, etc.)
        test: /\.css$/,
        use: [styleLoader, cssLoader(false), postcssLoader],
      },
    ],
  },
};

switch (target) {
  case 'umd':
    config.externals = [
      nodeExternals({
        // load non-javascript files with extensions, presumably via loaders
        whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      }),
    ];
    break;
  case 'development':
    config.devtool = 'eval';
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      include: path.join(__dirname, 'src'),
    });
    config.entry = [
      'react-hot-loader/patch',
      './src/examples/basicExample/index',
    ];
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    };
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './src/examples/basicExample/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      new webpack.NoEmitOnErrorsPlugin(),
    ];
    config.devServer = {
      contentBase: path.join(__dirname, 'build'),
      port: process.env.PORT || 3001,
      stats: {
        chunks: false,
        hash: false,
        version: false,
        assets: false,
        children: false,
      },
    };

    break;
  case 'test':
    config.devtool = 'source-map';
    config.module.rules = [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        use: [styleLoader, cssLoader(true), postcssLoader, 'sass-loader'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        use: [styleLoader, cssLoader(false), postcssLoader],
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg)$/,
        use: [fileLoader],
        include: path.join(__dirname, 'src'),
      },
      // { test: /\.json$/, use: 'json' }, // For the cheerio dependency of enzyme
    ];
    // config.module.rules.unshift({
    //   enforce: 'pre',
    //   test: /\.jsx?$/,
    //   use: 'eslint-loader',
    //   include: path.join(__dirname, 'src'),
    // });
    // config.module.rules.push(
    //   {
    //     test: /\.(jpe?g|png|gif|ico|svg)$/,
    //     use: [
    //       fileLoader,
    //     ],
    //     include: path.join(__dirname, 'src'),
    //   },
    //   { test: /\.json$/, use: 'json-loader' } // For the cheerio dependency of enzyme
    // );
    delete config.output;
    delete config.entry;
    // config.entry = ['react-hot-loader/patch', './src/examples/basicExample/index'];
    // config.output = {
    //   path: path.join(__dirname, 'build'),
    //   filename: 'static/[name].js',
    // };
    config.plugins = [
      // new HtmlWebpackPlugin({
      //   inject: true,
      //   template: './src/examples/basicExample/index.html',
      // }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'test' }),
    ];
    config.externals = {
      // All of these are for enzyme
      'react/addons': true,
      'react/lib/ReactContext': true,
      'react/lib/ExecutionEnvironment': true,
    };
    // config.devServer = {
    //   contentBase: path.join(__dirname, 'build'),
    //   port: process.env.PORT || 3001,
    //   stats: {
    //     chunks: false,
    //     hash: false,
    //     version: false,
    //     assets: false,
    //     children: false,
    //   },
    // };

    break;
  case 'demo':
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      include: path.join(__dirname, 'src'),
    });
    config.entry = './src/examples/basicExample/index';
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    };
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './src/examples/basicExample/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ];

    break;
  default:
}

module.exports = config;
