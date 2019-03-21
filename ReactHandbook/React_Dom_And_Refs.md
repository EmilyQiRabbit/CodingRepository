# React DOM & Refs

## DOM Elements attr: dangerouslySetInnerHTML

> dangerouslySetInnerHTML is React’s replacement for using innerHTML in the browser DOM. In general, setting HTML from code is risky because it’s easy to inadvertently expose your users to a cross-site scripting (XSS) attack. So, you can set HTML directly from React, but you have to type out dangerouslySetInnerHTML and pass an object with a __html key, to remind yourself that it’s dangerous.

dangerouslySetInnerHTML 是在 React 中使用 innerHTML 的方法。但考虑到可能会发生 XSS 攻击，这样做其实是不安全的。

使用方法：

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

## Refs

使用方法：

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Accessing Refs

```js
const node = this.myRef.current;
```

The value of the ref differs depending on the type of the node:

1. When the ref attribute is used on an **HTML element**, the ref created in the constructor with React.createRef() receives the **underlying DOM element** as its current property.

2. When the ref attribute is used on a **custom class component**, the ref object receives the **mounted instance of the component** as its current.

3. You may not use the ref attribute on functional components because they don’t have instances.
