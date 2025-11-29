"use strict";
function multiply(a, b = 1) {
  return a * b;
}

console.log(multiply(5, 2));
console.log(multiply(5));

function test(num = 1) {
  console.log(typeof num);
}
test();
test(undefined);
test("123");
test(null);

function greet(name, greeting = "Hello", message = greeting + " " + name) {
  return [name, greeting, message];
}

console.log(greet("David"));
console.log(greet("David", "Hi"));
console.log(greet("David", "Hi", "Happy Birthday!"));

function f(x = 1, y) {
  return [x, y];
}
console.log(f());
console.log(f(2));

function fn([x, y], { z }) {
  console.log(x, y, z);
}

fn([1, 2], { z: 3 });

function fn([x, y] = [0, 0], { z } = { z: 0 }) {
  console.log(x, y, z);
}

fn([10, 20], { z: 30 });
console.log("-------------");

function sum(...args) {
  return args.reduce((acc, val) => acc + val, 0);
}

console.log(sum(1, 2, 3, 4, 5));

function fn2(...[x, y, ...others]) {
  console.log(x, y, others);
}
function fn3(x, y, ...others) {
  console.log(x, y, others);
}
fn2(1, 2, 3, 4, 5);
fn3(1, 2, 3, 4, 5);
console.log(fn3.length);
function fn4(x, y, z = 10) {}
function fn5(x = 1, y, z) {}
function fn52(...args) {}
console.log(fn4.length);
console.log(fn5.length);
console.log(fn52.length);
console.log("----------------------");

function fn6(a, ...args) {
  arguments[0] = 2;
  console.log(a);
  console.log(args);

  console.log(arguments, arguments.length);
}

fn6(1, "a", true);
console.log("---------------");

const fn7 = (a, b) => {
  return a + b;
};
const fn8 = (a, b) => a + b;

const fn9 = (name, age) => {
  return {
    name,
    age,
  };
};
const fn10 = (name, age) => ({ name, age });
