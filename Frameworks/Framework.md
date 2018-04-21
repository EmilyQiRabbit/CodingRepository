title: Frame Share
speaker: Yuqi
theme: moon
date: 2018年4月

[slide]

# 挖一挖我们的框架代码
<div style='margin-bottom: 15px'>🙊<span style='font-size: 16px'>本来是想借着分析我们的框架来分析前后端渲染的，结果不小心歪楼了～</span></div>

知识点好多，牛的不行～

Let's START

[slide]

# ...🧤Just Green Hand，随时指正...

[slide]

# 首先想分享一下心得

* 最重要的，一定要运行起来！
* 从最简单的模版开始，试着变换栗子中的文件名可以帮助你发现问题。

[slide]

# 目录

## 1、Webpack dev
## 2、Node Service
## 3、Alpha Node

[slide]

# 1、Webpack dev

这部分的讲解将会基于单纯的前端服务，比如 bk-static-admin-xxx。

[slide]

# 什么是 webpack ? 

<div style='text-align: left; line-height: 50px'>
Webpack 像是一个模块打包机，将你的各种不同的文件（JS, TS, LESS, SESS...）转换和打包为合适的格式供浏览器使用。
</div>

<div style='text-align: left; line-height: 50px'>
就从启动服务开始说起。👈 我们首先会做什么呢？
</div>

[slide]

# 嗯 npm start


这个命令将会执行 package.json 内的 scripts.start 的命令

```bash
cross-env NODE_ENV=development webpack-dev-server --progress --colors --hot --inline
```

<div style='color: #db4c3f; margin: 15px 0'>划重点：</div>
* webpack-dev-server 为我们提供了一个开发服务器，它将搜索 webpack.config.js，并用该文件中的 devServer 完成配置

<div style='color: #db4c3f; margin: 15px 0'>另外，后面的几个 -- options：</div>

主要是辅助功能，了解一下.....

* color：使用颜色，有利于找出关键信息，只能在控制台中使用
* hot：启用热替换属性
* info：在控制台输出信息，默认输出
* open：运行命令之后自动打开浏览器
* progress：将运行进度输出到控制台，只可以使用控制台

[slide style = 'line-height: 50px']

``` JavaScript
devServer: {
  inline: true,
  compress: true,
  contentBase: path.resolve(appPath, 'public'),
  // 静态文件的文件夹地址，可以发现和 webpack config output 的 path 地址是一致的
  hot: true,
  port: 9090,
  publicPath: `${context}/`,
  // 可以发现它则和 output 的 publicPath 地址一致
  disableHostCheck: true, // To Resolve the problem: 'Invalid Host Header'
  historyApiFallback: {
    rewrites: [
      { from: /^.*$/, to: `${context}/${moduleName}.html` }
    ]
  },
  proxy: {
    '/query': {
      target: 'http://z.rabbit.com:8888',
      auth: false,
      changeOrigin: true
    },
    '/upload': {
      target: 'http://z.rabbit.com:8888',
      auth: false,
      changeOrigin: true
    }
  }
}
```
<div style='text-align: left'>
🤷‍ 在 webpack.config.prod.babel 中是找不到 devServer 配置的
</div>

[slide]

# 几个关键配置的解析

>* compress：对所有服务启用 gzip 压缩
>* contentBase：静态文件的文件夹地址，即：本地服务器所加载的页面所在的目录
>* historyApiFallback：提供重定向 -- 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。如果使用 rewrites，此行为可进一步地控制 -- 指定的请求应该被指定的页面替代 -- 如果路径能匹配 from，则指向 to 指定的入口html文件。
>* publicPath：将用于确定应该从哪里提供 bundle，此路径下的打包文件可在浏览器中访问。
>* 这几个应该比较熟悉了：
>* hot：热更新 / port：端口 / proxy：代理

## <div style='color: #db4c3f'>在 contentBase 配置中，用到了 Path 模块：</div>

* path.resolve() 方法用于将相对路径转为绝对路径。
* __dirname：当前文件的绝对路径

[slide]

# When It Starts To Run...

```JavaScript
output: { // 出口 让 webpack 把处理完成的文件放在哪里
  path: path.resolve(appPath, 'public'), // 打包输出目录（必选项）
  filename: '[name].bundle.js', // 文件名称
  publicPath: `${context}/`, // 资源上下文路径
},
entry: { // 入口文件 让 webpack 用哪个文件作为项目的入口
  [`${moduleName}`]: ['./client/pages/index.js']
},
```

引用了插件 [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin#configuration) 生成 html：

```JavaScript
const htmlArr = html.map( ( item, i ) => {
  return new HtmlWebpackPlugin({
    filename: item.filename, // `${moduleName}.html`
    template: item.template, // './client/template/template.hbs'
    chunks: item.chunks,
    isDev: true
  })
} )
```

HtmlWebpackPlugin 是用来帮助生成 html 文件的插件，配置在 webpackConfig 的 plugins 里。
服务运行后，会自动生成一个引用了 webpack 输出的 bundle.js 的 html。

[slide style = 'line-height: 50px']

# bundle 和 dll

<div style='text-align: left'>

<div style='color: #db4c3f'>
  Origin Q：template 中，引入 script 的 src 是 '/cached/vendor.dll.js'。output 的 filename 却是 bundle.js？[黑人问号脸?]
</div>

A：这里涉及了 DLLPlugin 和 DLLReferencePlugin，它萌用某种方法实现了拆分 bundles，大大提升了构建的速度。
* 相关的配置需要参考：
* webpack.DllPlugin & webpack.DllReferencePlugin
* 在我们的项目中，配置在了 webpack.config.dll.babel.js 中

🙋推荐参考链接：[Optimizing Webpack](http://engineering.invisionapp.com/post/optimizing-webpack/)
</div>

[slide style = 'line-height: 50px']

# bundle 和 dll -- Page +1

``` JavaScript
// webpack.config.dll.babel.js 中
if (process.env.NODE_ENV === 'development') {
  let dirpath = 'cached'
  export default {
    entry: {
      vendor: options.entry.vendor
    },
    output: {
      path: path.join(__dirname, 'public', `${dirpath}`),
      filename: '[name].dll.js',
      libraryTarget: 'window',
      library: '[name]Library'
    },
    plugins: [new webpack.DllPlugin({
      path: path.join(__dirname, 'public', `${dirpath}`, '[name]-manifest.json'), // 定义 manifest 文件生成的位置
      name: '[name]Library' // dll bundle 输出到那个全局变量上
    })]
  };
} 
```

> * You should end up with a dll\vendor-manifest.json that contains a nice little map to your modules as well as a dist\dll\dll.vendor.js which contains a nicely minified package containing all of your vendor libs.

> * Now all we need to do is add the DLLReferencePlugin and point it at our already built DLL.

webpack.config.dev.babel.js -- webpackConfig.plugins 的配置👇

``` JavaScript
webpackConfig.plugins.push(
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./public/cached/vendor-manifest.json')
  })
);
```

[slide style = 'line-height: 50px']

# bundle 和 dll -- Page +2

<div style='text-align: left'>
最后，还记得 npm run dll 吗？执行命令就在 package.json script 中
</div>
```
dll: cross-env NODE_ENV=development webpack --progress --colors --config webpack.config.dll.babel.js,
```
<div style='text-align: left'>
dll 就此实现了对 bundle 的拆分，实际上，开发模式下，bundle.js 虽然没有被保存，却是存在于服务的内存中的。
</div>

[slide]

# BABEL

### Babel 是一个 JavaScript 编译器。它能通过语法转换器支持最新版本的 JavaScript，这就允许你立刻使用新语法🤩，无需等待浏览器支持。

> 框架里在 package.json 中的 dependencies 已经关联好了 babel，接下来还需要添加一个 .babelrc 文件稍作配置，我们就可以愉快的使用 ES6 了。

[slide]

# 总结下这部分知识点 🙋

* 1、npm start 将执行 webpack-dev-server，在本地启动一个服务
* 2、与 webpack-dev-server 相关的 devServer 的配置
* 3、webpack config 的 entry 和 output
* 4、生成 html 相关插件
* 5、bundle 和 dll：DLLPlugin 和 DLLReferencePlugin 两个插件
* 6、Babel

[slide]

# Practice!

[Coding...](https://github.com/EmilyQiRabbit/CodingRepository/tree/master/Frameworks/WebpackConfig)

[slide]

# 2、Webpack prod



[slide]

# 3、Node Service

## 知识点啊知识点

1、服务启动和基本设置

2、pm2 和 Cluster


[slide]

# 1、服务启动和基本设置

整理了一下我和喆的[大黄蜂-周报系统](https://github.com/EmilyQiRabbit/NodeCode/tree/master/WeeklyReport)，大家有兴趣可以搂一眼。

And 整理后的项目去掉了 _Redux_，感觉很清爽。

[slide]

和单纯的前端 service 不同，此时的 Node 需要提供两方面的服务：

**页面访问的应答 / 前端数据请求的应答**

这两个方面的基础配置基本相同，但路由配置有所差别。

[slide]

# 依旧从 **npm start** 开始 👇

```
"start": "nodemon ./bin/www"
```

> What is nodemon? 

> nodemon will watch the files in the directory in which nodemon was started, and if any **files change**, nodemon will automatically **restart** your node application.

[slide]

# www 

```JavaScript
const http = require('http'); // http 是 Node.js 模块
const app = require('../server');

const server = http.createServer(app);

server.listen(config.port, '0.0.0.0');
```

在服务器中，0.0.0.0 指的是本机上的所有 IPV4 地址。

例如，如果一个主机有两个IP地址，并且该主机上的一个服务监听的地址是 0.0.0.0，那么通过两个 ip 地址都能够访问该服务。 

[slide]

# Server / index.js

该文件基于 Express 完成基础的配置

```JavaScript
const express = require('express');
const app = express();
```

Express 框架建立在 node.js 的 http 模块上。

index 中涉及到了两个重要的 express 方法：**app.use 和 app.set**。

还涉及了几个模块和插件：path、[body-parser](https://github.com/expressjs/body-parser)等等

[slide]

# app.use

use what? 中间件。

它们会根据定义顺序依次调用。**因此，前序的 use 方法必须调用 next()，否则后面的方法将不会被执行。**

---------

Q：说好的 next 呢？！
```JavaScript
app.use(bodyParser.json({limit: '20mb'}));//设置前端post提交最大内容
...
app.use(cookieParser());
```

AnS：作为一个合格的插件插件，是自动包含 next 的！

[slide]

# app.set

index 文件中，仅有一处涉及 set 方法：用来为前端页面设置模版。

框架采用的 hbs，另外还有 ejs 等。

```JavaScript
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
```

设置后，服务会自动读取 views 下的 layout.hbs 作为模版 -- 前端页面渲染的基础。

[slide]

# [body-parser](https://github.com/expressjs/body-parser)

body-parser 用来解析 http 请求

其实，Express 框架是默认就包含了 body-parser 的，因此在框架代码中，也就是又设置了一下 {limit: '20mb'} 参数

----------

_歪楼_推荐大家可以看一看 **express** 的源码，我的心得是：

用的插件比较多但是大多很基础，**原生 JS 出神入化。**

