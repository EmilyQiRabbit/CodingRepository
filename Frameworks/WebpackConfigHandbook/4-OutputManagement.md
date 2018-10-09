# Webpack Output 管理

## 基础

**output选项指定webpack输出的位置。**

目录结构：

```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- index.html
|- /src
  |- index.js
  |- print.js
|- /node_modules
```

webpack.config.js 配置：

```js
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

dist/index.html 引入

```html
<!doctype html>
<html>
  <head>
    <title>Output Management</title>
    <script src="./print.bundle.js"></script>
  </head>
  <body>
    <script src="./app.bundle.js"></script>
  </body>
</html>
```

运行 `npm run build` 后显示：

```js
...
          Asset     Size   Chunks                   Chunk Names
  app.bundle.js   545 kB    0, 1  [emitted]  [big]  app
print.bundle.js  2.74 kB       1  [emitted]         print
...

```

注：package.json 中 build 命令为： webpack

## output 的 path 和 publicPath

output.path 配置的是打包后输出的目录，对应一个绝对路径，例如在项目中通常会做如下配置：

```js
output: {
	path: path.resolve(__dirname, '../dist'),
}
```

output.publicPath 配置的是：所有资源的 **基础路径**。即、项目中引用 css，js，img 等资源时候的一个基础路径，这个基础路径要配合每个资源配置的特定路径使用。

所以打包后资源的访问路径可以这样表示：

> 静态资源最终访问路径 = output.publicPath + 资源 loader 或插件等配置路径

注：一般情况下 publicPath 应该以 '/' 结尾，而其他 loader 或插件的配置不要以 '/' 开头。

## HtmlWebpackPlugin

HtmlWebpackPlugin 是一个插件，使用前需要安装一下。
它的目的是，自动生成 index.html 文件并覆盖掉旧文件。新的 index.html 中，所有的 bundle 都会被自动的添加上了。

```
npm install --save-dev html-webpack-plugin
```

然后再 webpack.config.js 中引入 html-webpack-plugin：

```js
 const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

HtmlWebpackPlugin 还有更多功能例如：生成多个 html 文件，根据模版创建，选择特定 chunk 生成文件等等。

更多关于 HtmlWebpackPlugin 的可以参见[这里](https://github.com/jantimon/html-webpack-plugin)

## 清理 /dist 文件

每次 build 之前首先清理 /dist 文件是一个不错的选择。

可以使用 clean-webpack-plugin：

```js
const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

## Manifest

manifest 配置项中，配置了 modules 和输出的 bundles 之间是如何配对的。

配置方法是使用 [WebpackManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin) 插件。

第一步，在 webpack.config.js 的 plugins 中加入 ManifestPlugin：

```js
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    // ...
    plugins: [
      new ManifestPlugin()
    ]
};
```

它将会在你的根目录下生成 manifest.json 文件，文件中包含了源文件和输出文件的映射关系。

ManifestPlugin 可以传入 options 参数来进行更详尽的配置：

```js
// webpack.config.js

module.exports = {
  output: {
    publicPath
  },
  plugins: [
    new ManifestPlugin(options)
  ]
}
```

例如：

1. options.fileName（ 默认为 manifest.json
2. options.publicPath（ 默认为 output.publicPath：A path prefix that will be added to values of the manifest.
3. options.seed：manifest 文件的默认配置
...([详见](https://github.com/danethurber/webpack-manifest-plugin)))

