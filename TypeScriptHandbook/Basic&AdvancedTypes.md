# Basic

## Tuple

元素个数和类型都已知的数组，同时元素的类型不一定相同。

```js
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error

console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

**当为 Tuple 添加元素以后，新添加的元素就默认为之前所有元素类型的或集，在本例中也就是：`string | number`。**

```js
x[3] = "world"; // OK, 'string' can be assigned to 'string | number'

console.log(x[5].toString()); // OK, 'string' and 'number' both have 'toString'

x[6] = true; // Error, 'boolean' isn't 'string | number'
```

## Enum

枚举类型是给数字值赋予更友好的名字的一种方式。

```js
enum Color {Red, Green, Blue}
let c: Color = Color.Green // 1
```

默认情况下，数字是从 0 开始的（Red = 0）。当然你也可以手动设置。

```js
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green // 2
```

反过来，通过数字来获取字符，也是可以的：

```js
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName); // Displays 'Green' as its value is 2 above

```

## Type assertions

类型声明有两种方式：

方法 1：“angle-bracket” syntax

```js
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

方法 2：as-syntax

```js
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

注意：当和 JSX 一起使用的时候，只有 as-syntax 可用。

----------

# Advanced Types

## Intersection Types (&)

即我们常说的并集

栗子，创建一个 mixin：

```js
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}
```

## Union Types (|)

和「或」的意思类似，表示是某几个类型中的一种。例如 number | string | boolean 表示是 number、string、boolean 中的一种。

```js
function padLeft(value: string, padding: string | number) {
    // ...
}

let indentedString = padLeft("Hello world", true); // errors during compilation
```

需要注意的是，如果 | 连接的是两个 interface，那么该类型只能访问两个 interface 的公共属性。

```js
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim();    // errors
```

## Nullable types



## Type Aliases

[ 未完待续 ]
