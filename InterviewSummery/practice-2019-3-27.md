# 面试题总结

## 编程题

### 1. 判断树中的路径是否存在：

```js
var hasPathSum = function(root, sum) {
    const result = false
    let dfs = function(node, current) {
        if (!node) {
            return
        }
        // 判断
        if (!node.left && !node.right && current + node.value === sum) {
            result = true
        } else {
            dfs(node.left, current + node.value)
            dfs(node.right, current + node.value)
        }
    }
    dfs(root, 0)
    return result
}
```

### 2. 正则，一堆正则...不会用，抓狂

## 简答题

### 1. 解释下 JavaScript 原型链是什么东东

*  `__proto__` 是用来在原型链上查找你需要的方法的实际对象，所有的对象都有这个属性。这个属性被 JavaScript 引擎用作继承使用。

*  `prototype` 是函数独有的属性。当我们使用关键词 new 并且将函数作为构造函数来构造对象的时候, 它被用来构建对象的 `__proto__`属性。

*  `__proto__` 属性和 `prototype` 属性都指向的一个对象。

*  `(new A()).__proto__ === A.prototype` 的结果为 true，`(new A()).prototype === undefined` 的结果也为 true，其中 A 表示一个函数（也就是构造函数）。

### 2. window.loaded 和 dom.loaded 的区别

栗子 🌰：

```js
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
});
// 以及...
document.addEventListener('DOMContentLoaded',function(){
    console.log('3 seconds passed');
});
```

> 1. dom.loaded：当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。

> 2. window.loaded：The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets images. This is in contrast to DOMContentLoaded, which is fired as soon as the page DOM has been loaded, without waiting for resources finish loading

所以是 DOMContentLoaded 先触发，window.loaded 后触发。

### 3. CSS flex（又一个记了忘忘了记系列）

🔗：http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

### 4. Array.prototype.reduce

> reduce() 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其简化为单个值。

reduce()，归并操作，总共两个参数，第一个是函数，可以理解为累加器，遍历数组累加回传的返回值，第二个是初始数值。如果没有提供初始值，则将使用数组中的第一个元素。

```js
const arr = [1, 2, 3, 4]
const total = arr.reduce((accumulator, num) => { 
  return accumulator + num; 
}, 0);
console.log(totalyears);
```

### 5. 跨域问题

参考：[不要再问我跨域的问题了](https://segmentfault.com/a/1190000015597029)

#### 浏览器的同源策略

[官方定义：](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)

> The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin. 

> It helps isolate potentially malicious documents, reducing possible attack vectors.

总之，是**浏览器**限制了这种行为。这是浏览器的一种安全机制。可以防止非同源的接口访问以及 DOM 查询。总之，这是为了你好哦～

#### 解决方案一：JSONP

在 HTML 标签里，一些标签比如 script、img 这样的获取资源的标签是没有跨域限制的。

利用这个小小的破绽，我们可以：

```js
// 后端代码：
static async jsonp (ctx) {
  // 前端传过来的参数
  const query = ctx.request.query
  // 设置一个 cookies
  ctx.cookies.set('tokenId', '1')
  // query.cb 是前后端约定的方法名字，其实就是后端返回一个直接执行的方法给前端，由于前端是用 script 标签发起的请求，所以返回了这个方法后相当于立马执行，并且把要返回的数据放在方法的参数里。
  ctx.body = `${query.cb}(${JSON.stringify(successBody({msg: query.msg}, 'success'))})`
}
```

前端代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <script type='text/javascript'>
      // callback
      window.jsonpCb = function (res) {
        console.log(res)
      }
    </script>
    <script src='http://localhost:8000/api/jsonp?msg=helloJsonp&cb=jsonpCb' type='text/javascript'></script>
  </body>
</html>
```

这种跨域的方式只能发送 GET，如果想发送 POST 请求。。。

#### 解决方法二：iframe + form

```js
const requestPost = ({url, data}) => {
  // 首先创建一个用来发送数据的 iframe。
  const iframe = document.createElement('iframe')
  iframe.name = 'iframePost'
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  const form = document.createElement('form')
  const node = document.createElement('input')
  // 注册 iframe 的 load 事件处理程序，如果你需要在响应返回时执行一些操作的话。
  iframe.addEventListener('load', function () {
    console.log('post success')
  })

  form.action = url
  // 在指定的 iframe 中执行 form
  form.target = iframe.name
  form.method = 'post'
  for (let name in data) {
    node.name = name
    node.value = data[name].toString()
    form.appendChild(node.cloneNode())
  }
  // 表单元素需要添加到主文档中
  form.style.display = 'none'
  document.body.appendChild(form)
  form.submit()

  // 表单提交后，就可以删除这个表单，不影响下次的数据发送
  document.body.removeChild(form)
}
// 使用方式
requestPost({
  url: 'http://localhost:8000/api/iframePost',
  data: {
    msg: 'helloIframePost'
  }
})
```

#### 解决方案三：CORS

CORS 是一个 W3C 标准，全称是“跨域资源共享”（Cross-origin resource sharing）跨域资源共享 CORS 详解。看名字就知道这是处理跨域问题的标准做法。CORS 有两种请求，简单请求和非简单请求。

CORS 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE 浏览器不能低于 IE10。

整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与。**对于开发者来说，CORS 通信与同源的 AJAX 通信没有差别，代码完全一样**。浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

#### 解决方案四：跨域 DOM 查询的正确方式：postMessage

`window.postMessage()` 是 HTML5 的一个接口，专注实现不同窗口不同页面的跨域通讯。

消息发送：

```html
<template>
  <div>
    <button @click="postMessage">发消息</button>
    <iframe name="crossDomainIframe" src="http://crossdomain.com:9099"></iframe>
  </div>
</template>

<script>
export default {
  mounted () {
    window.addEventListener('message', (e) => {
      // 这里一定要对来源做校验
      if (e.origin === 'http://crossdomain.com:9099') {
        // 来自 http://crossdomain.com:9099 的结果回复
        console.log(e.data)
      }
    })
  },
  methods: {
    // 向 http://crossdomain.com:9099 发消息
    postMessage () {
      const iframe = window.frames['crossDomainIframe']
      iframe.postMessage('我是[http://localhost:9099], 麻烦你查一下你那边有没有id为app的Dom', 'http://crossdomain.com:9099')
    }
  }
}
</script>
```

消息接收方：

```html
<template>
  <div>
    我是http://crossdomain.com:9099
  </div>
</template>

<script>
export default {
  mounted () {
    window.addEventListener('message', (e) => {
      // 这里一定要对来源做校验
      if (e.origin === 'http://localhost:9099') {
        // http://localhost:9099发来的信息
        console.log(e.data)
        // e.source 可以是回信的对象，其实就是 http://localhost:9099 窗口对象(window)的引用
        // e.origin 可以作为 targetOrigin
        e.source.postMessage(`我是[http://crossdomain.com:9099]，我知道了兄弟，这就是你想知道的结果：${document.getElementById('app') ? '有id为app的Dom' : '没有id为app的Dom'}`, e.origin);
      }
    })
  }
}
</script>
```

### 6. http/https 的区别
