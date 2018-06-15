> * Title：前端面经不完全总结：CSS篇
> * Author：[EmilyQiRabbit 🙋 旺财](https://github.com/EmilyQiRabbit)
> * Links:
>      * [HTML篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/html.md)
>      * [CSS篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/css.md)
>      * [JS篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/js.md)
>      * [NetWork篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/network.md)

首先，CSS 大法好...🤣

# 1、块级元素、行内元素、空元素

块级元素还有行内元素都好说，但是是这个**空元素**，有点懵逼～（基础欠佳本人就是了😅）

### 空元素

没有内容的元素就是空元素，也就是，它们可以在开始标签中就闭合了，最常见的：`<input/>`，其实就是空元素。

其他的还包括：`<br/>`，`<img/>`，`<hr/>`

### 内联元素

**内联元素设置宽高无效（这里是无效，完全没用的）**，其宽度随着内容增加，高度随字体大小而改变（设置 **line-height** 可以改变不同行内元素之间垂直距离）。想要对内联元素设置宽高，一个办法就是：`display: inline-block`。

> 但是，这里又有一个特例。对于替换内联元素，宽高设置是可能有效的。什么是替换元素呢？替换元素就是浏览器根据元素的标签和属性，来决定元素的具体显示内容。如浏览器会根据 img 的 src 属性的值来读取图片信息并显示出来；又如由 input 的 type 属性来决定是显示输入框，还是单选按钮等。

醉了醉了。

内联元素设置 margin 和 padding 有效，注意这里是有效，如果你给行内元素设置一个 border 属性就行看出来 margin 和 padding 其实是是有效的。**但是它们不能对上下起作用，只能对左右起作用** —— 也就是它们不影响垂直方向上的布局，虽然有效但是不占文档流位置。

#### 内联 -> 块级

修改 display 就不说了。另外还有，对行内元素施加：`float`，或者 `position: absolute/fix`，都可以把它们转化为块级元素。


# 2、CSS 的可继承属性

* 默认不可继承的：display、margin、border、padding、background、height、min-height、max-height、width、min-width、max-width、overflow、position、left、right、top、bottom、z-index、float、clear、table-layout、vertical-align、page-break-after、page-bread-before、unicode-bidi。**对于这些默认不可继承的属性，可以手动：`margin: inherit` 强制继承**。

* 所有元素可继承：visibility、cursor。

* 内联元素可继承：letter-spacing、word-spacing、white-space、line-height、color、font、font-family、font-size、font-style、font-variant、font-weight、text-decoration、text-transform、direction。

* 块状元素可继承：text-indent、text-align。

* 列表元素可继承：list-style、list-style-type、list-style-position、list-style-image。

#### 不知道记忆有什么技巧没有？欢迎补充。

## 有点萌的选择器：* + *（猫头鹰选择符）

> 一个有意思的 css 选择器：[猫头鹰选择符](http://alistapart.com/article/axiomatic-css-and-lobotomized-owls)。它的优先级极低。例如 👇 这样写，确保了任意元素之间都会有一个默认的白色间隔，让编写组件流内容的开发者都将有一个合理的起点。

```css
* + * {
  margin-top: 1.5em;
}
```

> 补充一点：The adjacent sibling combinator (+) separates two selectors and matches the second element only if it immediately follows the first element, and both are children of the same parent element. 下面是另一个例子：

```html
<!DOCTYPE>
<html>
  <head>
    <style>
      li:first-of-type + li {
        color: red;
      }
    </style>
  </head>
  <body>
    <ul>
      <li>One</li>
      <li>Two!</li>
      <li>Three</li>
    </ul>
  </body>
</html>
```

效果是第 2 个 li 的颜色是红色。

# 3、flex 布局 -- 记了忘、忘了记系列

## 基本规则

首先，父级（容器）元素：`display: flex`。

**其他可以设置在容器元素的属性：**
* flex-direction：方向
* flex-wrap：换行
* flex-flow（缩写）
* justify-content：主轴（垂直）上的对齐方式
* align-items：交叉轴（水平）上如何对齐
* align-content：**多根轴线**的对齐方式。如果项目只有一根轴线，该属性不起作用。

**容器内子元素的属性：**
* order
* flex-grow：定义元素的放大比例，默认为0。如果所有元素的 flex-grow 属性都为1，则它们将等分剩余空间（如果有的话）。如果一个元素的 flex-grow 属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。
* flex-shrink：定义元素的缩小比例，默认为1。如果为0，其他项目都为1，则空间不足时该元素不缩小。
* flex-basis：它若设为跟 width 或 height 属性一样的值（比如350px），则项目将占据固定空间。
* flex（缩写）
* align-self

具体内容可以参见[阮一峰的博客](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)，里面有图，比较详尽。

# 4、CSS 原生变量

CSS中原生的变量定义语法是：`--*`，变量使用语法是：`var(--*)`，其中 * 表示我们的变量名称。CSS 中的原生变量名没有任何命名限制，而且还支持中文、日文、韩文！

给一个例子吧：

```css
/* 无论是变量的定义和使用只能在声明块 {} 里面，否则就是无效的 */
:root {
  --1: #369;
}
body {
  background-color: var(--1);
}

/* or */

body {
  --深蓝: #369;
  background-color: var(--深蓝);
}

/* 注意这样是无效的： */

div {
  --1: #369;
}
body {
  background-color: var(--1);
}
```

一个更复杂的例子，支持运算：

``` css
body {
  --columns: 4;
  --margins: calc(24px / var(--columns));
}
```

另外，var 的完整语法是：`var( <自定义属性名> [, <默认值 ]? )`。
意思就是，如果我们使用的变量没有定义（注意，仅限于没有定义），则使用后面的值作为元素的属性值。

例如：

```css
.box {
  --1: #369;
}
body {
  background-color: var(--1, #cd0000);
}
```

# 新特性：position: sticky

最简单的一个栗子：

```html
<div class="container">
  <div class="sticky-box">内容1</div>
  <div class="sticky-box">内容2</div>
  <div class="sticky-box">内容3</div>
  <div class="sticky-box">内容4</div>
</div>
```

```css
.container {
    background: #eee;
    width: 600px;
    height: 1000px;
    margin: 0 auto;
    font-size: 30px;
    text-align: center;
    color: #fff;
    line-height: 60px;
}

.sticky-box {
    position: -webkit-sticky;
    position: sticky;
    height: 60px;
    margin-bottom: 30px;
    background: #ff7300;
    top: 0px;
}
```

运行结果：

![](https://cloud.githubusercontent.com/assets/8554143/22967003/97af8828-f39f-11e6-82db-55405160eea3.gif)

[🙋 浏览器支持](https://caniuse.com/#search=position%3Asticky)