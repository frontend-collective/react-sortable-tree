import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import uglify from 'rollup-plugin-uglify';

const config = {
  input: 'src/index.js',
  external: [
    'react',
    'react-dom',
    'react-dnd',
    'prop-types',
    'react-dnd-html5-backend',
    'react-dnd-scrollzone',
    'react-virtualized',
    'lodash.isequal',
  ],
  output: {
    name: 'react-sortable-tree',
    format: 'es',
    file: 'dist/main-rollup-es.js',
  },
  plugins: [
    resolve(),
    babel({
      exclude: ['node_modules/**', '**/*.css'],
      presets: [['env', { modules: false }], 'react'],
      plugins: ['transform-object-rest-spread', 'external-helpers'],
      babelrc: false,
    }),
    commonjs(),
    postcss({
      extract: true,
    }),
  ],
};

if (process.env.TARGET === 'production') {
  config.output.file = 'dist/main-rollup-es.min.js';
  config.plugins.push(
    uglify({
      compress: {
        warnings: false,
      },
    })
  );
}

export default config;
