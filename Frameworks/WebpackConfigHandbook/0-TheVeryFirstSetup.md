# 破冰实验

## 创建第一个 bundle

最初的目录结构是：

```
  webpack-demo
  |- package.json
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

dist/index.html 文件：

```js
  <!doctype html>
  <html>
   <head>
     <title>Getting Started</title>
   </head>
   <body>
+    <script src="main.js"></script>
   </body>
  </html>
```

这个 main.js 其实就是 webpack 新创建出来的 bundle。

现在，运行 `npx webpack`。它将会把 src/index.js 作为入口文件，并生成 dist/main.js 作为输出文件。

## 使用配置文件

添加 webpack.config.js 文件来进行 webpack 的配置：

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

然后，我们也可以修改一下 package.json 来配置 webpack 命令：

```json
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9"
    },
    "dependencies": {
      "lodash": "^4.17.5"
    }
  }
```

这样，运行 npm run build 就可以运行 webpack 了。
