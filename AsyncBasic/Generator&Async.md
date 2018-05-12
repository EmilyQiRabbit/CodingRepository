
更多详细内容可见：[阮一峰的 ECMAScript 6 入门](http://es6.ruanyifeng.com)

# Generator

👆 新的异步编程解决方案

## 一个最简单的例子

``` JavaScript
function* aGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var g = aGenerator();
```

**Usage:**

```JS
g.next()
// { value: 'hello', done: false }
g.next()
// { value: 'world', done: false }
g.next()
// { value: 'ending', done: true }
// done 属性的值为 true，表示遍历已经结束。
g.next()
// { value: undefined, done: true }
```

## 为 next 添加参数

```js
function* aGenerator() {
  for(var i = 0; true; i++) {
    var reset = yield i; // reset 可以接收 next 的参数
    if(reset) { i = -1; }
  }
}

var g = aGenerator();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

## for...of 循环

for...of循环可以自动遍历 Generator 函数时生成的 Iterator 对象，不需要调用 next 方法。

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5

// 注意，这里不包括 return 的值
// 因为，一旦 next 方法的返回对象的 done 属性为 true，for...of 循环就会中止，且不包含该返回对象。
```

其他遍历方法：

```js
// 扩展运算符
[...foo()] // [1, 2, 3, 4, 5]

// Array.from 方法
Array.from(foo()) // [1, 2, 3, 4, 5]
```

## yield* 

yield* 用来在 Generator 函数内部调用另一个 Generator 函数。

```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}
```

## 协程和 Generator

**什么是协程：**

"协程"（coroutine），意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下。

* 第一步，协程A开始执行。
* 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
* 第三步，（一段时间后）协程B交还执行权。
* 第四步，协程A恢复执行。

上面流程的协程 A，就是异步任务，因为它分成两段（或多段）执行。

结合 Generator:

```js
function* asyncJob() {
  // ...其他代码
  var f = yield readFile(fileA);
  // ...其他代码
}
```

上面代码的函数 asyncJob 是一个协程，它的奥妙就在其中的 yield 命令。
它表示执行到此处，执行权将交给其他协程。也就是说，yield 命令是异步两个阶段的分界线。
协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。
它的最大优点，就是代码的写法非常像同步操作，如果去除 yield 命令，简直一模一样。

# Async

async 函数就是 Generator 函数的语法糖。

``` js
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// 写成 async 就是 👇

const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await。
```

当函数执行的时候，一旦遇到 await 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。