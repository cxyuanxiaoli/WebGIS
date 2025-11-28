"use strict";
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
console.log("------------------");

const myObj1 = {};
Object.defineProperty(myObj1, "name", {
  value: "John",
  writable: false, //是否可写
  enumerable: true, //是否可枚举
  configurable: true, //是否可配置
});
// myObj1.name = "Alice";
// console.log(myObj1);
Object.defineProperty(myObj1, "name", {
  writable: true,
  configurable: false,
});
myObj1.name = "Alice";
console.log(myObj1);
Object.defineProperty(myObj1, "name", {
  writable: false,
});
console.log(myObj1);
// myObj1.name = "Bob";

myObj1.age = 20;
console.log(Object.getOwnPropertyDescriptor(myObj1, "age"));
Object.defineProperty(myObj1, "age", {
  writable: false,
});
console.log(Object.getOwnPropertyDescriptor(myObj1, "age"));
Object.defineProperty(myObj1, "age", {
  get() {
    return 20;
  },
});
console.log(Object.getOwnPropertyDescriptor(myObj1, "age"));
console.log("------------------------");

console.log(myObj1.hasOwnProperty("name"));
console.log(myObj1.propertyIsEnumerable("name"));
console.log(Object.hasOwn(myObj1, "name"));
console.log("name" in myObj1);

const sym = Symbol("id");
Object.defineProperty(myObj1, sym, {
  value: 1,
  enumerable: false,
});
console.log(myObj1.propertyIsEnumerable(sym));
console.log(sym in myObj1);

for (let key in myObj1) {
  console.log(key + ":" + myObj1[key]);
}

const SimplePropertyRetriever = {
  getOwnEnumerables(obj) {
    return this._getPropertyNames(obj, true, false, this._enumerable);
    // 或使用 for...in 和 Object.hasOwn 过滤，或者：return Object.keys(obj);
  },
  getOwnNonenumerables(obj) {
    return this._getPropertyNames(obj, true, false, this._notEnumerable);
  },
  getOwnEnumerablesAndNonenumerables(obj) {
    return this._getPropertyNames(
      obj,
      true,
      false,
      this._enumerableAndNotEnumerable
    );
    // 或者仅使用：return Object.getOwnPropertyNames(obj);
  },
  getPrototypeEnumerables(obj) {
    return this._getPropertyNames(obj, false, true, this._enumerable);
  },
  getPrototypeNonenumerables(obj) {
    return this._getPropertyNames(obj, false, true, this._notEnumerable);
  },
  getPrototypeEnumerablesAndNonenumerables(obj) {
    return this._getPropertyNames(
      obj,
      false,
      true,
      this._enumerableAndNotEnumerable
    );
  },
  getOwnAndPrototypeEnumerables(obj) {
    return this._getPropertyNames(obj, true, true, this._enumerable);
    // 或者使用未过滤的 for...in
  },
  getOwnAndPrototypeNonenumerables(obj) {
    return this._getPropertyNames(obj, true, true, this._notEnumerable);
  },
  getOwnAndPrototypeEnumerablesAndNonenumerables(obj) {
    return this._getPropertyNames(
      obj,
      true,
      true,
      this._enumerableAndNotEnumerable
    );
  },
  // 私有的静态属性检查器回调
  _enumerable(obj, prop) {
    return Object.prototype.propertyIsEnumerable.call(obj, prop);
  },
  _notEnumerable(obj, prop) {
    return !Object.prototype.propertyIsEnumerable.call(obj, prop);
  },
  _enumerableAndNotEnumerable(obj, prop) {
    return true;
  },
  // 受到 http://stackoverflow.com/a/8024294/271577 的启发
  _getPropertyNames(obj, iterateSelf, iteratePrototype, shouldInclude) {
    const props = [];
    do {
      if (iterateSelf) {
        Object.getOwnPropertyNames(obj).forEach((prop) => {
          if (props.indexOf(prop) === -1 && shouldInclude(obj, prop)) {
            props.push(prop);
          }
        });
      }
      if (!iteratePrototype) {
        break;
      }
      iterateSelf = true;
      obj = Object.getPrototypeOf(obj);
    } while (obj);
    return props;
  },
};

SimplePropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(
  myObj1
).forEach((value, prop) => {
  console.log(prop + ":" + value);
});
console.log("-------------------");

const myObj2 = {
  a: 1,
  e: 5,
  [Symbol("c")]: 3,
};

console.log(Object.getPrototypeOf(myObj2) === Object.prototype);
Object.defineProperties(myObj2, {
  b: {
    value: 2,
    enumerable: false,
  },
  [Symbol("d")]: {
    value: 4,
    enumerable: false,
  },
});
console.log(myObj2);

console.log(Object.keys(myObj2));
console.log(Object.values(myObj2));
console.log(Object.entries(myObj2));

console.log("names", Object.getOwnPropertyNames(myObj2));
console.log("symbols", Object.getOwnPropertySymbols(myObj2));
console.log("symbols", Object.getOwnPropertyDescriptors(myObj2));
console.log(Reflect.ownKeys(myObj2));

const kvs = [];
for (let key in myObj2) {
  kvs.push([key, myObj2[key]]);
}
console.log(kvs);

const myObj3 = Object.assign({}, myObj2);
console.log(Object.getOwnPropertyDescriptors(myObj3));

console.log({ ...myObj2 });
console.log("--------------------");

const obj5 = {};
console.log(obj5);
console.log(obj5 + "");
console.log(obj5.toString()); // 默认情况下，与toString相同，返回"[object Object]"

const date = new Date();
console.log(date.toLocaleString()); // 根据本地时间格式返回，如"2021/12/29 上午10:30:00"

const number = 123456.789;
console.log(number.toLocaleString()); // 根据本地数字格式，如"123,456.789"（英语环境）或"123.456,789"（一些欧洲地区）

const array = [123456.789, new Date()];
console.log(array.toLocaleString()); // 数组的每个元素调用toLocaleString，然后用逗号连接。例如："123,456.789,2021/12/29 上午10:30:00"
console.log("----------------------");

const obj6 = {
  get prop() {
    return this._prop;
  },
  set prop(value) {
    this._prop = value;
  },
};
console.log(obj6);
obj6.prop = 123;
console.log(obj6.prop);
console.log(obj6);

delete obj6.prop;
console.log(obj6);
