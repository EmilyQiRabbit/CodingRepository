# Shimming

webpack 的编译器能够识别 ES2015 modules，CommonJS 或者 AMD，但是，一些第三方库可能会需要全局变量（比如 jquery 的 $）。或者，这些库可能希望暴露一些全局变量。这时，就是 shimming 发挥作用的时候了。

> **We don't recommend using globals**! The whole concept behind webpack is to allow more modular front-end development. This means writing isolated modules that are well contained and do not rely on hidden dependencies (e.g. globals). **Please use these features only when necessary**.

另一个 shimming 可以发挥作用的地方是为浏览器某些功能的 polyfill，这时你会希望将这些 polyfill 传送到浏览器里面。

## Shimming Globals

栗子：将 lodash 作为全局变量：

```js
// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // ProvidePlugin 用来提供全局变量
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash'
    })
  ]
};
```

在 index.js 中：

```js
// 可以去掉 lodash de 引入了，完全可以正常工作～
// import _ from 'lodash';

function component() {
  var element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

稍微修改一下配置，还可以仅打包 lodash 的 join 方法：

```js
...
plugins: [
  new webpack.ProvidePlugin({
    join: ['lodash', 'join']
  })
]
...

```

## Granular Shimming

一些旧模块可能需要依赖 this 指向 window 对象。

```js
function component() {
  var element = document.createElement('div');

  element.innerHTML = join(['Hello', 'webpack'], ' ');

  // Assume we are in the context of `window`
  this.alert('Hmmm, this probably isn\'t a great idea...')

  return element;
}

document.body.appendChild(component());
```

而在 CommonJS 的上下文，this 指向了 module.exports，这种情况下，可以用 `imports-loader`，webpack.config.js 配置如下：

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: require.resolve('index.js'),
        use: 'imports-loader?this=>window'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      join: ['lodash', 'join']
    })
  ]
};
```

## Global Exports

假设某个库创建了一个全局变量，希望其他库来使用。比如：

src/globals.js：

```js
var file = 'blah.txt';
var helpers = {
  test: function() { console.log('test something'); },
  parse: function() { console.log('parse something'); }
};
```

虽然你可能不会这么做，但是可能会有其他的仓库需要这样。这种情况下，你可以用 exports-loader，来将这个全局变量作为普通的模块导出。

webpack.config.js 的配置方法如下：

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window'
      },
      {
        test: require.resolve('globals.js'),
        use: 'exports-loader?file,parse=helpers.parse'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      join: ['lodash', 'join']
    })
  ]
};
```

> Now from within our entry script (i.e. src/index.js), we could import { file, parse } from './globals.js'; and all should work smoothly.

## Loading Polyfills

加载 polyfills 有很多方法，比如：

```bash
npm install --save babel-polyfill
```

然后在主 bundle 中，`import 'babel-polyfill'`

注意，这种方法将代码的正确运行考虑的比 bundle 大小要重要。要让代码更安全更健壮，polyfills/shims 必须要在其他代码之前运行，并且还必须同步加载。

但是如果你觉得不必顾虑这些，并且能够承担风险，那么可以采用如下方式：

```bash
npm install --save whatwg-fetch
```

在 src 文件下添加文件 src/polyfills.js：

```js
import 'babel-polyfill';
import 'whatwg-fetch';
```

修改 webpack.config.js：

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    polyfills: './src/polyfills.js',
    index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: require.resolve('index.js'),
        use: 'imports-loader?this=>window'
      },
      {
        test: require.resolve('globals.js'),
        use: 'exports-loader?file,parse=helpers.parse'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      join: ['lodash', 'join']
    })
  ]
};
```

有了这个，我们可以添加逻辑来有条件地加载我们的新 polyfills.bundle.js 文件。当然，如何做出此决定还要取决于你需要支持的技术和浏览器。

```html
  <!doctype html>
  <html>
    <head>
      <title>Getting Started</title>
      <script>
        var modernBrowser = (
          'fetch' in window &&
          'assign' in Object
        );
 
        if ( !modernBrowser ) {
          var scriptElement = document.createElement('script');
 
          scriptElement.async = false;
          scriptElement.src = '/polyfills.bundle.js';
          document.head.appendChild(scriptElement);
        }
      </script>
    </head>
    <body>
      <script src="index.bundle.js"></script>
    </body>
  </html>
```

## 更多的可优化项

babel-preset-env：

这个包使用 browserslist，仅转换浏览器不支持的内容。

> This preset comes with the useBuiltIns option, false by default, which converts your global babel-polyfill import to a more granular feature by feature import pattern。
