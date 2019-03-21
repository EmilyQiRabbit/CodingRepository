# Higher-Order Components

HOC 是 React 的一种可以**复用组件逻辑或者方法**的技术。严格说来它其实并不是 React API 的一种，而只是一种适用于 React 组件的**模式**。

HOC 本质其实就是一个函数，它以一个组件作为参数，并返回另一个组件。也就是，**高阶组件将一个组件转化为另一个组件**。

## 使用 HOC 解决交叉问题

在 React 中，组件是代码复用的主要单元。然而你会发现，一些模式并不适用传统的组件。

例如，假设你有一个 CommentList 组件，该组件从外部数据源订阅数据，并渲染评论列表：

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" 是一个全局数据源
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // 订阅
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // 数据变化的时候更新组件
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

然后，你又写了一个订阅博客文章的组件，该组件遵循和 CommentList 类似的模式：

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

这两个组件并不完全相同，它们调用了 DataSource 不同的方法，并且渲染的内容也不同。但是，它们之间还是有很多相似之处：

* 挂载组件时， 向 DataSource 添加一个监听函数。

* 在监听函数内， 每当数据源发生变化，都是调用 setState 函数设置新数据。

* 卸载组件时， 移除监听函数。

那么在大型的应用中，很多组件都遵从这样的逻辑的时候，我们就可以抽象出一个模式。

该模式允许我们在一个地方定义逻辑，并能对任意组件使用：这就是高阶组件的精华所在。

我们可以写一个方法来创建像 BlogPost 和 CommentList 这样的组件 —— 它们都需要订阅 DataSource 的数据。我们就称它为：withSubscription：

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

当 CommentListWithSubscription 和 BlogPostWithSubscription 渲染时, 会向CommentList 和 BlogPost 传递一个 data 属性，该 data 属性的数据包含了从 DataSource 检索的最新数据：

```js
// 函数接受一个组件作为参数
function withSubscription(WrappedComponent, selectData) {
  // 并返回另一个新组件
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // 订阅数据
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // 使用最新的数据渲染组件
      // 注意此处将已有的 props 属性传递给原组件
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

注意，HOC 不会修改作为参数的 WrappedComponent 组件，也不会继承或者复制它的行为。

高阶组件是通过将原组件包裹（wrapping）在容器组件（container component）里面的方式来组合（composes）使用原组件。

**高阶组件就是一个没有副作用的纯函数**。

WrappedComponent 接收容器组件的所有 props 属性以及一个新的 data 属性，并用 data 属性渲染输出内容。**高阶组件不需要关心数据是如何以及为什么被使用，而WrappedComponent 也不需要关心数据来自何处**。

## 不要修改原始组件，而要使用组合的方式

不要在 HOC 内部修改组件的 prototype。

这是一个**错误**的例子：

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

这样更改高阶组件就会损失了组件的抽象性。正确的方法应该是，使用一个新的组件包裹 InputComponent：

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // 用容器组件组合包裹组件且不修改包裹组件，这才是正确的打开方式。
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

## 代码习惯：将不相关的 Props 传递到 WrappedComponent

高阶组件给 WrappedComponent 组件添加新属性。但是同时，他们不应该大幅修改原组件的 props 属性。所以。我们期望从高阶组件返回的组件与原包裹的组件具有类似的接口。

也就是，WrappedComponent 本身的属性不能因为高阶组件丢失。

一个高阶组件的 render 函数：

```js
render() {
  // 过滤掉与高阶函数功能相关的 props 属性，
  // 不再传递
  const { extraProp, ...passThroughProps } = this.props;

  // 向包裹组件注入props属性，一般都是高阶组件的state状态
  // 或实例方法
  const injectedProp = someStateOrInstanceMethod;

  // 向包裹组件传递 props 属性
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

这样能够确保高阶组件最大程度的灵活性和可重用性。

## 代码习惯：保证最大适配性

有时候，高阶组件只接受一个参数：被包裹的组件 wrap commponent。

但是更多的情况下，高阶组件也接受附加的参数，作为配置信息。例如：Relay。

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

一个更常用的例子是 React Redux 的 `connect`：

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

这段代码中，connect 是一个返回高阶组件的高阶函数，所以 `connect(commentSelector, commentActions)` 其实才是 HOC，它接受的参数是 CommentList。

## 代码习惯：显示名字、以便调试

高阶组件创建的容器组件在 React Developer Tools 中的表现和其它的普通组件是一样的。为了便于调试，可以为它命名，确保 Developer Tools 能够识别出它是由高阶组件创建的新组件、还是普通的组件。

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  // displayName
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;

  return WithSubscription;
}
```

## 注意事项

### 不要在 render 方法中使用 HOCs

### 必须将静态方法做拷贝

### Refs 属性不能传递
