module.exports = {
  parser: '@babel/eslint-parser',
  ignorePatterns: ['dist/', 'node_modules/', 'server**'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  // eslint-config-standard
  // eslint-config-airbnb
  extends: ['standard', 'plugin:vue/strongly-recommended'],
  plugins: ['vue', 'import'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': 0,
    'n/no-path-concat': 0,
    'comma-dangle': ['off'],
    semi: ['off'],
    'space-before-function-paren': ['off'],
    'new-cap': ['off'],
    'eol-last': ['off'],
    'prefer-const': ['off'],
  },
};
