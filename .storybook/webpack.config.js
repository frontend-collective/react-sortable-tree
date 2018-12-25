const path = require('path');

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: path.join(__dirname, 'website'),
      },
      {
        test: /\.css$/,
        use: 'css-loader',
        exclude: [path.join(__dirname, 'website')],
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg)$/,
        use: {
          loader: 'file-loader',
          options: { name: 'static/[name].[ext]' },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
    ],
  },
};
