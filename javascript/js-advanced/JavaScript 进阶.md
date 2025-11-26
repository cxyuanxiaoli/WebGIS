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
class Derived extends Base {}
const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

















