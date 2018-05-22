> * Title：前端面经不完全总结：HTML篇
> * Author：[EmilyQiRabbit 🙋 旺财](https://github.com/EmilyQiRabbit)
> * Links:
>      * [HTML篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/html.md)
>      * [CSS篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/css.md)
>      * [JS篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/js.md)
>      * [NetWork篇](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/InterviewSummery/network.md)

# HTML 语义化

语义化的含义就是：标签可以描述内容的含义，用最适合的标签做对应的事情。

**它的优势在于：**
1. 便于浏览器、搜索引擎解析。
2. 在**没有样式 CCS 情况下也以一种文档格式显示**，并且容易阅读。
3. 搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，**利于 SEO**。
4. 页面内容结构化，开发者可以将 html 分块，**便于 html 源码的阅读理解和维护**。

# 部分语义化标签

## 1、<nav>

**标记导航**（例如网页中的链接群）。包含在 `<nav>` 中间的可以是 `<ul>` 无序列表或者 `<li>` 有序列表 `<ol>`。

例如：

```html
<nav>
  <ul>
    <li><a href="/html/">HTML</a></li>
    <li><a href="/css/">CSS</a></li>
    <li><a href="/js/">JavaScript</a></li>
    <li><a href="/jquery/">jQuery</a></li>
  </ul>
</nav>
```

## 2、<article>

**文章标记标签**，表示的是一个文档、页面、应用或是网站中的一个独立的容器。

例如：

```html
<article>
  <h1>Google Chrome</h1>
  <p>Google Chrome is a free, open-source web browser developed by Google, released in 2008.</p>
</article>
```

## 3、<section>

**区块定义标签**，一般是有一组相似主题的内容，一般会包含一个标题。可以用来构建：文章的章节，标签式对话框中的各种标签页等等。

```html
<section>
  <h1>WWF</h1>
  <p>The World Wide Fund for Nature (WWF) is an international organization working on issues regarding the conservation, research and restoration of the environment, formerly named the World Wildlife Fund. WWF was founded in 1961.</p>
</section>

<section>
  <h1>WWF's Panda symbol</h1>
  <p>The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zoo to the London Zoo in the same year of the establishment of WWF.</p>
</section>
```

### section 和 article 的区别：

当元素内容**聚合起来更加言之有物时**，应该使用 article 来替换 section。

可以认为，article 是一个特殊的 section 标签，它比 section 具有**更明确的语义**，它代表一个独立的、完整的相关内容块。一般来说，article 会有标题部分(通常包含在 header 内)，有时也会包含 footer。虽然 section 也是带有主题性的一块内容，但是无论从结构上还是内容上来说，article 本身就是独立的、完整的。

## 4、<aside>

**定义侧栏标签**，表示一部分内容与页面的主体并不是有很大的关系（但是还是有关联）。用他可以实现：侧栏、相关文章的链接框、广告、友情链接等等。

例如：

```html
<p>My family and I visited The Epcot center this summer.</p>

<aside>
  <h4>Epcot Center</h4>
  <p>The Epcot Center is a theme park in Disney World, Florida.</p>
</aside>
```

## 5、<footer>

页脚标签（与 `<header>` 标签对应的标签），用它可以实现的功能有：附录、索引、版权页、许可协议等。

```html
<footer>
  <p>Posted by: Hege Refsnes</p>
  <p>Contact information: <a href="mailto:someone@example.com">someone@example.com</a>.</p>
</footer>
```

## 6、<address>

用来定义与 HTML 页面或页面一部分有关的作者、相关人员或组织的联系信息。大多数时候，联系信息是作者的电子邮件或是指向联系信息页的链接。

> The `<address>` tag should NOT be used to describe a postal address, unless it is a part of the contact information.

`<address>` 标签中不能有 `<h1>~<h6>`、`<article>`、`<address>`、`<aside>`、`<footer>`、`<header>`、`<hgroup>`、`<nav>`、`<section>`等标签。

```html
<address>
Written by <a href="mailto:webmaster@example.com">Jon Doe</a>.<br> 
Visit us at:<br>
Example.com<br>
Box 564, Disneyland<br>
USA
</address>
```

## 7、<figure>/<figcaption>

figure 元素用来引入图表、图形、照片等。figcaption 则是图注/标题。

```html
<figure>
  <img src="img_pulpit.jpg" alt="The Pulpit Rock" width="304" height="228">
  <figcaption>Fig1. - A view of the pulpit rock in Norway.</figcaption>
</figure>
```

