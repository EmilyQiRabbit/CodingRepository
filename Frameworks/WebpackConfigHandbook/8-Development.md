# Development

主要是用来配置开发模式，方便调试。

> let's look into setting up a development environment to make our lives a little easier.(呵呵)

## 使用 source maps

当 webpack 将代码打包为 bundles 之后，想要排查代码的报错和警告就比较困难了。

为了能更好的追踪问题，JS 提供了 source maps 来将打包的代码映射到源代码中。

关于 [source maps](https://blog.teamtreehouse.com/introduction-source-maps)

webpack 提供了 inline-source-map 选项，本篇就以此为例。

### 配置 webpack.config.js

```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   devtool: 'inline-source-map',
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Development'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

这样，当有错误出现的时候，报错信息就会是类似于这样：

```js
 Uncaught ReferenceError: cosnole is not defined
    at HTMLButtonElement.printMe (print.js:2)
```

## 选择开发工具

每次都要运行 npm run build 来打包代码真的很麻烦。有一些开发工具可以帮助你自动打包：

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

## webpack's Watch Mode

配置方法是在 package.json 中：

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
+   "watch": "webpack --watch",
    "build": "webpack"
  },
```

运行 npm run watch；这样，当有文件更新，代码将会被自动打包。

## webpack-dev-server（最常用）

webpack-dev-server 提供了一个简单的 web 服务，同时支持实时 reloading。

首先安装：npm install --save-dev webpack-dev-server

配置 webpack.config.js

```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    devtool: 'inline-source-map',
+   devServer: {
+     contentBase: './dist'
+   },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Development'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

这样，webpack-dev-server 将会从 ./dist 读取文件并在 8080 端口提供服务。

注意：webpack-dev-server 的 bundle 文件将会被保存在内存中。

配置 package.json 来启动服务：

```js
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
+   "start": "webpack-dev-server --open",
    "build": "webpack"
  }
```

## webpack-dev-middleware

webpack-dev-middleware 可以将 webpack 的打包行为交付给一个单独的服务，其实 webpack-dev-server 本身就使用了这个 middleware。但是如果你想要更多自定义功能，也可以拆出来用。

下面是结合 express 和 webpack-dev-middleware 的例子：

安装：npm install --save-dev express webpack-dev-middleware

修改 webpack.config.js

```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
+     publicPath: '/'
    }
  };
```

这个 publicPath 也将会被 middleware 的服务用到。

配置 express 服务：添加 server.js 文件 ->

```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

修改 package.json：

```js
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
    "start": "webpack-dev-server --open",
+   "server": "node server.js",
    "build": "webpack"
  }
```

终端中运行 npm run server，可以看到如下输出：

```
Example app listening on port 3000!
...
          Asset       Size  Chunks                    Chunk Names
  app.bundle.js    1.44 MB    0, 1  [emitted]  [big]  app
print.bundle.js    6.57 kB       1  [emitted]         print
     index.html  306 bytes          [emitted]
...
webpack: Compiled successfully.
```
