let num = 0;
for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    if (i == 5 && j == 5) {
      break; // 在 i = 5，j = 5 时，跳出所有循环，
      // 返回到整个 outPoint 下方，继续执行
    }
    num++;
  }
}
console.log(num);
num = 0;
outPoint: for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    if (i == 5 && j == 5) {
      break outPoint; // 在 i = 5，j = 5 时，跳出所有循环，
      // 返回到整个 outPoint 下方，继续执行
    }
    num++;
  }
}
console.log(num);

console.log("------------------");

function dump_props(obj, obj_name) {
  let result = "";
  for (let i in obj) {
    result += obj_name + "." + i + " = " + obj[i] + "<br>";
  }
  result += "<hr>";
  return result;
}
const obj1 = { a: 1, b: 2, c: 3 };
console.log(dump_props(obj1, "obj1"));
for (let i in obj1) {
  console.log(i + ":" + obj1[i]);
}
console.log("--------");

const arr1 = [1, 2, 3];
arr1.myProp = "myValue";
for (let i in arr1) {
  console.log(i + ":" + arr1[i]);
}
for (let i of arr1) {
  console.log(i);
}
