# webpack Plugins

## CopyWebpackPlugin

目的：将文件或者目录拷贝到 build 路径下

一个简单的栗子：

```js
new CopyWebpackPlugin([
      { from: 'source ...路径', to: 'dest ...路径' }
    ]),
```

Usage：

webpack.config.js
```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  plugins: [
    new CopyWebpackPlugin([ ...patterns ], options)
  ]
}
```
