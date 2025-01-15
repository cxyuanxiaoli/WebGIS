"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p1 = {
    name: "John",
    age: 30
};
// let a: string
// a = 'Hello'
console.log(`Hello, my name is ${p1.name} and I am ${p1.age} years old.`);
//any类型
let a;
a = 'Hello';
a = 10;
a = false;
let b;
let c;
c = 1;
let x;
x = c;
//unknown类型
let m;
m = 'Hello';
let n;
if (typeof m === 'string') {
    n = m;
}
n = m;
n = m;
let y;
// console.log(y.a)
let z = 'Hello';
// console.log(z.length)
console.log(z.length);
let p = 'Hello';
if (typeof p === 'string') {
    console.log(p.length);
}
else {
    console.log(p); //
}
//never类型
function throwError() {
    throw new Error('Error occurred');
}
// void类型
function getSum(a, b) {
    console.log(a + b);
}
let res = getSum(10, 20);
// object类型
let obj;
obj = {};
obj = [1, 2, 3];
obj = function () { };
obj = new String('Hello');
class Person {
}
obj = new Person();
// obj=1
// obj=true
// obj="Hello"
// obj=null
// obj=undefined
// Object类型
let Obj;
// Obj=null
// Obj=undefined
//限制person对象必须有name属性，age为可选属性
let person;
let person1;
let person2;
let person3;
//函数类型
let count;
count = function (x, y) {
    return x + y;
};
//数组类型
let arr1;
let arr2;
//元组类型
let tuple1;
//第二个元素可选
let tuple2;
//第一个元素必须是string类型，后面可有任意数量的number类型
let tuple3;
tuple1 = ['hello', 10];
tuple2 = ['hello'];
tuple3 = ['hello', 1, 2, 3, 4, 5];
//枚举类型
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
// console.log(Direction)
console.log(Direction.Up);
// console.log(Direction[0])
function walk(dir) {
    if (dir === Direction.Up) {
        console.log('Going up');
    }
    else if (dir === Direction.Down) {
        console.log('Going down');
    }
    else if (dir === Direction.Left) {
        console.log('Going left');
    }
    else if (dir === Direction.Right) {
        console.log('Going right');
    }
    else {
        console.log('Invalid direction');
    }
}
walk(Direction.Up);
console.log(2 /* Color.Green */); //2
var Direction2;
(function (Direction2) {
    Direction2["Up"] = "UP";
    Direction2["Down"] = "DOWN";
    Direction2["Left"] = "LEFT";
    Direction2["Right"] = "RIGHT";
})(Direction2 || (Direction2 = {}));
console.log(Direction2); //{Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT'}
console.log(Direction2.Up); // 'UP'
let num1 = 123;
let list1 = ['hello', 'world'];
let code1 = 200;
let code2 = 'OK';
let g1 = 'Male';
let rect3d = {
    length: 10,
    width: 20,
    height: 30
};
function demo() {
    console.log('demo');
    return undefined;
    // return 123 //error
    // return 'hello' //error
}
let f1 = function () {
    return 123;
};
let src = [1, 2, 3];
let dst = [0];
src.forEach((item) => dst.push(item));
let stu = {
    name: 'Tom',
    age: 20,
    grade: 3,
    speak() {
        console.log('hello');
    },
    study() {
        console.log('studying');
    }
};
//实现接口
class Student {
    constructor(name, age, grade) {
        this.name = name;
        this.age = age;
        this.grade = grade;
    }
    speak() {
        console.log(`I am ${this.name} ,${this.age} years old and grade ${this.grade}.`);
    }
    study() {
        console.log('studying');
    }
}
//约束对象结构
let per1 = {
    name: 'John',
    age: 30,
    speak() {
        console.log(this.name + ',' + this.age);
    }
};
//约束函数结构
let fun = (x, y) => {
    return x + y;
};
let ia = {
    a: 123,
    b: 'hello'
};
//定义抽象类
class Package {
    //构造方法
    constructor(weight) {
        this.weight = weight;
    }
    //普通方法
    printPackage() {
        console.log(`the weight of package is ${this.weight},the price is ${this.calculate()}`);
    }
}
//继承抽象类
class StardardPackage extends Package {
    constructor(weight, unitPrice) {
        super(weight);
        this.unitPrice = unitPrice;
    }
    //实现抽象方法
    calculate() {
        return this.weight * this.unitPrice;
    }
}
let sp = new StardardPackage(8, 10);
sp.printPackage();
let abc = ['a', 'b', 'c'];
//类型声明文件
const demo_js_1 = require("./demo.js");
console.log((0, demo_js_1.add)(1, 2));
console.log((0, demo_js_1.mul)(2, 3));
