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
