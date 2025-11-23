const baseConfig = require('./webpack.baseconfig.js');
const { merge } = require('webpack-merge');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  devServer: {
    port: 8000,
    hot: true,
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:3000/',
      },
    ],
  },
  performance: {
    hints: false,
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
  },
});
