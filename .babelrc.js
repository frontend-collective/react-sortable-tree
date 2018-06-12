const env = process.env.NODE_ENV;

if (env === 'rollup') {
  module.exports = {
    presets: [
      [
        'env',
        {
          modules: false,
        },
      ],
      'stage-2',
      'react',
    ],
    plugins: ['external-helpers'],
  };
}

if (env === 'test') {
  module.exports = {
    comments: false,
    plugins: ['transform-es2015-modules-commonjs'],
    presets: ['react', 'stage-2'],
  };
}
