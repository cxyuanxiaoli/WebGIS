const obj1 = {
  a: 1,
  b: {
    c: 11,
  },
};

console.log(Object.keys(obj1));
console.log(Object.getOwnPropertyNames(obj1));

function listAllProperties(o) {
  let objectToInspect;
  let result = [];

  for (
    objectToInspect = o;
    objectToInspect !== null;
    objectToInspect = Object.getPrototypeOf(objectToInspect)
  ) {
    result = result.concat(Object.getOwnPropertyNames(objectToInspect));
  }

  return result;
}

console.log(listAllProperties(obj1));
console.log("--------------------");

function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function () {
  return this.name;
};

const p1 = new Person("John", 18);
console.log(p1);
console.log(p1.getName());

const p2 = Object.create(Person.prototype);
p2.name = "Alice";
p2.age = 20;

console.log(p2.getName());

const p3 = {
  name: "Bob",
  age: 21,
  getName: function () {
    return this.name;
  },
};
const p4 = Object.create(p3);
console.log(p4.__proto__ === p3);
console.log(p4, p4.name);
p4.name = "Charlie";
console.log(p4, p4.getName());

console.log(listAllProperties(p4));
console.log("------------");

console.log(Person.prototype.constructor);
console.log(p1.constructor);

console.log(Object.getPrototypeOf(p1) === Person.prototype);
console.log(p1.__proto__ === Person.prototype);
console.log("------------");

const o = {
  a: 1,
  b: 2,
  // __proto__ 设置了 [[Prototype]]。在这里它被指定为另一个对象字面量。
  __proto__: {
    b: 3,
    c: 4,
  },
};
console.log(o.a, o.b, o.c);
console.log(Object.getPrototypeOf(o).b);
// { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> Object.prototype ---> null
console.log(Object.getPrototypeOf(Object.getPrototypeOf(o)));

// 构造函数
function Box1(value) {
  this.value = value;
}
// 使用 Box() 构造函数创建的所有盒子都将具有的属性
Box1.prototype.getValue = function () {
  return this.value;
};

const boxes = [new Box1(1), new Box1(2), new Box1(3)];
console.log(boxes);

class Box2 {
  constructor(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}
const boxes2 = [new Box2(1), new Box2(2), new Box2(3)];
console.log(boxes2);
console.log(Object.getPrototypeOf(boxes[0]).constructor);
console.log(Object.getPrototypeOf(boxes2[0]).constructor);
console.log(Object.getPrototypeOf(Box1).constructor);
console.log(Object.getPrototypeOf(Box2).constructor);

console.log(Function.__proto__.constructor);
console.log(Object.__proto__.__proto__ === Object.prototype);
console.log(boxes2[0] instanceof Object);
console.log("----------------------");

function Base() {}
function Derived() {}
// 将 `Derived.prototype` 的 `原型` 设置为 `Base.prototype`
Object.setPrototypeOf(Derived.prototype, Base.prototype);
const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
console.log(obj.constructor);
console.log(Object.getPrototypeOf(obj).constructor);
let proto = Object.getPrototypeOf(Object.getPrototypeOf(obj));
console.log(proto.constructor);
console.log(Object.getPrototypeOf(proto).constructor);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(proto)));

function A(name) {
  this.name = name;
}
A.prototype.getName = function () {
  return this.name;
};
function B(name, age) {
  A.call(this, name);
  this.age = age;
}
Object.setPrototypeOf(B.prototype, A.prototype);

const b1 = new B("John", 20);
const b2 = new B("Alice", 25);
console.log(b1, b2);
console.log(b1.getName());

const aaa = Object.create(null);
console.log("-----------------");

const objA = {
  foo: function () {
    /* code */
  },
  bar: function* () {
    let index = 0;
    while (true) yield index++;
  },
  f: async function () {
    await "some_promise";
  },
  ["foo" + 2]: function () {
    console.log("foo2");
  },
};

const objB = {
  foo() {
    /* code */
  },
  *bar() {
    let index = 0;
    while (true) yield index++;
  },
  async f() {
    await "some_promise";
  },
  ["foo" + 2]() {
    console.log("foo2");
  },
};

objA.foo2();
objB.foo2();
