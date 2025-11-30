const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a, b, c);

const obj = { prop1: 10, prop2: 20, prop3: 30 };
const { prop1: x, prop2: y, prop3: z } = obj;
console.log(x, y, z);

const colors = ["red", "green", "blue"];

const [red, green, blue] = colors;

let red2, green2, blue2;

[red2, green2, blue2] = colors;

const obj2 = { a: 1, b: { c: 2 } };
const {
  a: valA,
  b: { c: valC },
} = obj2;
console.log(valA, valC);

let valAA, valCC;

({
  a: valAA,
  b: { c: valCC },
} = obj2);
console.log(valAA, valCC);

const myObj = { name: "John", age: 30, city: "New York" };
// const { name, age, city } = myObj;
const { name: name, age: age, city: city } = myObj;

const [elem1 = 1] = [];
console.log(elem1); // 1
const { b: prop1 = 2, c: prop2 = 3 } = { b: undefined };
console.log(prop1, prop2); // 2 3

const arr2 = [1, 2, 3, 4, 5];
const [first, second, ...otherElem] = arr2;
console.log(first, second, otherElem); // 1 2 [3,4,5]

const obj3 = { p: 42, q: true, r: "hello" };
const { p, ...otherProps } = obj3;
console.log(p, otherProps); // 42 { q: true, r: "hello" }
