# Git basic: Rebase and merge

## 入门 vim

`\(>0<)/` 终于终于我开始学习 vim 了～
蠢哭～

基本上 vi/vim 共分为三种模式，分别是命令模式（Command mode），输入模式（Insert mode）和底线命令模式（Last line mode）。

### 命令模式常用命令

* i 切换到输入模式，以输入字符。
* x 删除当前光标所在处的字符。
* : 切换到底线命令模式，以在最底一行输入命令。

### 输入模式常用命令

*  字符按键以及Shift组合，输入字符
*  ENTER，回车键，换行
*  BACK SPACE，退格键，删除光标前一个字符
*  DEL，删除键，删除光标后一个字符
*  方向键，在文本中移动光标
*  HOME/END，移动光标到行首/行尾
*  Page Up/Page Down，上/下翻页
*  Insert，切换光标为输入/替换模式，光标将变成竖线/下划线
*  ESC，退出输入模式，切换到命令模式

### 底线命令模式常用命令

* w 保存文件
* q 退出程序

## Test Git rebase and merge

### rebase

分支：release feature-01

流程图：

![](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/GitMonkey/images/rebase.jpg?raw=true)

最后生成的 release 分支 log 是：

```
36e4213 (feature-01) feature: 01 add
f8f5d3f release add sth
9b41db6 init
```

feature-01 分支 log 是：

```
36e4213 (HEAD -> feature-01) feature: 01 add
f8f5d3f release add sth
9b41db6 init
```

### merge

分支：release feature-02

流程图：

![](https://github.com/EmilyQiRabbit/CodingRepository/blob/master/GitMonkey/images/merge.jpg?raw=true)


最后生成的 release 分支 log 是：

```
3cecdc6 (HEAD -> release, feature-02) Merge branch 'release' into feature-02
46ad815 release add
24c29cb feature 02 add
36e4213 (feature-01) feature: 01 add
```

feature-02 分支 log 是：

```
3cecdc6 (HEAD -> feature-02, release) Merge branch 'release' into feature-02
46ad815 release add
24c29cb feature 02 add
36e4213 (feature-01) feature: 01 add
```