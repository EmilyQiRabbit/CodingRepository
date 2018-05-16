# CSS3 新特性集合

一直混用 css2、3，都搞不清 CSS3 到底有什么新东西，这里总结一下 🙋

## 边框 border

* border-radius
* box-shadow
* border-image

## 背景 background

* background-size
* background-origin：可选内容 border-box content-box

## 文本效果

* text-shadow
* word-wrap：可选内容 break-word

## 字体

@font-face

``` html
<style> 
  @font-face{
    font-family: myFirstFont;
    src: url('Sansation_Light.ttf'),
         url('Sansation_Light.eot'); /* IE9+ */
  }
  div{
    font-family:myFirstFont;
  }
</style>
```

## 2D 转换

* translate()
* rotate()
* scale()
* skew()：skew 的意思是偏斜
* matrix()

```css
div{
  transform: rotate(30deg);
  -ms-transform: rotate(30deg);		/* IE 9 */
  -webkit-transform: rotate(30deg);	/* Safari and Chrome */
  -o-transform: rotate(30deg);		/* Opera */
  -moz-transform: rotate(30deg);		/* Firefox */
}
```

## 3D 转换

* rotateX()
* rotateY()

```css
div{
  transform: rotateX(120deg);
  -webkit-transform: rotateX(120deg);	/* Safari 和 Chrome */
  -moz-transform: rotateX(120deg);	/* Firefox */
}
```

## 过渡 transition 

```css
div{
  transition: width 2s;
  -moz-transition: width 2s;	/* Firefox 4 */
  -webkit-transition: width 2s;	/* Safari 和 Chrome */
  -o-transition: width 2s;	/* Opera */
}
div:hover{
  width: 300px;
}
```

## css 动画

@keyframes + animation

```css
@keyframes myfirst
{
  from {background: red;}
  to {background: yellow;}
}

@-moz-keyframes myfirst /* Firefox */
{
  from {background: red;}
  to {background: yellow;}
}

@-webkit-keyframes myfirst /* Safari 和 Chrome */
{
  from {background: red;}
  to {background: yellow;}
}

@-o-keyframes myfirst /* Opera */
{
  from {background: red;}
  to {background: yellow;}
}

div
{
  animation: myfirst 5s;
  -moz-animation: myfirst 5s;	/* Firefox */
  -webkit-animation: myfirst 5s;	/* Safari 和 Chrome */
  -o-animation: myfirst 5s;	/* Opera */
}
```

## 文本多列

* column-count
* column-gap
* column-rule
