const arr = new Array(10);
console.log(arr); // [empty x 10]
const arr2 = [10];
console.log(arr2); // [10]
const arr3 = Array.of(10);
console.log(arr3);
console.log("----------------");

const arr4 = new Array();
arr4.length = 5;
console.log(arr4);

const cats = ["Dusty", "Misty", "Twiggy"];
console.log(cats.length);
cats.length = 2;
console.log(cats);
cats.length = 0;
console.log(cats);
cats.length = 3;
console.log(cats);
console.log("-----------------");

const arr5 = [1, 2, 3, 4, 5];
arr5.name = "nums";
for (let i in arr5) {
  console.log(arr5[i]);
}
console.log("------------------");
for (let i of arr5) {
  console.log(i);
}
console.log("----------------");

const arr6 = [1, 2];
const arr7 = [3, 4, 5];
const arr8 = [7, 8, [9, 10]];
console.log(arr6.concat(arr7));
console.log(arr7.slice(1));
console.log(arr7.join(" - "));
console.log(arr8.flat());

const arr9 = [1, 2, 3, 4, 5];
const arr10 = [2, 7, 4, 6, 3];
arr9.reverse(); // [5, 4, 3, 2, 1]
console.log(arr9);
arr10.sort((a, b) => a - b);
console.log(arr10);
arr9.splice(1, 2, "a", "b");
console.log(arr9);

console.log(arr9.toReversed());
console.log(arr10.toSorted((a, b) => b - a));
console.log(arr9.toSpliced(1, 2, 4, 3));

console.log("arr9", arr9, "arr10", arr10);
console.log("---------------------");

const a = [1, 2, 3, 4, 5, 1];
console.log(a.at(0), a.at(-1));
console.log(a.indexOf(1), a.lastIndexOf(1));

console.log(a.findLastIndex((item) => item > 3));
console.log(a.reduce((preV, curV) => preV + curV, 0));
console.log(a.every((v) => v >= 0));
console.log(a.some((v) => v === 3));
console.log("-------------");

const ar = Array(5); // [ <5 empty items> ]
const b = [1, 2, , , 5]; // [ 1, 2, <2 empty items>, 5 ]
const c = [1, 2];
c[4] = 5; // [ 1, 2, <2 empty items>, 5 ]
const d = [1, 2];
d.length = 5; // [ 1, 2, <3 empty items> ]
const e = [1, 2, 3, 4, 5];
delete e[2]; // [ 1, 2, <1 empty item>, 4, 5 ]
console.log(ar, b, c, d, e);
console.log(ar[0]);

for (const i of b) {
  console.log(i);
}

console.log(...c);
console.log("-------------");

b.forEach((value) => console.log(value));
console.log(b.map((value) => value * value));
console.log("-------------------------");

const int8 = new Int8Array(5);
console.log(int8);
console.log(int8 instanceof Array);
console.log(
  Object.getPrototypeOf(Object.getPrototypeOf(int8)).constructor.name
);
const typedArray = Object.getPrototypeOf(Object.getPrototypeOf(int8));
console.log(Object.getPrototypeOf(typedArray).constructor.name);

console.log(int8.BYTES_PER_ELEMENT);

const buffer = new ArrayBuffer(8);
console.log(buffer);

const view = new Int8Array(buffer);
console.log(view);
for (let i = 0; i < view.length; i++) {
  view[i] = i * 2;
}
console.log(view, buffer);

const view2 = new Int16Array(buffer);
console.log(view2);

const int32 = new Int32Array(1);
int32[0] = 100;
console.log(int32);

const int88 = new Int8Array(int32.buffer);
console.log(int88);
