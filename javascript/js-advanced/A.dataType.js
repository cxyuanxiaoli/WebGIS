const a = Number(10);
console.log(a instanceof Number);
const b = new Number(10);
console.log(b instanceof Number);
console.log(typeof a);
console.log(typeof b);
console.log(a);
console.log(b);
console.log(Boolean(1));
console.log(typeof true);
console.log(new Boolean(1));
console.log(typeof new Boolean(1));
null;
undefined;
const big = 10n;
console.log(big);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MIN_SAFE_INTEGER);
console.log(Number.MAX_VALUE);
console.log(Number.MIN_VALUE);
console.log("----------------------");

console.log("37" - 0 + 3);
console.log(parseInt("10", 10));
console.log(parseFloat("1.01"));
console.log("----------------------");

const arr1 = ["A", "B", "C"];
console.log(arr1.toString());
const arr2 = ["A", , "C", ,];
console.log(arr2);
console.log(arr2[1]);
const arr3 = arr2.map((item) => {
  return item.toLowerCase();
});
console.log(arr3);
console.log("----------------------");

const num1 = 0b001;
const num2 = 0o050;
const num3 = 101;
const num4 = 0x00a;
console.log(num1, num2, num3, num4);
const num5 = 1e-2;
console.log(num5);

const myObj = {
  __proto__: Number,
};
console.log(myObj.MAX_VALUE);
console.log("----------------------");

const regexp1 = /^[a-z]{3,5}$/;
console.log(regexp1.test("abc"));

console.log(`在 JavaScript 中，“\\n” 是换行符。`);

const print = (segments, ...args) => {
  console.log(segments);
  console.log(args);
  const format = (str) => {
    if (typeof str === "number") return str;
    else if (str instanceof Array) return str.join("--");
  };
  let msg = segments[0];
  segments.slice(1).forEach((segment, index) => {
    msg += format(args[index]) + segment;
  });

  console.log(msg);
};

const todos = ["学习 JavScript", "学习 Web API", "构建网站", "利润！"];
print`我有 ${todos.length} 个任务：${todos}`;

const str =
  "this string \
is broken \
across multiple \
lines.";
console.log(str);
console.log("---------------------");

console.log(typeof Symbol("a"));
console.log(BigInt(10));
console.log(typeof BigInt(10n));

class A {}
class B extends A {}
const bObj = new B();
console.log(bObj instanceof A);
console.log(bObj);

const sym1 = Symbol("a");
const sym2 = Symbol("a");
console.log(sym1);
console.log(Symbol.iterator);

console.log(sym1 === sym2);
console.log("-----------------");

const arr4 = [1, 2, 3];
console.log(arr4["1"]);
console.log(arr4[1]);
