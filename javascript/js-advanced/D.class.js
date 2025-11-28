class MyClass {
  // 构造函数
  constructor(name) {
    // 构造函数主体
    this.name = name;
  }
  // 实例字段
  myField = "foo";
  // 实例方法
  myMethod() {
    // myMethod 主体
    console.log(this.name);
  }
  // 静态字段
  // static myStaticField = "bar";
  // 静态方法
  static myStaticMethod() {
    // myStaticMethod 主体
    console.log("static method log");
  }
  static #myPrivateStaticField = "foo";
  // 静态块
  static {
    MyClass.filed2 = 123;
    this.myStaticField = "bar2";
    // 静态初始化代码
  }
  // 字段、方法、静态字段、静态方法、静态块都可以使用“私有”形式
  #myPrivateField = "bar";
}

const c1 = new MyClass("c1");
const c2 = new MyClass("c2");
console.log(c1);
c1.myField = "bar";
console.log(c1, c2);
console.log(c1.constructor);

console.log(Object.getPrototypeOf(c1).myField);
console.log(MyClass.myStaticField);
MyClass.myStaticMethod();

function MyClass2() {
  this.myField = "foo";
  // 构造函数主体
}
MyClass2.myStaticField = "bar";
MyClass2.myStaticMethod = function () {
  // myStaticMethod 主体
};
MyClass2.prototype.myMethod = function () {
  // myMethod 主体
};
console.log("-----------------");

const Car = class {
  constructor(color) {
    this.color = color;
  }
};
const car1 = new Car("red");
console.log(car1);

const Cat = class CatClass {
  // 类主体  这里 Cat 和 CatClass 指向同一个类
};
const cat = new Cat();

class A {
  constructor() {}

  say() {
    console.log("A class");
  }
}
class B extends A {
  constructor() {
    super();
  }
  say() {
    console.log("B class");
  }
}
class C extends A {
  constructor() {
    super();
  }
  say() {
    console.log("C class");
  }
}

function testA(obj) {
  return obj instanceof A;
}
console.log(new A());
console.log(testA(new B()));
const objA = new A();
const objB = new B();
objB.say();
Object.getPrototypeOf(B.prototype).say();

const arr = [new A(), new B(), new C()];

arr.forEach((item) => item.say());

class Person {
  #id;
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  get id() {
    console.log(this);
    return this.#id;
  }
  set id(value) {
    console.log("set id--");
    this.#id = value;
  }
}
class Student extends Person {
  constructor(name, age) {
    super(name, age);
  }
}
const s1 = new Student("Alice", 20);
const s2 = new Student("Bob", 21);
s1.id = 101;
console.log(s1.id);

console.log(s2.id);
