# 方法一：gulp

package.json 中添加：

```json
"scripts": {
  ...
  "build:assets": "sh ./scripts/copy.sh",
  "build:dev": "run-s build:clean && run-p build:assets build:ts:watch",
  "links": "gulp"
}
```

添加文件 gulpfile.js：

```js
var gulp = require('gulp');

var currentService = process.argv[2];

gulp.task(currentService, function() {
  gulp
    .src('./dist/**')
    .pipe(
      gulp.dest(
        '../service-' +
          currentService +
          '/node_modules/@my-project/my-components/',
      ),
    );
});

var watcher = gulp.watch('./dist/**', [currentService]);
watcher.on('change', function(event) {
  console.log(
    'File ' + event.path + ' was ' + event.type + ', running tasks...',
  );
});
```

## 说明：

* prepare : 需要安装 gulp
* usage   : 支持命令 npm run links，将编译好的代码拷贝至对应的 service 目录下
* example : 例如在开发 service-doc 时，执行的命令为：npm run build:dev + npm run links doc
* others  : service-xxx 和 lizard-components 需要在同一个父级文件夹中

# 方法二：cpx

安装 cpx 后，在 alias 中添加：

```sh
# 动态链接方法：需安装 cpx，然后在 my-component 中执行对应的 link:<service> 即可
alias link-xxx="cpx './dist/**' '../service-xxx/node_modules/my-components/' --watch"
```