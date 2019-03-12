# 生产环境

本篇文章是关于：生产环境下的最佳实践。

> 知识储备：[Tree Shaking](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/Frameworks/WebpackConfigHandbook/tree-shaking.md) 和 [Development](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/Frameworks/WebpackConfigHandbook/development.md)。

## 配置

开发模式和生产模式的需求很不一样。
在开发模式下，我们希望有功能强大的 source mapping，有本地服，能够热更新、重加载等等。但是生产模式下，我们的目标就变成了：最小话打包体积，最小的 source mapping，优化资源，缩短加载时间等等。由于需求不同，所以我们建议不同环境下应当使用不同的 webpack 配置。

虽然开发模式和生产模式的 config 文件应该不同，但是我们还是应该保留一个 common 配置，它是两个 config 文件的交集，这样可以避免重复配置。这里，我们需要用到一个工具：[webpack-merge](https://github.com/survivejs/webpack-merge)，来将 common config 文件和不同环境下特殊的配置合并。

webpack-merge 的安装和配置：

```shell
npm install --save-dev webpack-merge
```

项目目录：

```
  webpack-demo
  |- package.json
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```

webpack.common.js：

```js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

webpack.dev.js

```js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
});
```

webpack.prod.js

```js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common, {
  mode: 'production',
});
```

## NPM 脚本

由于 dev 和 pro 的 webpack 配置不同，我们需要修改一下 npm 脚本：

```json
{
  ...
  "scripts": {
    "start": "webpack-dev-server --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
  ...
}
```

## 指定模式

很多时候，我们可以通过变量 process.env.NODE_ENV 来决定配置。例如，如果不是生产模式，就可以添加日志和测试数据来帮助我们调试。但是，如果 `process.env.NODE_ENV === 'production'`，那么就需要添加/丢弃一些代码来优化代码，好让应用以最好的性能面对用户。

自 webpack v4，特定[模式](https://webpack.js.org/concepts/mode/)会为你自动的配置 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)。

> The DefinePlugin allows you to create global constants which can be configured at compile time.

> 技术上说，NODE_ENV 是一个系统变量，它是 Node.js 暴露给运行脚本的。需要注意，在构建脚本 webpack.config.js 中，process.env.NODE_ENV 并不会被设置为 production，所以在 webpack 配置中，下面这样的代码是不会生效的：`process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js'`

另外，在本地目录 /src 下的文件也能够读取 `process.env.NODE_ENV`。

## 缩减代码

webpack v4 及其之后的版本会在生产模式下自动的最小化代码。

[TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/) 就是一个最小化代码的插件，它会被默认的使用。同时，其实也有其他选择，比如 BabelMinifyWebpackPlugin 和 ClosureCompilerPlugin。

但是如果你使用了别的插件，请确保 tree shaking 的功能，并把实例提供给配置 optimization.minimizer。

## Source Mapping

我们鼓励在生产模式下也开启 Source Mapping，它对与线上调试和基准测试很有用。但是，你要选择一个构建速度快的，以用于线上环境（详见 [devtool](https://webpack.js.org/configuration/devtool/)）。在 pro 的配置中，我们使用 source-map，而不是 dev 模式下的 inline-source-map。

```js
  const merge = require('webpack-merge');
  const common = require('./webpack.common.js');

  module.exports = merge(common, {
    mode: 'production',
+   devtool: 'source-map'
  });
```

> 在 pro 环境下，避免使用 `inline-***` 和 `eval-***` 可以减小打包体积。

## Minimize CSS

详见：[Minimizing for Production](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)

## CLI 选项

