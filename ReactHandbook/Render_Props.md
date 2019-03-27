# Render Props

这个方法可以帮助你在 React 组件之间复用代码，方法是使用一个名为 render 的 props，而这个 render props 对应的值是一个函数。

🌰栗子：

```js
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

## 解决交叉问题

虽然组件是 React 中的最小复用单位，但是如何复用组件内部的状态和行为，却并没有很好的方法。

例如，下面这个组件的功能是，追踪鼠标的位置：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

问题是，我们怎么能在其他组件里复用这种追踪鼠标的行为呢？

解决的方法就是，我们把 render 部分放到外面去，提供给 Mouse 组件一个值为函数的 prop，然后组件在内部调用这个函数，完成渲染。这样，handleMouseMove 这部分就完成了复用。

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

总之就是，共用逻辑（handleMouseMove）提取到一个专门的组件里（Mouse），而组件渲染的内容，则由外部传入的 render props 决定。官网原文为：

> More concretely, a render prop is a function prop that a component uses to know what to render.

## 注意

当和 React.PureComponent 一起使用 Render Props 的时候要注意，它可能会让 PureComponent 的优势消失。

因为这时，props 的浅对比总是会由于 render prop 的存在而返回 false，每次渲染也都会对应一个新的值。

> React.PureComponent is similar to React.Component. The difference between them is that React.Component doesn’t implement shouldComponentUpdate(), but React.PureComponent implements it with a **shallow prop and state comparison**.

