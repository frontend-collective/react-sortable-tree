module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    }
  }
};
