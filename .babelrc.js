const env = process.env.NODE_ENV;

if (env === 'commonjs' || env === 'es') {
  module.exports = {
    ignore: ['*.test.js', 'src/tests.js'],
    plugins: ['transform-runtime'],
    presets: [['env', { modules: false }], 'react', 'stage-2'],
  };

  if (env === 'commonjs') {
    module.exports.plugins.push('transform-es2015-modules-commonjs');
  }
}

if (env === 'rollup') {
  module.exports = {
    comments: false,
    plugins: ['external-helpers'],
    presets: [['env', { modules: false }], 'react', 'stage-2'],
  };
}

if (env === 'development') {
  module.exports = {
    presets: ['react', 'stage-2'],
  };
}

if (env === 'production') {
  module.exports = {
    comments: false,
    plugins: ['transform-runtime'],
    presets: ['env', 'react', 'stage-2'],
  };
}

if (env === 'test') {
  module.exports = {
    comments: false,
    plugins: ['transform-es2015-modules-commonjs'],
    presets: ['react', 'stage-2'],
  };
}
