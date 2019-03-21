# TypeScript

TypeScript 是 JS 的超集，可以被编译成原生的 JS。本篇主要是讲解如何使用 webpack 整合 TypeScript。

## 基础设置

首先需要安装 ts 的编译器和加载器：

```bash
npm install --save-dev typescript ts-loader
```

然后在根目录下添加文件：tsconfig.json。

如下的简单配置可以支持 jsx 并可以将 ts 文件编译为 ES5：

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true
  }
}
```

[这里](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)详细介绍了 tsconfig.json 的配置方法。

[这里](https://webpack.js.org/concepts/configuration/)详细介绍了 webpack 的配置

下面，在 webpack.config.js 文件中配置：

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    // 支持 ts-loader
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    // 支持 ts
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

这样的配置可以让 webpack 的入口是 index.ts 文件，并使用 ts-loader 加载所有 ts 或 tsx 文件，然后打包输出为 bundle.js。

## Loader

就是 `ts-loader`。

## Source Maps

在 tsconfig.json 中配置：

```json
  {
    "compilerOptions": {
      "outDir": "./dist/",
+     "sourceMap": true,
      "noImplicitAny": true,
      "module": "commonjs",
      "target": "es5",
      "jsx": "react",
      "allowJs": true
    }
  }
```

并在 webpack.config.js 文件中配置 devtool 为 'inline-source-map'。

## 使用第三方库

使用第三方库的时候，必须要安装该第三方库的类型定义。

比如你要使用 lodash，就同时要安装 @types/lodash。

## 导入其他资源

如果想协同 ts 使用非代码的资源，需要为这些资源定义类型，也就是一个 `xxx.d.ts` 文件，例如某个 .svg 文件就需要声明：

xxx.t.ts:

```ts
declare module "*.svg" {
  const content: any;
  export default content;
}
```

Here we declare a new module for SVGs by specifying any import that ends in .svg and defining the module's content as any. We could be more explicit about it being a url by defining the type as string. The same concept applies to other assets including CSS, SCSS, JSON and more.
