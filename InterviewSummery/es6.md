# es6 重点总结

## let 和 const

### 不存在变量提升

var命令会发生「变量提升」现象，即变量可以在声明之前使用，值为 undefined。这种现象多多少少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后才可以使用。

为了纠正这种现象，let 命令改变了语法行为，**它所声明的变量一定要在声明后使用，否则报错**。

```js
// var 的情况
console.log(foo); // 输出 undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错 ReferenceError
let bar = 2;
```

### deadzone -- 暂时性死区 (*)

只要块级作用域内存在 let 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```js
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

上面代码中，存在全局变量 tmp，但是块级作用域内 let 又声明了一个局部变量tmp，导致后者绑定这个块级作用域，所以在 let 声明变量前，对 tmp 赋值会报错。

ES6 明确规定，如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用 let 命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

```js
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```

上面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”。

“暂时性死区”也意味着typeof不再是一个百分之百安全的操作。

### 块级作用域

let 实际上为 JavaScript 新增了块级作用域。

## 变量的解构赋值

ES6 允许按照一定**模式**，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

### 数组的解构赋值

```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

### 对象的解构赋值

栗子1:

```js
let { foo, bar } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"
```

注意，实际上，对象的解构赋值是下面形式的简写：

```js
let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };
```

也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

```js
let { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined
```

上面代码中，foo 是匹配的模式，baz 才是变量。真正被赋值的是变量 baz，而不是模式 foo。

更详细请见[阮一峰博客](http://es6.ruanyifeng.com/#docs/destructuring)

## 函数的扩展

**最容易考的就是箭头函数和 this 的关系**。

### 箭头函数 (*)

箭头函数有几个使用注意点。

（1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

（2）不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误。

（3）不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

上面四点中，第一点尤其值得注意。**this 对象的指向是可变的，但是在箭头函数中，它是固定的**。

## Set & Map

### Set

它类似于数组，但是成员的值都是唯一的，没有重复的值。

```js
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

**Set 结构的实例有以下属性**。

* Set.prototype.constructor：构造函数，默认就是Set函数。
* Set.prototype.size：返回Set实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

* add(value)：添加某个值，返回 Set 结构本身。
* delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
* has(value)：返回一个布尔值，表示该值是否为Set的成员。
* clear()：清除所有成员，没有返回值。

Set 结构的实例有四个遍历方法，可以用于遍历成员。

* keys()：返回键名的遍历器
* values()：返回键值的遍历器
* entries()：返回键值对的遍历器
* forEach()：使用回调函数遍历每个成员

### WeakSet

区别：

1. WeakSet 的成员**只能是对象**，而不能是其他类型的值。

2. 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，**不考虑**该对象还存在于 WeakSet 之中。

### Map

它类似于对象，也是键值对的集合，但是“键”的范围**不限于字符串**，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

```js
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如 0 和 -0 就是一个键，布尔值 true 和字符串 true 则是两个不同的键。另外，undefined 和 null 也是两个不同的键。虽然 NaN 不严格相等于自身，但 Map 将其视为同一个键。

###WeakMap

WeakMap与Map的区别有两点。

1. 首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。

2. 它的键名所引用的对象都是弱引用，**即垃圾回收机制不将该引用考虑在内**。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

## Eventloop

[Eventloop 的讲解传送门](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/EventLoop/EventLoop.md)

## Generator

基本用法：

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }

```

## async

## class

## decorator

decorator 即修饰器。用来修改类的行为。目前，有一个提案将这项功能，引入了 ECMAScript。

例子：

```js
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true
```

上面代码中，@testable 就是一个修饰器。它修改了 MyTestableClass 这个类的行为，为它加上了静态属性 isTestable。testable 函数的参数 target 是 MyTestableClass 类本身。

基本上，修饰器的行为就是下面这样。

```js
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

也就是说，修饰器是一个对类进行处理的函数。修饰器函数的第一个参数，就是所要修饰的目标类。

修饰器还可以修饰类的属性

```js
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}

// 修饰器函数 readonly 一共可以接受三个参数。
// 修饰器第一个参数是类的原型对象，上例是 Person.prototype，修饰器的本意是要“修饰”类的实例，但是这个时候实例还没生成，所以只能去修饰原型（这不同于类的修饰，那种情况时target参数指的是类本身）
// 第二个参数是所要修饰的属性名
// 第三个参数是该属性的描述对象。

function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);
```

另一个例子：@log 修饰器，可以起到输出日志的作用。

```js
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```

注意，修饰器只能用户类和类的方法，不能用于函数。因为函数存在提升。导致修饰器无法生效。

但是，类不存在提升的问题。

## apply & call 和 bind

[戳这里](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/js.md#显式绑定)

---------------

## Promise

重点：

* promise 有 3 种状态：pending、fulfilled 或 rejected。状态改变只能是 pending->fulfilled 或者 pending->rejected，**状态一旦改变则不能再变**。

* promise 每次调用 .then 或者 .catch 都会返回一个新的 promise，从而实现了链式调用。

* then 函数中因为返回任意一个非 promise 的值都会被包裹成 promise 对象，即 `return new Error('error!!!')` 等价于 `return Promise.resolve(new Error('error!!!'))`。

* 解释：.then 或 .catch 返回的值**不能是 promise 本身**，否则会造成死循环。

* 解释：.then 可以接收两个参数，第一个是处理成功的函数，第二个是处理错误的函数。.catch 是 .then 第二个参数的简便写法，但是它们用法上有一点需要注意：.then 的第二个处理错误的函数捕获不了第一个处理成功的函数抛出的错误，而后续的 .catch 可以捕获之前的错误。

* **process.nextTick 和 promise.then 都属于 microtask，而 setImmediate 属于 macrotask，在事件循环的 check 阶段执行。事件循环的每个阶段（macrotask）之间都会执行 microtask，事件循环的开始会先执行一次 microtask。**

### Why promise

with promise vs without promise:

```js
请求1(function(请求结果1){
    请求2(function(请求结果2){
        请求3(function(请求结果3){
            请求4(function(请求结果4){
                请求5(function(请求结果5){
                    请求6(function(请求结果3){
                        ...
                    })
                })
            })
        })
    })
})

/**
 * 代码臃肿。
 * 可读性差。
 * 只能在回调里处理异常。
 * 耦合度过高，可维护性差。
 * 代码复用性差。
 * 容易滋生 bug。
 * 总之就是各种烦...不友好，简直反人类...
*/

// with promise!

new Promise(请求1)
    .then(请求2(请求结果1))
    .then(请求3(请求结果2))
    .then(请求4(请求结果3))
    .then(请求5(请求结果4))
    .catch(处理异常(异常信息))

```

### 几个重要 API

#### Promise.resolve()

Promise.resolve 将现有对象转为 Promise 对象。

1. 参数是一个 Promise 实例

如果参数是 Promise 实例，那么 `Promise.resolve` 将**不做任何修改、原封不动**地返回这个实例。

2. 参数是一个 thenable 对象

`Promise.resolve` 方法会将这个对象转为 Promise 对象，然后就立即执行 thenable 对象的 then 方法。(所以其实返回的这个 Promise 对象就是一个状态为 **resolved** 的 Promise 对象)

3. 参数不是具有 then 方法的对象，或根本就不是对象

如果参数是一个原始值，或者是一个不具有 then 方法的对象，则 `Promise.resolve` 方法返回一个新的 Promise 对象，状态为 **resolved**。

Promise.resolve方法的参数，会同时传给回调函数

4. 不带有任何参数

Promise.resolve 方法允许调用时不带参数，直接返回一个 **resolved** 状态的 Promise 对象。

所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用 Promise.resolve 方法。

#### Promise.reject()

Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
```

#### Promise.prototype.then() / .catch() / .finally()

#### Promise.all() / .race()

race：类方法，多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败。

all：类方法，多个 Promise 任务同时执行。
如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

#### Promise 练习题

1. Promise 构造函数是同步执行的，promise.then 中的函数是异步执行的。

```js
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})
promise.then(() => {
  console.log(3)
})
console.log(4)

// 结果：
// 1
// 2
// 4
// 3
```

