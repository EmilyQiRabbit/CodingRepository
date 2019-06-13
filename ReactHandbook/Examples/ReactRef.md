# React Ref 的应用一：父级元素调用子元素的方法

比如，子元素某个方法，其中逻辑依赖于父级元素调用远程接口获取到信息，此时可以：

```js
class MyPage extends Component<Props, State> {
  private statusRef: any

  constructor(props) {
    super(props);
    this.statusRef = React.createRef();
  }

  componentDidMount(): void {
    xxxContainer.getInfo().then(() => {
      this.statusRef.current.xxxMethod()
    });
  }

  render() {
    return (
      <div>
        <Status ref={this.statusRef} />
        <List />
      </div>
    );
  }
}
```
