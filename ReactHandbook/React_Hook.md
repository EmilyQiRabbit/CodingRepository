# Hooks

> Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.

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

但是使用 Hooks 了，你就可以将组件里面有用的逻辑抽象出来，并且可以对它进行独立的测试和复用。**并且 Hooks 能让你在不改变组件结构的前提下重用状态相关的逻辑。**这就使得 Hooks 的分享能够非常方便。

### 复杂的组件让人难以理解

新组建的逻辑通常都比较简单，但是慢慢就会变得难以管理，状态逻辑非常混乱，并且还可能会有很多副作用...维护这样的组件非常头疼...这时，每个生命周期方法通常都会包含混杂的不相关的逻辑。例如，组件可能要在 componentDidMount 和 componentDidUpdate 中请求数据。但是，componentDidMount 函数中可能还会包含一些和获取数据没什么关系的逻辑，比如设置事件监听函数。需要一起修改、相互关联的代码被分散开了，而完全无关的代码反而放在了同一个方法中。这就很容易引入问题。

大多数情况下，这些组件也不能拆分更小，因为状态相关的逻辑已经到处都是了。测试同样也很困难。这就是为什么很多人喜欢将 React 和一些分散状态管理的库共同使用。但是，这样又需要引入更多的抽象，需要你在不同文件之间跳转，让组件的复用更加困难。

为了解决这个问题，Hooks 让你能基于那些部分是相关的，将一个组件分散为更小的函数，而不是把这些逻辑分散到不同的生命周期函数中。你也可以选择使用 reducer 来管理组件本地状态，来让状态更加可预期。

### Class 让人和解析器都很迷惑

我们发现，class 可能是学习 React 的一大关卡。我们必须明白 this 在 JS 中是如何工作的，而 this 在 JS 中的工作机理和其他语言都不太一样。你还必须记得绑定事件函数。而且代码可能会非常冗长。人们可能很容易理解 props、state，以及数据流，但是依旧很难理解 class。React 的函数和类组件的区别以及什么时候应该用哪个经常造成分歧，甚至是在很有经验的 React 开发者之间。

另外，就是 class 编译以及热加载的性能都不是很好。有待优化。原文为：

> Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As Svelte, Angular, Glimmer, and others show, ahead-of-time compilation of components has a lot of future potential. Especially if it’s not limited to templates. Recently, we’ve been experimenting with component folding using Prepack, and we’ve seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today’s tools, too. For example, classes don’t minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.

为了解决这些问题，Hooks 让你能在不用 class 的前提下，使用 React 的特性。其实从概念上来讲，React 组件和函数更加相像。Hooks 再次拥抱了函数，同时不必牺牲 React 的任何应用。Hooks 为你提供了 React 的捷径，同时不需要你学习什么复杂的功能或者编程技术。

## Gradual Adoption Strategy

> TLDR: There are no plans to remove classes from React.

## Hooks 概览

### State Hook

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

这里的 `useState` 就是一个 Hook。我们在一个函数组件的内部调用了它，并且为它添加了一个本地状态。React 会在渲染之间存储这个状态。`useState` 会返回一个变量对：当前状态的值，和一个可以改变状态的函数。这个函数和类内部的 this.setState 类似，但是它不会将旧状态和新状态合并。（后面我们会对比 useState 和 this.state）。

`useState` 的唯一的一个参数用来初始化状态，在上面的例子中，也就是 0，因为点击的次数最开始的时候就是 0。和 this.state 不同，这里的 state 并不必须是一个对象 —— 当然如果你希望它就是一个对象，也没问题。最初的 state 值只用于第一次渲染。

#### 声明多个状态变量：

在一个组件内部，你可以使用 state hook 多次：

```js
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

**数组解构**语法让我们可以给使用 useState 声明的状态变量以不同的名字。React 假设，如果你多次使用 useState，你在每次渲染的时候，使用它们的顺序也不变。我们后续会讨论它的工作原理，以及如何有效的使用这个特性。

#### 到底什么是 hook？

hook 就是一个函数，它能让你在函数组件中进入到 React 的状态和生命周期特性中。hook 在 class 中并不能工作 —— 它们是为了让你能不用 class 使用 React 的方式。（我们不建议重写你现在的组件，但是你可以在新的组件中使用 hook。）

React 提供了数个内建的 hook，例如 useState。你也可以创建你自己的 hook，来重用组件间的状态相关的逻辑。我们还是先来学习内建的 hook。

### Effect hook


