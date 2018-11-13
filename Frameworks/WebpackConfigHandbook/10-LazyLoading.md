# Lazy Loading

懒加载，即按需加载。可以缩短首屏时间，并且可以避免加载那些可能根本没有用到的代码。

## 栗子

让我们继续以上一篇 [代码分割](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/Frameworks/WebpackConfigHandbook/9-CodeSplitting.md) 的例子，进一步演示这个概念。上一篇中，我们生成了一个独立的 chunk：lodash.bundle。但问题是，不需要任何用户这个 bundle 交互就会加载 —— 这意味着每次加载页面时，请求都会被触发。这对其实没有太大帮助，而且可能会对性能产生负面影响。

下面，我们将添加一些用户交互的需求：在用户单击按钮时将一些文本记录到控制台。但是，我们将等待加载代码(print.js)，直到第一次发生交互。为此，我们要重新处理「代码分割」中的最后一个动态导入示例，并将 lodash 保留在主块中。

项目目录：

```js
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- print.js
|- /node_modules
```

src/print.js：

```js
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
};
```

src/index.js：

```js
+ import _ from 'lodash';
+
- async function getComponent() {
+ function component() {
    var element = document.createElement('div');
-   const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
+   var button = document.createElement('button');
+   var br = document.createElement('br');

+   button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.appendChild(br);
+   element.appendChild(button);
+
+   // Note that because a network request is involved, some indication
+   // of loading would need to be shown in a production-level site/app.
+   button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
+     var print = module.default;
+
+     print();
+   });

    return element;
  }

- getComponent().then(component => {
-   document.body.appendChild(component);
- });
+ document.body.appendChild(component());
```

> Note that when using import() on ES6 modules you must reference the .default property as it's the actual module object that will be returned when the promise is resolved.

现在，输出将会是：

```
...
          Asset       Size  Chunks                    Chunk Names
print.bundle.js  417 bytes       0  [emitted]         print
index.bundle.js     548 kB       1  [emitted]  [big]  index
     index.html  189 bytes          [emitted]
...
```

## Frameworks 

每个平台都是自己推荐的方法去进行代码分割和懒加载，例如：

1. [React](https://reacttraining.com/react-router/web/guides/code-splitting)
2. [Vue](https://alexjover.com/blog/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)
3. [AngularJS](https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd)