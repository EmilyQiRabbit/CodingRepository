# 动态加载 & 预先加载

## react-loadable

```js
import Loadable from 'react-loadable'

...

const DemoPage = Loadable({
  loader: () => scriptLoader(window['DEMO_PAGE'], 'DemoPage').then(() => 
    import(/* webpackChunkName: "demo_page" */ 'containers/demo_page')
  ),
  loading: () => <Loading/>
})
```

## scriptLoader

scriptLoader 函数负责动态加载资源文件

```js
const scriptLoader = (scriptName, globalName, prefix) => {
  return new Promise((resolve, reject) => {
    if (window[globalName]) {
      return resolve()
    }

    prefix = prefix || (ENV.NODE_ENV === 'development' ? '/static/' : 'https://assets-cdn.xxx/static/')
    const url = prefix + scriptName

    const scriptNode = document.createElement('script')
    scriptNode.src = url
    scriptNode.type = 'text/javascript'
    scriptNode.onload = () => resolve()
    scriptNode.onerror = reject
    document.body.appendChild(scriptNode)
  })
}
```

## webpack 配置

```js
new CopyWebpackPlugin([
  {
    from: 'node_modules/.../dist/demo_page.min.js',
    to: `/static/[name].${config.env.filesHash['DEMO_PAGE']}.[ext]`
  }
  ...
]),
```

以及：

```js

/**
 * 为文件生成 hash
 */

// 详细可见：https://www.npmjs.com/package/hash-file -> Create a hashed file name
const hashFile = require('hash-file')

generateHashes([
  {
    fileName: path.resolve(process.cwd(), 'node_modules/.../dist/demo_page.min.js'),
    hashKey: 'DEMO_PAGE'
  }
  ...
], config.env.filesHash)

const generateHashes = (params, filesHash) => {
  params.forEach(param => {
    filesHash[param.hashKey] = hashFile.sync(param.fileName)
  })
}

```

npm run build 后，相关的文件将会被放在 build/static 文件中。

最后，在 html 文件中记录 DEMO_PAGE：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>DEMO PAGE</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      var DEMO_PAGE = "demo_page.min.%DEMO_PAGE%.js";
    </script>
  </body>
</html>
```
