module.exports = {
  extends: [
    'eslint-config-airbnb',
    'prettier',
    'prettier/react'
  ],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'react/destructuring-assignment': 0,
    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
    'react/no-did-mount-set-state': 0,
    'react/sort-comp': 0
  },
}
