/**
 * auther  : liuyuqi <LiuYQEmily@163.com>
 * usage   : 用来支持命令 npm run links，将编译好的代码拷贝至对应的 service 目录下
 * example : 例如在开发 service-doc 时，执行的命令为：npm run build:dev + npm run links doc
 * others  : service-xxx 和 lizard-components 需要在同一个父级文件夹中
 */
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
