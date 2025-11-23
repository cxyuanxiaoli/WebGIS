# webpack5

## 为什么要使用构建工具？

### 开发

* 需要模块化，帮助我们更好地开发
* 会使用一些新语法和框架特殊写法(ts, es6, vue)

### 生产

* 浏览器自身无法解析模块化
* 浏览器只认识js，有的老浏览器对于es6支持不全

## 构建工具帮助我们做什么？

### 编译浏览器无法理解地东西-es6, ts, vue

### 代替一些人工操作

* 文件地合并与拆分
* 图片压缩
* 资源处理

### 帮助开发

* 开发模式

## webpack安装

全局安装webpack

```js
npm install webpack webpack-cli -g
```

## webpack基本配置

### entry : 必须项，以哪个文件为开始

### output : 必须项，最终产出js配置

### mode : webpack4后为必须项

### devServer : 非必填，开发模式配置

### module : 非必填，loader编写位置

### plugins : 非必填，插件配置

### optimization : 非必填，优化相关

### resolve : 非必填，提供一些简化功能

```javascript
module.exports = {
  mode: "production",  //none, development, production
  entry: {
    app: "./src/index.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].[hash:4].bulid.js",
  },
  devServer: {},
  module: {
    rules: [],
  },
  plugins: [],
  optimization: {},
  resolve: {},
};
```

## webpack处理js

### babel-loader    es6转化

1.安装相关依赖

* babel-loader、@babel/core、@babel/preset-env

```powershell
npm i babel-loader @babel/core @babel/preset-env -D
```

2.在webpack.config.js中module/rules数组中添加对象

```javascript
{
  test: /\.js$/,    //匹配js文件
  use: {
    loader: "babel-loader",
    options: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              browsers: ["> 1%", "last 2 versions", "ie > 8"],
            },
          },
        ],
      ],
    },
  },
}
```

3.或者将loader与配置文件分离

```js
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
  },
}
```

```.babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "ie > 8"]
        }
      }
    ]
  ]
}
```

### eslint    代码规范

1.安装依赖

* eslint、eslint-webpack-plugin

```powershell
npm i eslint eslint-webpack-plugin -D
```

2.在webpack.config.js中添加eslint插件

```js
const eslint = require('eslint-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: 'index.js',
    output: {
        path: __dirname+'dist',
        filename: '[name].[hash:4].bulid.js'
    }
    plugins: [new eslint()],
}
```

3.配置.eslintrc.js文件

```js
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [],
  plugins: [],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {},
};
```

4.使用现成的eslint规范文件

* eslint-config-standard、eslint-config-airbnb

```powershell
npm i eslint-config-standard -D
```

```js
module.exports = {
  env: {...},
  extends: ['standard'],
  plugins: [],
  parserOptions: {...},
  rules: {},
};
```

5.使用eslint插件以进行语法扩展

```powershell
npm i eslint-plugin-vue -D
```

```js
module.exports = {
  env: {...},
  extends: ['standard', 'plugin:vue/strongly-recommended'],
  plugins: ['vue'],
  parserOptions: {...},
  rules: {},
};
```

### 代码地分割与打包

#### 单入口

* runtime
* vendor
* 核心业务代码
* async module

#### 多入口

* runtime
* vendor
* 每个入口的核心业务代码
* common

```js
optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'vendor.[hash:4].bulid.js',
          chunks: 'all',
          minChunks: 1,
        },
        common: {
          filename: 'common.[hash:4].bulid.js',
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  }
```





## webpack处理css

1.css-loader+style-loader

```js
{
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
},
```



2.css-loader+mini-css-extract-plugin

```js
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production', 
  entry: {...},
  output: {...},
  devServer: {},
  module: {
    rules: [
      ...
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    ...
    new miniCssExtractPlugin({
      filename: 'test.css',
    }),
  ],
  optimization: {},
  resolve: {},
};

```



## webpack处理资源文件



```js
{
  test: /\.(jpg|jpeg|png|svg|gif)$/,
  type: 'asset', // asset/resource, asset/inline, asset
  parser: {
    dataUrlCondition: {
      maxSize: 5000,
    },
  },
  generator: {
    filename: '[name].[hash:4][ext]',
  },
},
```



## webpack处理html

```powershell
npm i html-webpack-plugin -D
```

单入口

```js
new htmlWebpackPlugin({
   template: './index.html',
   filename: 'index.html',
   minify: {
       removeComments: true,
       collapseWhitespace: false,
       removeAttributeQuotes: false,
   },
   inject: 'body', // body/true   head/false
})
```

多入口

```js
...
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js',
    app2: './src/index2.js',
  },
  output: {...},
  devServer: {},
  module: {
    rules: [...],
  },
  plugins: [
    ...
    new htmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      chunks: ['app'],
    }),
    new htmlWebpackPlugin({
      template: './index.html',
      filename: 'index2.html',
      chunks: ['app2'],
    }),
  ],
  optimization: {},
  resolve: {},
};

```



## webpack开发模式

1.安装 webpack-dev-server

```powershell
npm i webpack-dev-server -D
```

2.设置devServer字段

```js
devServer: {
  port: 8000,   //服务端口
  hot: true,    //热更新
  proxy: [      //
    {
      context: ['/'],
      target: 'http://localhost:3000/',
    },
  ],
},
```



3.用webpack-dev-server运行



## webpack完整配置文件

```js
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const eslintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development', // none, development, production
  devtool: 'eval-cheap-source-map',
  // entry: "./src/index.js",   // entry point of the application
  entry: {
    // multiple entry points
    app: './src/index.js',
    app1: './src/index1.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: 'js/[name].[chunkhash:4].bulid.js',
  },
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
        // use: ['style-loader', 'css-loader'],
        use: [miniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        type: 'asset', // asset/resource, asset/inline, asset
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
  plugins: [
    new eslintPlugin({
      context: __dirname + '/src',
    }),
    new miniCssExtractPlugin({
      filename: 'css/test.css',
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
      inject: 'body', // body/true   head/false
      chunks: ['app1'],
    }),
  ],
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
  resolve: {
    alias: {
      '@': __dirname + '/src',
    },
    extensions: ['.js'],
  },
  performance: {
    hints: false,
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
  },
};
```



## webpack配置文件分离

webpack.baseconfig.js

```js
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
```

webpack.devconfig.js

```js
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
```

webpack.prodconfig.js

```js
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
```

package.json

```json
{
  "scripts": {
    "eslint": "eslint --config .eslintrc.js src/",
    "build": "cross-env NODE_ENV=production webpack --config webpack.prodconfig.js",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.devconfig.js"
  },
  "devDependencies": {
    "@babel/core": "^7.28.3",
    "@babel/eslint-parser": "^7.28.0",
    "@babel/preset-env": "^7.28.3",
    "babel-loader": "^10.0.0",
    "cross-env": "^10.0.0",
    "css-loader": "^7.1.2",
    "eslint": "^8.57.1",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-import": "^2.32.0",
    "eslint-plugin-vue": "^10.4.0",
    "eslint-webpack-plugin": "^3.2.0",
    "html-webpack-plugin": "^5.6.4",
    "mini-css-extract-plugin": "^2.9.4",
    "style-loader": "^4.0.0",
    "webpack": "^5.101.0",
    "webpack-bundle-analyzer": "^4.10.2",
    "webpack-cli": "^6.0.1",
    "webpack-dev-server": "^5.2.2"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

## dll优化













































