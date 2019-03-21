# Hooks

Hooks 能让开发者在不用类的前提下，依旧能使用 state 和其他 React 的特性。

例如：

```js
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

这个 `useState` 方法就是我们接触到的第一个 Hook。

下面将介绍为什么要为 React 添加 Hooks，以及它将如何帮助你编写更好的应用。

## Hooks 没有任何不兼容的修改

> Before we continue, note that Hooks are:
> * Completely opt-in. You can try Hooks in a few components without rewriting any existing code. But you don’t have to learn or use Hooks right now if you don’t want to.
> * 100% backwards-compatible. Hooks don’t contain any breaking changes.
> * Available now. Hooks are now available with the release of v16.8.0.

> Hooks don’t replace your knowledge of React concepts. Instead, Hooks provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle. As we will show later, Hooks also offer a new powerful way to combine them.

## 引入 Hooks 的动机是...

Hooks 解决了很多 React 中不连贯的问题，不管你是不是学过 React，或者你其实更偏向其他一些组件模块的库，你都可能会遇到这样的问题：

### 组件之间想要重复使用状态相关的逻辑太困难了

React 没有办法将一个可复用的行为“附加”到组件上（比如，将组件连接到 store ）。如果你已经使用 React 一段时间了，你应该很熟悉例如：`render props` 以及 `hoc` 这样的模式，这些模式其实都是在试图解决这个问题。但是这些模式都需要你修改组件的结构，这可能让代码变得笨重并且难以模仿。如果你在浏览器的 React devtools 里查看一个典型的 React 应用，你很可能会看到一个“包裹地狱” —— 一个组件被好多层的 providers，consumers，hoc，render props 等包裹。虽然我们可以使用 [devtools](https://github.com/facebook/react-devtools/pull/503) 把这些包裹层都去掉，但是这并没有解决本质的问题：React 需要一种更好的机制，来共享状态相关的逻辑。



### 复杂的组件让人难以理解

### Class 让人和解析器都很迷惑


## Gradual Adoption Strategy

> TLDR: There are no plans to remove classes from React.
