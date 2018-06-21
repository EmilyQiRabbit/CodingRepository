# Lodash Note

## sortBy advanced: 第 2 参数

```js
const array = [
  { name: '1' }, 
  { name: '2' }, 
  { name: '3' },
  { name: '4' }, 
  { name: '5' }, 
  { name: '6' }, 
  { name: '7' }, 
  { name: '8' }, 
]
const sortedArray = sortBy(array, [obj => obj.name !== '3', obj => obj.name !== '6'])
console.log(sortedArray)
```

console 结果：

```js
[Object, Object, Object, Object, Object, Object, Object, Object]
0: Object
 name: "3"
 __proto__: Object
1: Object
 name: "6"
 __proto__: Object
2: Object
 name: "1"
 __proto__: Object
3: Object
 name: "2"
 __proto__: Object
4: Object
 name: "4"
 __proto__: Object
5: Object
 name: "5"
 __proto__: Object
6: Object
 name: "7"
 __proto__: Object
7: Object
 name: "8"
 __proto__: Object
```

## memoize

创建一个会缓存 func 结果的函数。 如果提供了 resolver，就用 resolver 的返回值作为 key 缓存函数的结果。 默认情况下用第一个参数作为缓存的 key。 func 在调用时 this 会绑定在缓存函数上。 

> 注意: 缓存会暴露在缓存函数的 cache 上。 它是可以定制的，只要替换了 _.memoize.Cache 构造函数，或实现了 Map 的 delete， get， has， 以及 set方法。

**信息量略大...撸串代码试一试才能懂～**

```js
const memoryFunc = memoize((a, b) => {
  return a*b
})
```

此时的缓存函数，结果的 key 是默认的第一个参数，因此会有如下输出：

```js
console.log(memoryFunc(1937, 3)) // 5811
console.log(memoryFunc(1937, 5)) // 5811
console.log(memoryFunc(2, 8))    // 16
console.log(memoryFunc(52, 1))   // 52
```

第一个参数相同的，之后就会被以相同的 key 缓存，因此 `memoryFunc(1937, 5)` 的输出和 `memoryFunc(1937, 3)` 一样。

如果设置 memoize 的第二个参数：

```js
const memoryFunc = memoize((a, b) => {
  return a*b
}, () => {
  return 'memory1'
})
```

那么结果就成了：

```js
console.log(memoryFunc(1937, 3)) // 5811
console.log(memoryFunc(1937, 5)) // 5811
console.log(memoryFunc(2, 8))    // 5811
console.log(memoryFunc(52, 1))   // 5811
```

所有结果都以 memory1 为 key 缓存了，所以结果都一样。

这样可以看到缓存：

```js
console.log(memoryFunc.cache)
```
