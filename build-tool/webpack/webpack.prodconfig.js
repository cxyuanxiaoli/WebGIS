const baseConfig = require('./webpack.baseconfig.js');
const { merge } = require('webpack-merge');

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'js/vendor.[chunkhash:4].bulid.js',
          chunks: 'all',
          minChunks: 1,
        },
        common: {
          filename: 'js/common.[chunkhash:4].bulid.js',
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
});
