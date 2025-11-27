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



## 循环和迭代

### for ... in

`for...in` 语句循环一个指定的变量来循环一个对象所有可枚举的属性。



### for ... of

`for...of` 语句在可迭代对象（包括`Array`、`Map`、`Set`、`arguments` 等等）上创建了一个循环，对值的每一个独特属性调用一次迭代。



## 对象

### 枚举对象的属性

* for ... in 循环，该方法依次访问一个对象及其原型链中所有可枚举的属性
* Object.keys(o) 该方法返回对象`o`自身包含（不包括原型中）的所有可枚举属性的名称的数组
* Object.getOwnPropertyNames(o) 该方法返回对象`o`自身包含（不包括原型中）的所有属性（无论是否可枚举）的名称的数组



### 创建对象

1. 对象字面量
2. 构造函数
3. Object.create  该方法允许为创建的对象选择一个原型对象，而不用定义构造函数

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













​	
