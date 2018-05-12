# Promise 的实现 (polyfill)

* 源自 paji 的分享

## 第一步

```javascript
function Promise(fn) {
  var value = null,
  callbacks = [];  //callbacks为数组，因为可能同时有很多个回调
        
  this.then = function (onFulfilled) {
    callbacks.push(onFulfilled);
  }; 
  /*
  * 调用方式：promise.then(cb1);promise.then(cb2)
  * 此时，cb1 和 cb2 就都被添加到了 callbacks 队列中。
  * ...
  */
    
  function resolve(value) {
    callbacks.forEach(function (callback) {
      callback(value);
    });
  }

  fn(resolve); 
  // 即：new Promise(fn) 后，传入的函数 fn 会立即执行
}
```

## 添加链式方法

将 Promise 中的 this.then 改为：

```javascript
this.then = function (onFulfilled) {
  callbacks.push(onFulfilled);
  return this;
};
```

## 确保 resolve 函数在下一轮 EventLoop 中执行

将 Promise 中的 resolve 函数改为：

```javascript
function resolve(value) {
  setTimeout(function() {
      callbacks.forEach(function (callback) {
          callback(value);
      });
  }, 0)
} 
```

## 加入状态

```javascript
function Promise(fn) {
  var state = 'pending',
      value = null,
      callbacks = [];

  this.then = function (onFulfilled) {
      if (state === 'pending') {
          // 如果状态是 pending，就将方法放在队列中，返回
          callbacks.push(onFulfilled);
          return this;
      }
      // 否则，执行该方法
      onFulfilled(value);
      return this;
  };

  function resolve(newValue) {
      value = newValue;
      state = 'fulfilled';
      setTimeout(function () {
        callbacks.forEach(function (callback) {
            callback(value);
        });
      }, 0);
  }

  fn(resolve);
}
```

## then 函数的参数是一个返回了 Promise 实例的函数的情况 👇

```javascript
getUserId()
  .then(getUserJobById)
  .then(function (job) {
      // 对job的处理
  });

function getUserJobById(id) {
  return new Promise(function (resolve) {
    http.get(baseUrl + id, function(job) {
        resolve(job);
    });
  });
}
```

**解决办法：**

🙀 卧槽忽然就复杂了？！浏览下代码哈，然后跟着注释慢慢来.....

```javascript
 function Promise(fn) {
  var state = 'pending',
    value = null,
    callbacks = [];

  // then 方法在一开始的时候其实就已经执行了，是同步的。而 then 函数中的那个参数（也就是一个函数），才是异步执行的。
  this.then = function (onFulfilled) { // 这部分的重点就是要处理，这个函数返回了一个 Promise 实例。现在，不管什么，then 都包装成了一个 promise 返回了。
    return new Promise(function (resolve) {
      // 统一放在 handle 函数中处理，并且，then 函数此时返回的是一个 promise 实例，它会直接执行 handle 方法，也满足可以链式调用。
      handle({
          onFulfilled: onFulfilled || null,
          // onFulfilled 就是传入 then 的函数，也就是如果异步执行的顺利，将要执行的函数。但是在这里，我们需要考虑它可能是一个 Promise 实例。
          resolve: resolve
      });
    });
  };

  function handle(callback) { // 这个 callback 是一个对象 Obj，这个 Obj 带着相关 promise 的 resolve 函数
    // 如果还在 pending，就放队列里完事儿。
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }
    // 如果状态是 resolved，注意，这里我们还没有考虑 reject 的情况。
    // 如果 callback.onFulfilled 为空，或者 then 方法中没有传递任何东西。
    if(!callback.onFulfilled) {
      callback.resolve(value);
      return;
    }

    // 如果 callback.onFulfilled 返回的是一个 Promise 实例，就执行这个函数，得到相关 Promise，然后 resolve，而 resolve 中恰好也加入了对 promise 实例的处理。
    var ret = callback.onFulfilled(value);
    // 这个 resolve，是 then 函数返回的 promise 实例的 resolve
    // 所以，其实 promise 的 then 链式调用，每一节调用 then 都是不同的 promise 实例了。
    callback.resolve(ret);
  }
  
  function resolve(newValue) {
    // 这里，resolve 中加入了对 promise 实例的处理：如果 newValue 是一个 Promise 实例，就用 call 方法调用它，之后直接 return 了。
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;
      if (typeof then === 'function') {
        then.call(newValue, resolve); // newValue 是 getUserJobById 方法返回的 promise。相当于这个 promise 的 resolve 被巧妙的换了换，然后直接返回。
        // 所以，当 then 参数中的 promise 异步返回后，执行的其实是下一个 then 创建的 promise 的 resolve，也就接上了 then 链。
        return;
      }
    }
    state = 'fulfilled';
    value = newValue;
    setTimeout(function () {
      callbacks.forEach(function (callback) {
        handle(callback);
      });
    }, 0);
  }

  fn(resolve); // resolve 将会在 fn 中被触发
}
```

> 1.getUserId 生成的 promise（简称getUserId promise）异步操作成功，执行其内部方法 resolve，传入的参数正是异步操作的结果id。

> 2.调用 handle 方法处理 callbacks 队列中的回调：getUserJobById 方法，生成新的 promise（简称 getUserJobById promise）。

> 3.执行之前由 getUserId promise 的 then 方法生成的 bridge promise 的 resolve 方法，传入参数为 getUserJobById promise。这种情况下，会将该 resolve 方法传入getUserJobById promise 的 then 方法中，并直接返回。

> 4.在 getUserJobById promise 异步操作成功时，执行其 callbacks 中的回调：getUserId bridge promise 的 resolve 方法。

> 5.最后，执行 getUserId bridge promise 的后邻 promise 的 callbacks 中的回调。

醉了。🤪

> Note: While the syntax of this function is almost identical to that of apply(), the fundamental difference is that call() accepts an argument list, while apply() accepts a single array of arguments.

## 加入失败处理

``` JavaScript
 function Promise(fn) {
  var state = 'pending',
    value = null,
    callbacks = [];

  this.then = function (onFulfilled, onRejected) {
    return new Promise(function (resolve, reject) {
      handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve: resolve,
        reject: reject
      });
    });
  };

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }

    var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
      ret;
    if (cb === null) {
      cb = state === 'fulfilled' ? callback.resolve : callback.reject;
      cb(value);
      return;
    }
    ret = cb(value);
    callback.resolve(ret);
  }
   function resolve(newValue) {
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;
      if (typeof then === 'function') {
        then.call(newValue, resolve, reject);
        return;
      }
    }
    state = 'fulfilled';
    value = newValue;
    execute();
  }

  function reject(reason) {
    state = 'rejected';
    value = reason;
    execute();
  }

  function execute() {
    setTimeout(function () {
      callbacks.forEach(function (callback) {
          handle(callback);
      });
    }, 0);
  }

  fn(resolve, reject);
}
```

## 加入异常处理

```javascript
function handle(callback) {
  if (state === 'pending') {
    callbacks.push(callback);
    return;
  }

  var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
    ret;
  if (cb === null) {
    cb = state === 'fulfilled' ? callback.resolve : callback.reject;
    cb(value);
    return;
  }
  // 这里，加入了对异常的捕捉
  try {
    ret = cb(value);
    callback.resolve(ret);
  } catch (e) {
    callback.reject(e);
  } 
}
```

