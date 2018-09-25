# 多项目联合的 webpack 配置

多个项目打包的 weppack 包是如何引入到页面的呢？

## 前端项目

1. 配置好各自的 entry 和 output，例如：

```js
entry: {
  vendor: [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux',
    'redux-immutable',
    'immutable',
    'isomorphic-fetch',
    'fetch-ie8',
    'antd'
  ],
  [`${moduleName}`]: ['./client/pages/index.js']
},
output: {
  path: path.join(appPath, 'dist'), // 都输出到了 dist 文件中
  filename: '[name].[chunkhash].js',
  publicPath: `${context}/dist/`,
  sourceMapFilename: 'map/[file].map',
}
```

2. 通过 ManifestPlugin 生成 'mapping.json' 文件来追踪生成的文件。

```js
new ManifestPlugin({
  // 生成 mapping.json 文件
  fileName: 'mapping.json',
  // 通过配置，文件将会被放在 static 服务器中，这里配置好访问地址
  publicPath: `//static.xxx.com/alpha/${moduleName}/`,
  seed: {
    title: options.title
  }
})
```

## Node 项目

1. 读取文件，生成 package 包的路由

```js
/**
* 自动添加 package 包的路由
*/
const PACKAGE_PATH = '../../package-modules/'
// 所有 dist 文件的拷贝
function addPackageRoute(app){
  const packageRouterPath = path.join(__dirname,PACKAGE_PATH);
  fs.readdirSync(packageRouterPath).forEach(function(name){
    var filePath = path.join(packageRouterPath,name);
    if(fs.statSync(filePath).isDirectory()){
      var config = {}
      try {
        // 读取 ManifestPlugin 生成的 mapping.json 文件
        config = require(filePath+'/mapping.json')
      } catch (e) {
        console.log(e)
      } finally {
        global.package[name] = config;
        if(name !== 'layout'){
          app.use('/'+name, checkLoginStatus, Page);
        }
      }
    }
  });
}
```

2. 通过生成的 global.package 读取资源

```js
/**
 * 获取css结构
 */
function getCss(key) {
  const fileMapping = global.package[key];
  const buildLink = function (href) {
    return `<link href="${href}" rel="stylesheet">\n`;
  };
  if(fileMapping){
    return `${buildLink(fileMapping[`${key}.css`])}`;
  }else{
    return '';
  }
};

/**
 * 获取js结构
 */
function getJs(key) {
  const fileMapping = global.package[key];
  const buildScript = function (src) {
    return `<script src="${src}"></script>\n`;
  };
  if (fileMapping) {
    let keyjs, vendordlljs, vendorjs
    keyjs = fileMapping[`${key}.js`]
    // 如果不是公共部分，只获取业务代码，不获取 vendor 脚本
    if (key !== 'layout') {
      return `${buildScript(keyjs)}`;
    } else {
      vendorjs = fileMapping[`vendor.js`]
      return `${buildScript(vendorjs)}${buildScript(keyjs)}`
    }
  }
  return ''
};
```
