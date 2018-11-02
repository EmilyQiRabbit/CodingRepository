# 代码分割

代码分割是 webpack 最引人注目的特性之一。这个特性让你能够将代码分别打包、按需并行异步加载。它可以缩小打包体积、并控制资源负载优先级；如果使用正确，将大大缩短加载时间。

如下是三个比较主流的代码分割方式：

* Entry points 入口点：通过配置 entry 项手动配置代码压缩。

* Prevent Duplication 防止副本：使用 SplitChunksPlugin 去重并分离 chunk。

* Dynamic Imports 动态加载：通过模块的内联函数调用来分离代码。

## Entry points

目前来说，这个是最简单最直观的代码分割方式了。但是，它需要更多人工配置，而且会有一些缺陷。下面我们就来看看如何从 main bundle 中分离出一些模块。

项目目录：

```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- another-module.js
|- /node_modules
```

another-module.js：

```js
import _ from 'lodash';

console.log(
  _.join(['Another', 'module', 'loaded!'], ' ')
);
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
+   another: './src/another-module.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

打包后的输出：

```
...
            Asset     Size   Chunks             Chunk Names
another.bundle.js  550 KiB  another  [emitted]  another
  index.bundle.js  550 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
...
```

但是，这个方法有一些缺点：

* 如果chunks 之间包含重复的模块，那些重复模块都会被引入到各个 bundle 中。

* 这种方法不够灵活，并且不能将核心逻辑进行动态拆分。

下面，我们通过使用 SplitChunksPlugin 插件来解决第一个问题。

## Prevent Duplication

SplitChunksPlugin 插件可以将公共依赖模块提取到一个已有 chunk 中，或者干脆提取到一个新的 chunk。下面让我们使用这个插件，将之前的示例中重复的 lodash 模块去除：

webpack.config.js

```js
  const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   optimization: {
+     splitChunks: {
+       chunks: 'all'
+     }
+   }
  };
```

有了 optimization.splitChunks 的配置，现在 plugin 就会被提取到一个单独的 chunk 中了。CommonsChunkPlugin 插件将 lodash 分离到单独的 chunk，并且将其从 main bundle 中移除，缩小了 chunk 原本的大小。

执行 npm run build 可以查看结果：

```
Hash: ac2ac6042ebb4f20ee54
Version: webpack 4.7.0
Time: 316ms
                          Asset      Size                 Chunks             Chunk Names
              another.bundle.js  5.95 KiB                another  [emitted]  another
                index.bundle.js  5.89 KiB                  index  [emitted]  index
vendors~another~index.bundle.js   547 KiB  vendors~another~index  [emitted]  vendors~another~index
Entrypoint index = vendors~another~index.bundle.js index.bundle.js
Entrypoint another = vendors~another~index.bundle.js another.bundle.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 489 bytes {vendors~another~index} [built]
[./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {vendors~another~index} [built]
[./src/another-module.js] 88 bytes {another} [built]
[./src/index.js] 86 bytes {index} [built]
    + 1 hidden module
```

以下是一些对代码分离很有帮助的插件和 loaders：

mini-css-extract-plugin：用于将 CSS 从主应用程序中分离。
bundle-loader：用于分离代码并延迟加载生成的 bundle。
promise-loader：类似于 bundle-loader ，但是使用的是 promises。

## dynamic imports

webpack 提供了两个类似的技术完成动态导入：第一种、也是推荐选择的方式是，使用 import() 语法。第二种、则是使用 webpack 特定的 require.ensure。

### import()

webpack.config.js

```js
const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
+     index: './src/index.js'
-     index: './src/index.js',
-     another: './src/another-module.js'
    },
    output: {
      filename: '[name].bundle.js',
+     chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
-   optimization: {
-     splitChunks: {
-       chunks: 'all'
-     }
-   }
  };
```

注意，这里在 output 使用了 chunkFilename，它决定那些没有入口的 chunk 的名称。想了解 chunkFilename 更多信息，请查看 output 的相关文档。接着，更新项目目录，移除掉那些现在不会用到的文件：

```js
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
- |- another-module.js
|- /node_modules
```

现在，我们不再静态导入 lodash，而是分离出一个 chunk 并动态导入：

src/index.js：

```js
- import _ from 'lodash';
-
- function component() {
+ function getComponent() {
-   var element = document.createElement('div');
-
-   // Lodash, now imported by this script
-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
+     var element = document.createElement('div');
+
+     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+     return element;
+
+   }).catch(error => 'An error occurred while loading the component');
  }

- document.body.appendChild(component());
+ getComponent().then(component => {
+   document.body.appendChild(component);
+ })
```

注意：在注释中使用的 webpackChunkName。这样做会将 bundle 被命名为 lodash.bundle.js ，而不是 [id].bundle.js。想了解更多关于 webpackChunkName 和其他可用选项，请查看 import() 相关文档。

下面让执行 webpack，查看 lodash 是否会分离到一个单独的 bundle：

```
Hash: a3f7446ffbeb7fb897ff
Version: webpack 4.7.0
Time: 316ms
                   Asset      Size          Chunks             Chunk Names
         index.bundle.js  7.88 KiB           index  [emitted]  index
vendors~lodash.bundle.js   547 KiB  vendors~lodash  [emitted]  vendors~lodash
Entrypoint index = index.bundle.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 489 bytes {vendors~lodash} [built]
[./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {vendors~lodash} [built]
[./src/index.js] 394 bytes {index} [built]
    + 1 hidden module
```

由于 import() 会返回一个 promise，因此它可以和 async 函数一起使用。但是，需要使用像 Babel 这样的预处理器和 Syntax Dynamic Import Babel Plugin。下面是如何通过 async 函数简化代码：

src/index.js：

```js
- function getComponent() {
+ async function getComponent() {
-   return import(/* webpackChunkName: "lodash" */ 'lodash').then({ default: _ } => {
-     var element = document.createElement('div');
-
-     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-
-     return element;
-
-   }).catch(error => 'An error occurred while loading the component');
+   var element = document.createElement('div');
+   const { default: _ } = await import(/* webpackChunkName: "lodash" */ 'lodash');
+
+   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+   return element;
  }

  getComponent().then(component => {
    document.body.appendChild(component);
  });
```

## Prefetching/Preloading modules

webpack 4.6.0+ 增加了对重加载的支持。

在 import 执行的时候使用这些行内命令，可以让 webpack 输出 “Resource Hint”，它可以为浏览器提供信息，包括：

* prefetch：该资源可能在将来的其他链接中有用

* preload：该资源可能在当前链接中就需要

简单的 prefetch 的例子，比如有一个 HomePage 组件，它展现一个 LoginButton 组件，然后按需的在单击 LoginModal 组件后加载一个 LoginModal 组件。

LoginButton.js：

```js
//...
import(/* webpackPrefetch: true */ 'LoginModal');
```

这将会吧 `<link rel =“prefetch”href =“login-modal-chunk.js”>` 附加在页面的头部，它将指示浏览器在空闲时间预取 login-modal-chunk.js 文件。

与 prefetch 相比，preload 指令则有很多不同：

* preload 父块并行加载。prefetch 在父块完成加载后启动。

* preload 具有中等优先级，并会立即下载。prefetch 则只当浏览器处于空闲状态时下载。

* 父块应该立即请求 preload。prefetch 则可以在将来的任何时候使用。

* 浏览器支持不同。

简单的 preload 的示例可以是：有一个组件，它总是依赖于一个位于体积比较大的库，这个库被打包成一个单独的 chunk。

让我们设想一个组件 ChartComponent，它需要一个庞大的图表库。它在呈现时显示一个 LoadingIndicator，并立即按需导入 ChartingLibrary：

```js
//...
import(/* webpackPreload: true */ 'ChartingLibrary');
```

当请求使用 ChartComponent 的页面时，通过 `<link rel =“preload”>` 请求图表库块。假设页面的 chunk 较小并且完成得更快，那么页面在加载完成之前就显示 LoadingIndicator，直到已经请求的图表库 chunk 完成为止。这将提供一点加载时间，因为它只需要一次往返而不是两次。特别是在高延迟环境中。

> Using webpackPreload incorrectly can actually hurt performance, so be careful when using it.

## Bundle Analysis

使用官方提供的 Bundle analyse：https://github.com/webpack/analyse