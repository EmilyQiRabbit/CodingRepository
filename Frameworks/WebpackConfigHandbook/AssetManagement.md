# 资源管理

## 加载 CSS

需要安装：style-loader css-loader，然后配置：

```js
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```

这样，webpack 就会将 css 文件插入作为 `<style>` 加入到 html 文件的 `<head>` 中了。

优化：
> Note that you can, and in most cases should, minimize css for better load times in production. On top of that, loaders exist for pretty much any flavor of CSS you can think of -- postcss, sass, and less to name a few.

## 加载图片

需要安装：file-loader，然后配置：

```js
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader'
+         ]
+       }
      ]
    }
  };
```

优化：
> A logical next step from here is minifying and optimizing your images. Check out the image-webpack-loader and url-loader for more on how you can enhance your image loading process.

## 加载字体

```js
...

+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader'
+         ]
+       }

...
```

## 加载数据

需要安装：csv-loader xml-loader，然后配置：

```js
+       {
+         test: /\.(csv|tsv)$/,
+         use: [
+           'csv-loader'
+         ]
+       },
+       {
+         test: /\.xml$/,
+         use: [
+           'xml-loader'
+         ]
+       }
```

