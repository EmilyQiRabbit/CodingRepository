> * Title：前端面经不完全总结：JS 篇
> * Author：[EmilyQiRabbit 🙋 旺财](https://github.com/EmilyQiRabbit)
> * Links:
>      * [HTML篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/html.md)
>      * [CSS篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/css.md)
>      * [JS篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/js.md)
>      * [NetWork篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/network.md)

js 部分信息量比较大啊...毕竟重头戏

# 1、排序算法



# 2、动态规划

动态规划算法的核心就是：**记住已经解决过的子问题的解**。

这里有个很通俗的例子：

> A1 : 1+1+1+1+1+1+1+1 = ?
> A1 : 等式的值是多少？
> B2 : *计算* 8！
> A1 : 在上面等式的左边写上 "1+"
> A1 : 此时等式的值为多少？
> B2 : *quickly* 9！
> A1 : 你怎么这么快就知道答案了？
> B2 : 只要在8的基础上加1就行了。
> 所以你不用重新计算，因为你记住了第一个等式的值为8！动态规划算法也可以说是：'记住求过的解来节省时间'。

## 动态规划算法的两种形式

动态规划算法的核心是**记住已经求过的解**，那么，记住求解的方式有两种：**自顶向下**和**自底向上**。 

为了说明这两种方法，举一个最简单的例子：求斐波拉契数列Fibonacci。

### 自顶向下法（设立备忘录 Memo）

```java
public static int Fibonacci(int n)
{
  if(n<=0)
    return n;
  int []Memo=new int[n+1];        
  for(int i=0;i<=n;i++)
    Memo[i]=-1;
  return fib(n, Memo);
}

public static int fib(int n,int []Memo)
{
  if(Memo[n]!=-1)
    return Memo[n];
    // 如果已经求出了 fib(n) 的值直接返回，否则将求出的值保存在 Memo 备忘录中。               
  if(n<=2)
    Memo[n]=1;
  else Memo[n]=fib(n-1,Memo)+fib(n-2,Memo);
  return Memo[n];
}
```

### 自底向上

自顶向下法还是利用了递归。而自底向上的思路则是：不管怎样，计算 fib(6) 的时候最后还是要计算出fib(1)，fib(2)，fib(3)...那么何不先计算出fib(1)，fib(2)，fib(3)...呢？这也就是动态规划的核心 -- **先计算子问题，再由子问题计算父问题**。

```java
public static int fib(int n)
{
  if(n<=0)
    return n;
  int []Memo=new int[n+1];
  Memo[0]=0;
  Memo[1]=1;
  for(int i=2;i<=n;i++)
  {
    Memo[i]=Memo[i-1]+Memo[i-2];
  }       
  return Memo[n];
}
```


小节内容选自 [CSDN 博客](https://blog.csdn.net/u013309870/article/details/75193592)。原文比较深入，上文仅是最简单的概念说明。

# 3、事件委托

事件委托就是利用冒泡的原理，把事件的监听加到父级元素元素上，触发执行效果。

例如：

```js
var btn = document.getElementById("btn");
document.onclick = function(event){
  event = event || window.event;
  var target = event.target || event.srcElement;
  if(target === btn){
    alert(btn.value);
    ...
  }
}
```

为什么选用事件委托：

1. 事件委托可以显著的提高事件的处理速度，减少内存的占用

2. 动态的添加 DOM 元素，不需要因为元素的改动而修改事件绑定。

# 4、this 的绑定规则

**每个函数的 this 是在调用时被绑定的，完全取决于函数的调用位置。寻找 this，就是寻找调用位置，也就是寻找“函数被调用的位置”。**

## 1）默认绑定

默认绑定时，this 指向全局对象。

```js
function foo() { 
    console.log( this.a );
}
var a = 2; 
foo(); // 2
```

分析一下代码能发现：在代码中，foo() 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。

如果使用严格模式(strict mode)，那么全局对象将无法使用默认绑定，因此 this 会绑定到 undefined。

## 2）隐式绑定

```js
function foo() { 
    console.log( this.a );
}
var obj = { 
    a: 2,
    foo: foo 
};
obj.foo(); // 2
```

首先需要注意的是 `foo()` 的声明方式，及其之后是如何被当作引用属性添加到 obj 中的。 
但是无论是直接在 obj 中定义还是先定义再添加为引用属性，这个函数严格来说都不属于 obj 对象。

然而，调用位置会使用 obj 上下文来引用函数，因此你可以说**函数被调用时** obj 对象“拥有”或者“包含”它。

无论你如何称呼这个模式，当 `foo()` 被调用时，它的落脚点确实指向 obj 对象。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。因为调用 `foo()` 时 this 被绑定到 obj，因此 `this.a` 和 `obj.a` 是一样的。

⚠️需要注意：**隐式丢失**

```js
function foo() { 
    console.log( this.a );
}
var obj = { 
    a: 2,
    foo: foo 
};
var bar = obj.foo; // 函数别名!
var a = "oops, global"; // a是全局对象的属性 
bar(); // "oops, global"
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的 bar() 其实是一个**不带任何修饰的函数调用**，因此应用了默认绑定。

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时:

```js
function foo() { 
  console.log( this.a );
}
function doFoo(fn) {
  // fn其实引用的是foo 
  fn(); // <-- 调用位置!
}
var obj = { 
  a: 2,
  foo: foo 
};
var a = "oops, global"; // a是全局对象的属性 
doFoo( obj.foo ); // "oops, global"
```

参数传递其实就是一种**隐式赋值**，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样。

## 3）显式绑定

方法：使用 `call(..)` 和 `apply(..)`。

这两个方法是如何工作的呢？它们的第一个参数是一个对象，它们会把这个对象绑定到 this，接着在调用函数时指定这个 this。因为你可以直接指定 this 的绑定对象，因此我们称之为显式绑定。

```js
function foo() { 
    console.log( this.a );
}
var obj = { 
    a:2
};
foo.call( obj ); // 2 -> 相当于 foo 函数中的所有 this 都指的 obj
```

可惜，显式绑定仍然无法解决我们之前提出的丢失绑定问题。

但是显式绑定的一个变种可以解决这个问题，那就是硬绑定：

```js
function foo() { 
    console.log( this.a );
}
var obj = { 
    a:2
};
var bar = function() { 
    foo.call( obj );
};
bar(); // 2
setTimeout( bar, 100 ); // 2
// 硬绑定的 bar 不可能再修改它的 this 
bar.call( window ); // 2
```

此时，无论之后如何调用函数 bar，它总会手动在 obj 上调用 foo。这种绑定是一种显式的强制绑定，因此我们称之为硬绑定。

由于硬绑定是一种非常常用的模式，所以在 ES5 中提供了内置的方法 Function.prototype.bind：

```js
function foo(something) { 
    console.log( this.a, something ); 
    return this.a + something;
}
var obj = { 
    a:2
};
var bar = foo.bind( obj );
var b = bar( 3 ); // 2 3 
console.log( b ); // 5
```

## 4）new 绑定

JavaScript 的 new 操作符，使用方法看起来和那些面向类的语言一样。所以绝大多数开发者都认为 JavaScript 中 new 的机制也和那些语言一样。然而，JavaScript 中 new 的机制实际上和面向类的语言**完全不同**。

首先我们重新定义一下 JavaScript 中的“构造函数”。在 JavaScript 中，构造函数只是一些使用 new 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特殊的函数类型，**它们只是被 new 操作符调用的普通函数而已**。

这里有一个重要但是非常细微的区别：**实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”**。

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建(或者说构造)一个全新的对象。
2. 这个新对象会被执行[[原型]]连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

```js
function foo(a) { 
    this.a = a;
}
var bar = new foo(2); 
console.log( bar.a ); // 2
```

使用 new 来调用 `foo(..)` 时，我们会构造一个新对象并把它绑定到 `foo(..)` 调用中的 this 上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定。

# 5、作为语法糖，Async 是如何封装 Generator 的

async 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里。

```js
async function fn(args){
  // ...
}

// 等同于

function fn(args){ 
  return spawn(function*() { // spawn 函数就是自动执行器。
    // ...
  }); 
}
```

spawn 函数的实现：

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    var gen = genF();
    function step(nextF) { // 递归调用
      try {
        var next = nextF();
      } catch(e) {
        return reject(e); 
      }
      if(next.done) {
        return resolve(next.value);
      } 
      // The Promise.resolve(value) method returns a Promise object that is resolved with the given value.
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });      
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

# 6、PWA



# 7、关系型数据库/非关系型数据库

## 关系型数据库

关系型数据库，是指采用了**关系模型**来组织数据的数据库。关系模型指的就是**二维表格模型**，而一个关系型数据库就是由二维表及其之间的联系所组成的一个数据组织。

关系型数据库的两个优势：事务一致性、读写实时性。然而这两点，在现代 web 中，其实并没有那么重要。

**关系型数据库瓶颈**

1. 高并发读写需求：网站的用户并发性非常高，往往达到每秒上万次读写请求，对于传统关系型数据库来说，硬盘 I/O 是一个很大的瓶颈
2. 海量数据的高效率读写：网站每天产生的数据量是巨大的，对于关系型数据库来说，在一张包含海量数据的表中查询，效率是非常低的
3. 高扩展性和可用性：在基于web的结构当中，数据库是最难进行横向扩展的，当一个应用系统的用户量和访问量与日俱增的时候，数据库却没有办法像 web server 和 app server 那样简单的通过添加更多的硬件和服务节点来扩展性能和负载能力。对于很多需要提供24小时不间断服务的网站来说，对数据库系统进行升级和扩展是非常痛苦的事情，往往需要停机维护和数据迁移。

## 非关系型数据库

**分类**

1. 面向高性能**并发读写**的 key-value 数据库：key-value 数据库的主要特点即使具有极高的并发读写性能，**Redis, Tokyo Cabinet, Flare** 就是这类的代表。
2. 面向海量数据访问的面向文档数据库：这类数据库的特点是，可以在海量的数据中**快速的查询**数据，典型代表为 MongoDB 以及 CouchDB。（*文档型数据库可以看作是键值数据库的升级版，一般用类似 json 的格式存储。*）
3. 其他还有，图形数据库、列存储（Column-oriented）数据库等等。

# 8、懒加载/分块加载的实现
