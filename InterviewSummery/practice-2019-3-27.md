## 面试题：

### 编程题

1. 判断树中的路径是否存在：

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

生病了，又是不勤奋的好几天，哭唧唧。。。
