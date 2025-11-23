const miniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const eslintPlugin = require('eslint-webpack-plugin');
const bundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

let pluginArr = [
  new eslintPlugin({
    context: path.resolve(__dirname, 'src'),
  }),
  new htmlWebpackPlugin({
    template: './index.html',
    filename: 'index.html',
    minify: {
      removeComments: true,
      collapseWhitespace: false,
      removeAttributeQuotes: false,
    },
    inject: 'body', // body/true   head/false
    chunks: ['app'],
  }),
  new htmlWebpackPlugin({
    template: './index.html',
    filename: 'index2.html',
    minify: {
      removeComments: true,
      collapseWhitespace: false,
      removeAttributeQuotes: false,
    },
    inject: 'body',
    chunks: ['app1'],
  }),
  new bundleAnalyzerPlugin(),
];

function hasMiniCssExtractPlugin() {
  if (process.env.NODE_ENV === 'production') {
    pluginArr.push(
      new miniCssExtractPlugin({
        filename: 'css/test.css',
      })
    );
  }
}

hasMiniCssExtractPlugin();

module.exports = {
  entry: {
    app: './src/index.js',
    app1: './src/index1.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash:4].bulid.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : miniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1000,
          },
        },
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },
  plugins: pluginArr,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js'],
  },
};
