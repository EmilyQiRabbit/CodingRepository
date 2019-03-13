# Resolve

定义 webpack 如何解析模块。
例如，`import "lodash"` 这样的语句，可以让 resolve 选项来改变 webpack 寻找 lodash 的方法（路径）。

## resolve.alias (object)

目的是让 import 更简单，不用写好长好长的 import 语句。

例如：

```js
module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```

然后，如下两种写法等效：

```
import Utility from '../../utilities/utility';
import Utility from 'Utilities/utility';
```

另外，alias 的 key 如果以 $ 结尾，表示精确匹配：

```js
module.exports = {
  //...
  resolve: {
    alias: {
      xyz$: path.resolve(__dirname, 'path/to/file.js')
    }
  }
};
```

那么：

```js
import Test1 from 'xyz'; // Exact match, so path/to/file.js is resolved and imported
import Test2 from 'xyz/file.js'; // Not an exact match, normal resolution takes place
```

## resolve.extensions (array)

自动解析特定扩展名的文件：

```js
module.exports = {
  //...
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json']
  }
};
```

然后：`import File from '../path/to/file';` 就不用加 `.js` 后缀名了。

## resolve.modules (array)

默认值：

```js
module.exports = {
  //...
  resolve: {
    modules: ['node_modules']
  }
};
```

表示 webpack 查找 modules 的路径。

更多可以参见 [Resolve 文档](https://webpack.js.org/configuration/resolve/#resolve)
