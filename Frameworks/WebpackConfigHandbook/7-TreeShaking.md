# Tree Shaking

Tree shaking 的作用是，排除掉那些 dead-code。

dead-code 就是那些声明了但是却没有被使用到的 modules。

比如说：

在 math.js 文件中：

```js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}
```

但是在其他任何地方，square 函数并没有被用到。那么这个方法就被称为 dead code。

运行 npm run build，看到的结果是：

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
  'use strict';
  /* unused harmony export square */
  /* harmony export (immutable) */ __webpack_exports__['a'] = cube;
  function square(x) {
    return x * x;
  }

  function cube(x) {
    return x * x * x;
  }
});
```

可以发现，square 方法虽然没有被用到，但是还是被引入进了 bundle。这样可不好。

Let's fix it!

## Mark the file as side-effect-free：将文件标记为无副作用

通过设置 package.json 中的 sideEffects 属性，我们可以告诉 webpack compiler 哪些代码是可能会有副作用的。从而不要让 compiler 删除这些没有用到的 export。

而如果所有的代码都会有什么副作用，就可以将 sideEffects 写成 false。这样，webpack 就可以安全地删除所有未用到的 export 导出。

## 压缩 output

在 webpack.config.js 中配置 mode -> production：

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
- mode: 'development'
+ mode: 'production'
};
```

这样，bundle 就会被精简和压缩。

## 总结

注意，如果想要用 tree shaking，必须要：

1. 使用 import & export 语法，并确保没有被其他 compilers 转化为 CommonJS modules

2. 在项目 package.json 文件中，添加一个 "sideEffects" 属性。

3. 使用 production 模式