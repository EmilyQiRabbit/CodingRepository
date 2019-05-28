# 热更新（HMR）

用途：在运行时，允许无需整体刷新，而更新模块内容。本章着重讲解应用，如果想要知道它是如何工作的，请到[这里](https://webpack.js.org/concepts/hot-module-replacement/)查看。

> 注意，HMR 只在开发模式使用。

## 如何开启 HMR

更新 webpack-dev-server 配置并使用 webpack 内置的 HMR 插件，即可开启 HMR。

webpack.config.js：

```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const webpack = require('webpack');

  module.exports = {
    entry: {
       app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true // added code
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
      new webpack.HotModuleReplacementPlugin() // added code
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

> 命令行修改 webpack-dev-server 配置的方法：`webpack-dev-server --hotOnly`

下面我们来验证下效果，在 index.js 中加上：

```js
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
```

print.js：

```js
export default function printMe() {
+   console.log('Updating print.js...')
  }
```

修改 print 文件中 console.log 的内容，可以在浏览器看到打印的日志...

## 在 node 中使用 HMR

```js
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
```

## HMR & Style

如果使用 style-loader，那么 CSS 的热更新就非常简单了。这个 loader 在后台使用了方法 module.hot.accept，当 css 依赖更新的时候，`<style>` 标签就会被更新。

原文链接：https://webpack.js.org/guides/hot-module-replacement


