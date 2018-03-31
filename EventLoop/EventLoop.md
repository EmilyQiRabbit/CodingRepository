# EventLoop 和 Microtask

* 源自猫哥的分享 <(=^-^=)>

## 1、EventLoop

### JavaScript 的单线程与 Web Worker

当运行环境是浏览器时，JavaScript 作为浏览器的脚本语言有一个很重要的特性，就是单线程。也就是说，在时间轴这个维度上，JS 只能在处理一段代码。

但是存在一个问题。

当在 HTML 页面中执行 JS 脚本时，页面的状态是不可响应的。
比如页面初次加载时，JS 脚本还在运行的过程中，用户按动页面上的按钮是不会立即触发 click 事件的。因为 JS 是单线程的嘛，JS 还在运行脚本代码，是不会有能力去运行 click 回调函数的代码的。

为此，HTML5 给出了一个解决方案：Web Worker。
Web Worker 允许 JS 代码在后台运行，从而不会影响页面对用户事件的相应。（有个坑，Internet Explorer 不支持 Web Worker[捂脸]）

**第一点要注意的是：**
由于 web worker 位于外部文件中，它们无法访问下例 JavaScript 对象：
* window 对象
* document 对象
* parent 对象

在 [webWorkerDemo.html](webWorkerDemo.html) 和 [webWorkerCode.js](webWorkerCode.js) 中，给出了一个很简单的 webWorker 的栗子。可以下载到本地，然后运行一下。

并不那么顺利是吧，Chrome 会报出错误：Failed to construct 'Worker'.....

What?!

其实这也是 Chrome 处于安全性的考虑，我们 hack 一下就好了。

首先关闭所有的 Chrome 窗口，打开终端并切到存放 EventLoop 文件的目录，输入下面的命令：

```
open -a "Google Chrome" --args --allow-file-access-from-files EventLoop/webWorkerDemo.html
```

好了，可以愉快的继续了。<(=^-^=)>

### 同步任务、异步任务和 EventLoop

为了不让**单线程**的 JS 浪费时间在等待 IO 返回结果上，JS 将这类操作划为异步任务。

与异步任务相对，自然就有同步任务，所有同步任务将会在主线程上执行，并形成一个执行栈。同时，异步任务不会进入主线程，但是当异步任务有了结果的时候（比如 Ajax 有了返回值），它会在一个主线程之外的一个“任务队列”之中放置一个事件。一旦主线程的执行栈中的所有同步任务执行完毕，系统就会去读取这个“任务队列”，把已经有结果的任务放到执行栈里面开始执行。

**只要主线程空了，就会去读取“任务队列”，这就是 JavaScript 的运行机制。**

那么 EventLoop 指的是什么呢？

前面提到，当主线程的执行栈空了以后，就会去读取“任务队列”。
如果发现有准备好了的、可以执行的任务，就放到执行栈里执行。
执行过后，执行栈又空了，然后主线程就又回去读取“任务队列”，看看有没有什么可以做的。
如此循环，就被称为 EventLoop。

值得一题的是，Node.js 也是单线程的，也有 EventLoop。

## 2、Microtask & Macrotask

首先，我们先来看看 microtask 和 macrotask 都包括了那些方法：

* macrotasks: setTimeout, setInterval, setImmediate, I/O, UI rendering
* microtasks: process.nextTick, Promises, Object.observe(废弃), MutationObserver

看了上面这两行，你一定也就知道 microtask 和 macrotask 的大致概念是什么了：就是一堆异步任务嘛～

但是是有区别的。

首先请确保你已经理解了 EventLoop：执行栈执行 -> 栈空 -> 读取异步任务的任务队列 -> 有任务 -> 放入执行栈执行 -> 栈空.....（loop）

所以，microtask 和 macrotask 的区别就在于，它们执行的时机：
如果是 macrotask（很多地方会直接称为 Task），它们会在不同的 EventLoop 中被逐一执行。
如果是 microtask 呢？将会被放在本轮 EventLoop 的末尾，下一个 EventLoop 开始前被执行。也就是，它们不会把准备好的任务放到任务队列里，而是直接挂载到本轮 EventLoop 的末尾。因此，它们会比那些 macrotask 先执行。

一个经典的栗子：

```JavaScript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

结果：
script start
script end
promise1
promise2
setTimeout

结果充分证明了上面的结论很对啊！

哦不过要注意，不同的浏览器运行结果可能会不太一样.....我们以 Chrome 为准，谁让人家[跑分](http://html5test.com)最高呢！

![chromeScore](../imgs/chromeScore.png)

耶～

最后，有一道终极大 boss 题：

```HTML
<div class="outer">
  <div class="inner"></div>
</div>
```

```JavaScript
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
```

结果：
click
promise
mutate
click
promise
mutate
timeout
timeout

做对了？

如果在代码结尾加一句：`inner.click();`？

结果：
click
click
promise
mutate
promise
timeout
timeout

都没做对？[答案在这里](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

这个答案里面有动态演示，非常清楚。

没错，也是我懒得讲了，反正我是懂了～hhhhh