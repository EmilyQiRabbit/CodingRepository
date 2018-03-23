# 一、ReactNative 概览与基础类

## ReactNative 是做什么的？

> React Native lets you build mobile apps using only JavaScript. It uses the same design as React, letting you compose a rich mobile UI from declarative components.

React Native 允许开发者使用 JavaScript 和 React 来构建 APP！并且，用 Native 构建起来的 APP 就是和使用原生语言开发一样的 APP，并不是什么 h5 嵌入到 APP 中这样的模式。

## ReactNative 源码概览

ReactNative 最核心的实现是基于 c, c++ 实现的。它作为原生应用和 JS 之间的桥梁，负责两边的通信以及对 JS 的解析。

ReactNative 源码的框架大致如下：
![系统框架](imgs/react_native_system_strcuture.png)

## 几个重要的类

### 1、ReactContext

>ReactContext继承于ContextWrapper，也就是说它和Android中的Context是一个概念，是整个应用的上下文。那么什么是上下文呢，我们知道Android的应用模型是基于组件的应用设计模式， 组件的运行需要完整的运行环境，这种运行环境便是应用的上下文。

### 2、ReactInstanceManager

ReactInstanceManager 是 ReactNative 应用**总的管理类**：负责创建 ReactContext、CatalystInstance 等类，解析 ReactPackage 生成映射表，并且配合 ReactRootView 管理 View 的创建与生命周期等功能。

### 3、CatalystInstance

CatalystInstance 是 ReactNative 应用 Java 层、C++ 层、JS 层**通信总管理类**，总管Java 层、JS 层核心 Module 映射表与回调，三端通信的入口与桥梁。

### 4、NativeToJsBridge/JsToNativeBridge

NativeToJsBridge：是 Java 调用 JS 的桥梁，用来调用 JS Module，回调 Java。
JsToNativeBridge：是 JS 调用 Java 的桥梁，用来调用 Java Module。

### 5、JavaScriptModule/NativeModule

JavaScriptModule 是 JS Module，负责 JS 到 Java 的映射调用格式声明，由 CatalystInstance 统一管理。
NativeModule 是 Java Module，负责 Java 到 Js 的映射调用格式声明，由 CatalystInstance 统一管理。

### 6、JavascriptModuleRegistry

JavascriptModuleRegistry 是 JS Module 映射表，NativeModuleRegistry 是 Java Module 映射表。

# 二、JS & Native // Java & C++ // JS & C++ 交互概述

## JS & Native

执行 Native 代码的抽象类是 ExecutorDelegate，执行 JS 代码的抽象类是 JSExecutor。

其中，**ExecutorDelegate** 在 Executor.h 中定义，由 JsToNativeBridge 实现，该抽象类用于 JS 代码调用 Native 代码。
**JSExecutor** 也在 Executor.h 中定义，是用来执行 JS 代码的。执行代码的命令是通过 JS 层的 BatchedBridge 传递过来的。

## Java & C++

Java 调用 C/C++，需要用到 Java 中的 JNI。JNI 通过动态注册的方式注册 Native 函数。

>JNI 动态注册
>动态注册允许你提供一个函数映射表，提供给虚拟机，这样虚拟机就可以根据函数映射表来调用相应的函数。

## JS & C++

RN 解析 JS 用的是 Webkit 的脚本引擎 JavaScriptCore，JavaScriptCore 负责 JS 的解释与执行。

>Webkit是一个开源的浏览器引擎，它包括一个网页排版渲染引擎 WebCore 与一个**脚本引擎 JavaScriptCore**。

### C++ 调用 JavaScript

#### step 1. 获取 Global 全局对象

```
JSGlobalContextRef context = JSGlobalContextCreate(NULL);
JSObjectRef global = JSContextGetGlobalObject(ctx); 
```

#### step 2. 获取 JavaScript 的全局变量、全局函数或者全局复杂对象，并完成调用。

下面这段代码就涉及到了很多 C++ 与 JS 交互的关键方法，比如 JSStringCreateWithUTF8CString、JSValueToObject 等等。

```
//获取全局变量
JSStringRef varName = JSStringCreateWithUTF8CString("JavaScript变量名");
JSValueRef var = JSObjectGetProperty(ctx, globalObj, varName,NULL); JSStringRelease(varName);
//转化为C++类型
int n = JSValueToNumber(ctx, var, NULL);

//获取全局函数
JSStringRef funcName = JSStringCreateWithUTF8CString("JavaScript函数名");
JSValueRef func = JSObjectGetProperty(ctx, globalObj, funcName,NULL); JSStringRelease(funcName);
//装换为函数对象
JSObjectRef funcObject = JSValueToObject(ctx,func, NULL);
//组织参数,将两个数值1和2作为两个参数
JSValueRef args[2];
args[0] = JSValueMakeNumber(ctx, 1);
args[1] = JSValueMakeNumber(ctx, 2);
//调用函数
JSValueRef returnValue = JSObjectCallAsFunction(ctx, funcObject,NULL, 2, args, NULL);
//处理返回值
int ret = JSValueToNumber(ctx, returnValue, NULL);

//获取复杂的对象
JSStringRef objName=JSStringCreateWithUTF8CString("JavaScript复杂对象名");
JSValueRef obj = JSObjectGetProperty(ctx, globalObj, objName,NULL); JSStringRelease(objName);
//装换为对象
JSObjectRef object = JSValueToObject(ctx,obj, NULL);
//获取对象的方法
JSStringRef funcObjName =JSStringCreateWithUTF8CString("JavaScript复杂对象的方法");
JSValueRef objFunc = JSObjectGetProperty(ctx, object, funcObjName,NULL); JSStringRelease(funcObjName);
//调用复杂对象的方法,这里省略了参数和返回值
JSObjectCallAsFunction(ctx, objFunc, NULL, 0, 0, NULL);
```

### JavaScript 调用 C++

通过方法 JSObjectSetProperty 将在 c++ 中新建的 JavaScript 类对象注入到 JavaScript 的全局对象中，在 JS 中就可以使用了。

# 三、详述 Native 与 Javascript 通信

通信模型框架：

**Java  ↔︎  C++  ↔︎  JavaScript**

可见，在 RN 中，C++ 作为桥梁，在 Java 和 JS 之间进行消息的传递。

## 1、Java 层

### JavaScriptModule

React-Native 实现了一些组件，比如按键、触摸等等，所有的组件都必须继承 JavaScriptModule（这是 Java 写的）接口标准。JavaScriptModule 位于 com.facebook.react.bridge。

关于 JavaScriptModule 官方给出需要注意的内容包括：

> 1.Interface denoting that a class is the interface to a module with the same name in JS. Calling functions on this interface will result in corresponding methods in JS being called.

在 JavaScriptModule 定义的接口和 JS 中的接口一一对应，调用 JavaScriptModule 接口函数将会导致 JS 中的同名函数被调用。

这里需要注意：Java 层的 JavaScriptModule 只做接口定义，而实现由 Javascript 代码完成。搜索一下 JavaScriptModule 的子类会发现它们都是接口，没有具体实现。

> 2.When extending JavaScriptModule and registering it with a CatalystInstance, all public methods are assumed to be implemented on a JS module with the same name as this class. 

所有 JavaScriptModule 组件需要在 CatalystInstance 中注册；
所有 JavaScriptModule 中的 public 方法必须在 JS 中以同名函数的形式被实现。

> 3.NB: JavaScriptModule does not allow method name overloading because JS does not allow method name overloading.

不允许重载

### JavaScriptModule 组件的注册

这里，以一个触摸组件为栗子，看 JavaScriptModule 是如何注册组件并传递消息给 JS 的。

这个组件是 RCTEventEmitter，可以发现它依旧是一个 interface 哈。

```
public interface RCTEventEmitter extends JavaScriptModule {
  public void receiveEvent(int targetTag, String eventName, @Nullable WritableMap event);
  public void receiveTouches(
      String eventName,
      WritableArray touches,
      WritableArray changedIndices);
}
```
















