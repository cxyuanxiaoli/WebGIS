# JavaScript 进阶

## 数据类型

ECMAScript标准定义了8种数据类型：

* 七种基本数据类型：
  * Boolean
  * null
  * undefined
  * Number
  * BigInt
  * String
  * Symbol
* 引用数据类型 Object

## 运算符

### 解构



## 循环和迭代

### for ... in

`for...in` 语句循环一个指定的变量来循环一个对象所有可枚举的属性。

### for ... of

`for...of` 语句在可迭代对象（包括`Array`、`Map`、`Set`、`arguments` 等等）上创建了一个循环，对值的每一个独特属性调用一次迭代。

## 函数

### length

`Function` 实例的 **`length`** 数据属性表示函数期望的参数数量

这个数字不包括 剩余参数，只包括在第一个具有默认值的参数之前的参数

```js
function fn1(x, y, z = 10) {}
function fn2(x = 1, y, z) {}
function fn3(...args) {}
console.log(fn1.length);   // 2
console.log(fn2.length);   // 0
console.log(fn3.length);   // 0
```

### 默认参数值

**函数默认参数**允许在没有值或 `undefined` 被传入时使用默认形参

```js
function test(num = 1) {
  console.log(typeof num);
}
test(); // 'number'
test(undefined); // 'number'

test(""); // 'string'
test(null); // 'object'
```

前面的参数可用于以后的默认参数

```js
function greet(name, greeting = "Hello", message = greeting + " " + name) {
  return [name, greeting, message];
}
console.log(greet("David")); // [ 'David', 'Hello', 'Hello David' ] 
console.log(greet("David", "Hi"));   // [ 'David', 'Hi', 'Hi David' ]
```

函数传参时始终以从左到右的顺序进行，无论该参数是否具有默认值

```js
function f(x = 1, y) {
  return [x, y];
}
f()  // [1, undefined]
f(2) // [2, undefined]
```

### 剩余参数与 arguments 对象

**剩余参数**语法允许函数将任意数量的参数作为数组接收，从而在 JavaScript 中实现了`可变参数函数`的表示方式

剩余参数的语法限制：

- 一个函数定义只能包含一个剩余参数
- 剩余参数必须是函数定义的最后一个参数
- 剩余参数之后不允许出现 尾后逗号
- 剩余参数不能有 默认值

```js
function fn(x, y, ...others) {
  console.log(x, y, others);
}
fn(1, 2, 3, 4, 5);  // 1 2 [ 3, 4, 5 ]
```

剩余参数始终为数组对象，即使只传入单个值或undefined

```js
function myFun(a, b, ...manyMoreArgs) {
  console.log(a, b, manyMoreArgs);
}
myFun("one");   // "one" undefined []
```



**`arguments`** 是一个类数组对象，是所有非箭头函数中都可用的局部变量，其中包含传递给该函数的参数值

`arguments` 是一个类数组对象，这意味着它具有 `length` 属性，且属性索引从零开始，但它不具备 `Array` 的内置方法，例如 `forEach()` 或 `map()`。不过，可通过以下方式将其转换为真正的 `Array`：使用 `slice()`、`Array.from()` 或`展开语法`

```js
function fn() {
  console.log(arguments, arguments.length);
}
fn(1, "a", true);  // [Arguments] { '0': 1, '1': 'a', '2': true } 3
```

在具有复杂参数（剩余参数、默认值、解构）的非严格函数中，`arguments` 对象始终反映函数调用时传递的值

在严格模式下，无论传递的参数类型如何，在函数体内为参数赋新值永远不会影响 `arguments` 对象，同样地，为 `arguments` 索引赋新值也不会改变参数的值



现代代码优先推荐使用`剩余参数`语法

### 箭头函数

**箭头函数表达式**的语法比传统的函数表达式更简洁，但在语义上有一些差异，在用法上也有一些限制：

- 箭头函数没有独立的 `this`、`arguments` 和 `super` 绑定，并且不可被用作方法
- 箭头函数不能用作构造函数，使用 `new` 调用它们会引发 `TypeError`。它们也无法访问 `new.target` 关键字。
- 箭头函数不能在其主体中使用 `yield`，也不能作为生成器函数创建

```js
const fn1 = (a, b) => {
  return a + b;
};
const fn2 = (a, b) => a + b;

const fn3 = (name, age) => {
  return {
    name,
    age,
  };
};
const fn4 = (name, age) => ({ name, age });   // 直接返回一个对象
```

## 对象

### 创建对象

通常通过以下三种方式创建一个新对象：

1. 对象字面量
2. 构造函数
3. Object.create  该方法允许为创建的对象选择一个原型对象，而不用定义构造函数

### 属性

在 JavaScript 中，对象可以被看作是一个属性的集合。对象属性等价于键值对。属性键要么是`字符串`，要么是 `symbol`。当其他类型（如数字）用于索引对象时，值会隐式地转化为字符串

有两种类型的对象属性：*数据*属性和*访问器*属性。每个属性都有对应的*特性*

#### 数据属性

数据属性将键与值相关联。它可以由以下特性描述：

* value(undefined) 
* writable(false)  表示属性是否可以通过赋值进行修改
* enumerable(false)  表示属性是否可以通过 `for...in` 循环进行枚举
* configurable(false)  表示属性是否可以删除，是否可以更改为访问器属性，以及是否可以更改其特性

#### 访问器属性

将键与两个访问器函数（`get` 和 `set`）相关联，以获取或者存储值，访问器属性有以下特性：

* get(undefined)  
* set(undefined)
* enumerable(false) 
* configurable(false)

#### Object.defineProperty()

**`Object.defineProperty()`** 静态方法会直接在一个对象上定义一个新属性，或修改其现有属性

语法：`Object.defineProperty(obj, prop, descriptor)`

* obj  要定义属性的对象
* prop  一个字符串或 `Symbol`，指定了要定义或修改的属性键
* descriptor  要定义或修改的属性的描述符

属性描述符有两种主要类型：数据描述符和访问器描述符，描述符属性同`数据/访问器属性`的特性

`Object.defineProperty()` 允许精确地添加或修改对象上的属性。通过赋值添加的普通属性会在枚举属性时（例如 `for...in`、`Object.keys()`等）出现，它们的值可以被更改或删除。默认情况下，使用 `Object.defineProperty()` 添加的属性是不可写、不可枚举和不可配置的。此外，`Object.defineProperty()` 使用内部方法实现，即使属性已存在也不会调用setter

```js
const o = {};
o.a = 1;
// 等价于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true,
});

// 另一种情况
Object.defineProperty(o, "a", { value: 1 });
// 等价于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false,
});
```

如果旧描述符的 `configurable` 特性被设置为 `false`，则该属性被称为*不可配置的*。无法更改不可配置的访问器属性的任何特性，也不能将其在数据类型和访问器类型之间切换。对于具有 `writable: true` 的数据属性，可以进行`writable` 特性从 `true` 改为 `false`的单向修改

当当前属性是可配置的时，如果新描述符中缺少一个特性，则会保留旧描述符该特性的值

通过提供不同类型的描述符，可以在数据属性和访问器属性之间切换

```js
myObj1={}
myObj1.age = 20;
//{ value: 20, writable: true, enumerable: true, configurable: true }
console.log(Object.getOwnPropertyDescriptor(myObj1, "age"));
Object.defineProperty(myObj1, "age", {
  writable: false,
});
//{ value: 20, writable: false, enumerable: true, configurable: true }
console.log(Object.getOwnPropertyDescriptor(myObj1, "age"));
Object.defineProperty(myObj1, "age", {
  get() {
    return 20;
  },
});
//{ get: [Function: get], set: undefined, enumerable: true, configurable: true }
console.log(Object.getOwnPropertyDescriptor(myObj1, "age"));
```

#### Object.getOwnPropertyDescriptor()

**`Object.getOwnPropertyDescriptor()`** 静态方法返回一个对象，该对象描述给定对象上特定属性（即直接存在于对象上而不在对象的原型链中的属性）的配置。返回的对象是可变的，但对其进行更改不会影响原始属性的配置

语法：`Object.getOwnPropertyDescriptor(obj, prop)`

* obj  要查找其属性的对象
* prop  要检索其描述的属性的名称或Symbol

#### 属性的可枚举性和所有权

JavaScript 对象中的每个属性能根据三个因素进行分类：

- 可枚举或不可枚举
- 字符串或 symbol
- 自有属性或从原型链继承的属性

大多数迭代方法（如：`for...in`循环和 `Object.keys`）仅访问可枚举的键

属性的所有权取决于属性是否直接属于该对象，而不是对象的原型链

所有的属性，不论是可枚举或不可枚举、是字符串或 symbol、是自有的或继承的，都能用`点记号表示法或方括号表示法`进行访问

### 查询对象属性

四种内置的查询对象属性的方法。它们全部都支持字符串和 symbol 键

| 方法 | 可枚举的、自有的 | 可枚举的、继承的 | 不可枚举的、自有的 | 不可枚举的、继承的 |
|:-----|:----------------:|:----------------:|:------------------:|:------------------:|
| obj.propertyIsEnumerable() | true ✅ | false ❌ | false ❌ | false ❌ |
| obj.hasOwnProperty() | true ✅ | false ❌ | true ✅ | false ❌ |
| Object.hasOwn() | true ✅ | false ❌ | true ✅ | false ❌ |
| in 操作符 | true ✅ | true ✅ | true ✅ | true ✅ |

### 枚举对象的属性

JavaScript 中有许多遍历对象属性的方法

| 方法                                           | 可枚举、自有的 | 可枚举、继承的 | 不可枚举、自有的 | 不可枚举、继承的 |
| ---------------------------------------------- | :------------: | :------------: | :--------------: | :--------------: |
| Object.keys<br>Object.values<br>Object.entries | ✅<br>(字符串)  |       ❌        |        ❌         |        ❌         |
| Object.getOwnPropertyNames                     | ✅<br>(字符串)  |       ❌        |  ✅<br>(字符串)   |        ❌         |
| Object.getOwnPropertySymbols                   | ✅<br>(symbol)  |       ❌        |  ✅<br>(symbol)   |        ❌         |
| Object.getOwnPropertyDescriptors               |       ✅        |       ❌        |        ✅         |        ❌         |
| Reflect.ownKeys                                |       ✅        |       ❌        |        ✅         |        ❌         |
| for...in                                       | ✅<br>(字符串)  | ✅<br/>(字符串) |        ❌         |        ❌         |
| Object.assign<br>(第一个参数之后)              |       ✅        |       ❌        |        ❌         |        ❌         |
| ( ... ) 对象展开                               |       ✅        |       ❌        |        ❌         |        ❌         |

### getter and setter

`getter`和`setter`将对象属性绑定到`查询/设置`该属性时要调用的函数

```js
const obj = {
  get prop(){ },
  set prop(value){ }
}
```

使用 `delete` 操作符删除 getter/setter

```js
delete obj.prop;
```

使用`defineProperty`在现有对象上定义 getter/setter

```js
var o = { a: 0 };
Object.defineProperty(o, "b", {
  get: function () {
    return this.a + 1;
  },
});

console.log(o.b);
```

相对于普通属性，getter/setter 具有懒加载、数据访问可控制等优势

### 定义方法

从 ECMAScript 2015 开始，在对象初始器中引入了一种更简短定义方法的语法，这是一种把方法名直接赋给函数的简写方式

原写法；

```js
const objA = {
  //普通函数
  foo: function () { /* code */ },
  //生成器函数
  bar: function* () { let index = 0; while (true) yield index++; },
  //异步函数
  f: async function () { await some_promise; }
};
```

简化写法：

```js
const objB = {
  foo() { },
  *bar() { let index = 0; while (true) yield index++; },
  async f() { await some_promise; },
  ["foo"+2]() { }   //计算属性名
};
```

## 继承与原型链

<img src=".\img\proto.png" style="zoom: 33%;" >

原型链：new MyClass( ) -->> MyClass.prototype -->> Object.prototype -->> null

### 继承"属性"

JavaScript 对象是动态的属性（称为**自有属性**）“包”。JavaScript 对象有一条指向原型对象的链。当试图访问对象的属性时，不仅在该对象上查找属性，还会在该对象的原型上查找属性，以及原型的原型，依此类推，直到找到一个名字匹配的属性或到达原型链的末尾。

当对象 o 上有自有属性“b”，且 原型也有“b”属性时，访问`o.b`时原型上的“b”属性没有被访问。 这被称为属性遮蔽（Property Shadowing）

### 继承"方法"

在 JavaScript 中，对象可以以属性的形式添加函数。继承的函数与其他属性一样，包括属性遮蔽（在这种情况下，是一种*方法重写*的形式）

当执行继承的函数时，`this` 值指向继承对象，而不是将该函数作为其自有属性的原型对象

### 构造函数

原型的作用在于代码复用。如以下代码，代码1改写为代码2，功能相同的 `getValue` 方法被boxes元素通过原型来引用，而不是单独创建，降低了内存使用率

```js
//代码1
const boxes = [
  { value: 1, getValue() { return this.value; } },
  { value: 2, getValue() { return this.value; } },
  { value: 3, getValue() { return this.value; } },
];

//代码2
const boxPrototype = {
  getValue() {
    return this.value;
  },
};

const boxes = [
  { value: 1, __proto__: boxPrototype },
  { value: 2, __proto__: boxPrototype },
  { value: 3, __proto__: boxPrototype },
];
```

构造函数的使用可以简化以上代码复杂度，它会自动为每个构造的对象设置 `原型`。构造函数是使用 `new` 调用的函数

`Box.prototype` 与我们之前创建的 `boxPrototype` 并无太大区别——它只是一个普通的对象。通过构造函数创建的每一个实例都会自动将构造函数的 `prototype` 属性作为其 `原型`。`Constructor.prototype` 默认具有一个自有属性：`constructor`，它引用了构造函数本身，即 `Box.prototype.constructor === Box`。这允许我们在任何实例中访问原始构造函数

```js
// 构造函数
function Box(value) {
  this.value = value;
}
// 使用 Box() 构造函数创建的所有盒子都将具有的属性
Box.prototype.getValue = function () {
  return this.value;
};

const boxes = [new Box(1), new Box(2), new Box(3)];
```

类是构造函数的语法糖，上述代码使用类结构改写为：

```js
class Box {
  constructor(value) {
    this.value = value;
  }
  // 在 Box.prototype 上创建方法
  getValue() {
    return this.value;
  }
}

const boxes = [new Box(1), new Box(2), new Box(3)];
```

### 字面量的隐式构造函数

JavaScript 中的一些字面量语法会创建隐式设置 `原型` 的实例

```js
// 对象字面量（没有 `__proto__` 键）自动将 `Object.prototype` 作为它们的 `[[Prototype]]`
const object = { a: 1 };
Object.getPrototypeOf(object) === Object.prototype; // true

// 数组字面量自动将 `Array.prototype` 作为它们的 `[[Prototype]]`
const array = [1, 2, 3];
Object.getPrototypeOf(array) === Array.prototype; // true
```

### 基于原型链的继承

默认原型链：

```js
function Constructor() {}
const obj = new Constructor();
// obj ---> Constructor.prototype ---> Object.prototype ---> null
```

通过 `Object.setPrototypeOf()`函数设置 `Constructor.prototype` 的 `原型` ：

```js
//原型链继承
function Base() {}
function Derived() {
    Base.call(this)    //继承Base类属性
}
// 将 `Derived.prototype` 的 `原型` 设置为 `Base.prototype`，继承方法
Object.setPrototypeOf(Derived.prototype, Base.prototype);
const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

更传统的原型继承：

```js
function Base() {}
function Derived() {
    Base.call(this)
}
Derived.prototype = Object.create(Base.prototype);
Derived.prototype.constructor = Derived;
const obj = new Derived();
```

在类的术语中，这等同于使用 `extends` 语法

```js
class Base {}
class Derived extends Base {
    super()
}
const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

## 类

类的三个关键特征：

- 构造函数
- 实例方法和实例字段
- 静态方法和静态字段

### 声明类

类通常通过*类声明*来创建。在类体内，有若干特性可用

```js
class MyClass {
  constructor(name) {  // 构造函数
    this.name=name     //实例字段
  }   
  myField = "foo";     // 实例字段(ES2022)
  myMethod() { }       // 实例方法
  static myStaticField = "bar";     // 静态字段
  static myStaticMethod() { }       // 静态方法
  static { }   // 静态块
  // 字段、方法、静态字段、静态方法、静态块都可以使用“私有”形式
  #myPrivateField = "bar";
}
```

转为构造函数表述：

```js
function MyClass(name) {
  this.name=name
  this.myField = "foo";
}
MyClass.prototype.myMethod = function () { };
MyClass.myStaticField = "bar";
MyClass.myStaticMethod = function () { };
```

私有字段和方法是类中的新特性，在函数构造器中并没有与之等价的语法

类似于函数，类声明也有其表达式形式。类表达式也可以有名字。表达式的名字只在类主体内可见

```js
const Car = class {
    //类主体
}

const Cat = class CatClass {
    // 类主体  这里 Cat 和 CatClass 指向同一个类
}
const c1 = new CatClass()   //报错，应该用Cat
```

### constructor

在类的构造函数里，`this` 的值指向新创建的实例，可以赋予它新的属性，或者读取已有的属性

`this` 的值将自动作为 `new` 的结果返回。不建议从构造函数中返回任何值——因为如果你返回一个非原始类型的值，它将成为 `new` 表达式的值，而 `this` 的值将被丢弃

### 实例方法

定义实例方法，它将在所有实例之间共享。一个函数可以在所有实例之间共享，且在不同实例调用时其行为也不同，因为 `this` 的值不同。实际上，它被定义在所有实例的原型上，即 `Class.prototype`

### 私有字段

私有字段是以 `#`开头的标识符。井号是这个字段名的必要部分，这也就意味着私有字段永远不会与公共字段或方法发生命名冲突。为了在类中的任何地方引用一个私有字段，你必须在类体中*声明*它（你不能在类体外部创建私有元素）。除此之外，私有字段与普通属性几乎是等价的

JavaScript 中的私有字段是*硬私有*的：如果类没有实现暴露这些私有字段的方法，也就没有任何机制可以从类外访问它们。这意味着你可以对类的私有字段做任何重构，只要暴露的方法的行为保持不变即可

类方法可以读取其他实例的私有字段，只要它们属于同一个类即可

```js
class Color {
  #values;
  constructor(r, g, b) {
    this.#values = [r, g, b];
  }
  redDifference(anotherColor) {
    if (!(#values in anotherColor)) {
      throw new TypeError("期望 Color 实例");
    }
    return this.#values[0] - anotherColor.#values[0];
  }
}
```

`#` 是一种特殊的标识符语法，不能像字符串一样使用该字段名。`"#values" in anotherColor` 会查找一个名为 `"#values"` 的属性，而不是一个私有字段

私有字段的限制：在单个类中，相同的名称不能声明两次，且它们不能被删除

### 访问器字段

*访问器字段*允许我们像访问“实际属性”一样操作某些东西

```js
class Color {
  constructor(r, g, b) {
    this.values = [r, g, b];
  }
  get red() { return this.values[0]; }
  set red(value) { this.values[0] = value; }
}
const red = new Color(255, 0, 0);
red.red = 0;
console.log(red.red); // 0
```

这就像是对象有了一个 `red` 属性——但实际上，实例上并没有这样的属性！实例只有两个方法，分别以 `get` 和 `set` 为前缀，而这使得我们可以像操作属性一样操作它们

当使用 `get` 关键字时，属性将被定义在实例的原型上，当使用`Object.defineProperty()`时，属性将被定义在实例自身上

### 公共字段

公共字段几乎等价于将一个属性赋值给 `this`

```js
class MyClass {
  luckyNumber = Math.random();
}
//等同于：
class MyClass {
  constructor() {
    this.luckyNumber = Math.random();
  }
}
```

### 静态属性

*静态属性*是一组在类本身上定义的特性，而不是在类的实例上定义的特性。这些特性包括：

- 静态方法
- 静态字段
- 静态 getter 与 setter

静态属性与实例属性的区别在于：

- 它们有 `static` 前缀，且
- 它们不能从实例中访问

静态方法中只能访问静态属性，因为它不属于任何实例，无法访问实例属性

有一个特殊结构叫做*静态初始化块*，它是一个在类第一次加载时运行的代码块，静态初始化块几乎等价于在类声明之后立即执行一些代码。唯一的区别是它们可以访问静态私有元素

```js
class MyClass {
  static {
    MyClass.myStaticProperty = "foo";
  }
}
```

### 扩展与继承

在面向对象编程中，我们更愿意创建一个*派生类*。派生类可以访问父类的所有公共属性。在 JavaScript 中，派生类是通过 [`extends`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends) 子句声明的，它指示它扩展自哪个类

```js
class A {
  constructor(name) {
    this.name=name
  }
}
class B extends A {
  constructor(name, age) {
    super(name);
    this.age=age
  }
}
```

构造函数中在访问 `this` 之前，必须调用 `super()`，这是 JavaScript 的要求，`super()` 调用父类的构造函数来初始化 `this`——大致相当于 `this = new A(name)`

派生类会继承父类的所有方法，也可以覆盖父类的方法

在派生类内，可以使用 `super` 访问父类的方法。这允许在避免代码重复的情况下增强父类的方法

派生类无权访问父类的私有字段

## 模块













​	
