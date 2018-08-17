# React Portals

Portals 提供了一种：可以在当前父组件的 DOM 层级结构之外的 DOM 元素中渲染子元素的方式。

它的语法结构为：

```js
ReactDOM.createPortal(child, container)
```

其中，child 是任意可渲染的 React 元素，container 则是一个 DOM 元素。

## Portals 的应用

通常情况下，如果我们在 React 组件的 render 方法中返回一个元素，它就会在最近的父级组件上挂载并渲染为某 DOM 元素。

```js
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

但是，有时候我们却需要将子组件渲染到另外一个 DOM 中去。

```js
render() {
  // React 将 children 渲染到了 domNode 中
  // domNode 可以是任意位置的 DOM 节点
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

一个非常典型的应用就是，父级组件有：overflow: hidden 或者 z-index 的样式，而我们需要子元素打破这种限制。比如说 dialogs, hovercards, tooltips 等等。

## 事件冒泡

尽管 Portal 元素可以在 DOM 树的任意位置，但是其他方面，它却和普通的 React 元素的表现一致。原因是，不管 Portal 所在的 DOM 元素的层级关系如何，Portal 依旧存在于原来的 React tree 之中。

包括冒泡事件也是一样的道理。Portal 触发的事件将会沿着 React 树向上传递，而无视它所在的 DOM 结构。

这种设计的原因是：允许在开发过程中，不需要内在的依赖于 portals。因为不管元素是通过什么方式渲染的，它的父级元素总可以捕捉到冒泡的事件。
