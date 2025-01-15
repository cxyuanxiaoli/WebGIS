const p1 = {
  name: "John",
  age: 30
}

// let a: string
// a = 'Hello'
console.log(`Hello, my name is ${p1.name} and I am ${p1.age} years old.`)

//any类型
let a: any
a = 'Hello'
a = 10 
a = false

let b

let c: any
c = 1

let x: string
x = c

//unknown类型
let m: unknown
m = 'Hello'

let n: string
if (typeof m === 'string') {
  n = m
}
n = m as string
n = <string>m

let y: any
// console.log(y.a)

let z: unknown = 'Hello'
// console.log(z.length)
console.log((z as string).length)

let p: string = 'Hello'
if (typeof p === 'string') {
  console.log(p.length)
} else {
  console.log(p)  //
}

//never类型
function throwError(): never {
  throw new Error('Error occurred')
}

// void类型
function getSum(a: number, b: number): void {
  console.log(a + b)
}

let res = getSum(10, 20)

// object类型
let obj: object
obj = {}
obj = [1, 2, 3]
obj = function () { }
obj = new String('Hello')
class Person { }
obj = new Person()

// obj=1
// obj=true
// obj="Hello"
// obj=null
// obj=undefined

// Object类型
let Obj: Object
// Obj=null
// Obj=undefined

//限制person对象必须有name属性，age为可选属性
let person: { name: string, age?: number }
let person1: { name: string; age?: number }
let person2: {
  name: string
  age?: number
}

let person3: {
  name: string,
  age?: number,
  [key: string]: any
}

//函数类型
let count: (a: number, b: number) => number
count = function (x, y) {
  return x + y
}

//数组类型
let arr1: number[]
let arr2: Array<number>

//元组类型
let tuple1: [string, number]
//第二个元素可选
let tuple2: [string, number?]
//第一个元素必须是string类型，后面可有任意数量的number类型
let tuple3: [string, ...number[]]

tuple1 = ['hello', 10]
tuple2 = ['hello']
tuple3 = ['hello', 1, 2, 3, 4, 5]

//枚举类型
enum Direction {
  Up,
  Down,
  Left,
  Right
}

// console.log(Direction)
console.log(Direction.Up)
// console.log(Direction[0])

function walk(dir: Direction) {
  if (dir === Direction.Up) {
    console.log('Going up')
  } else if (dir === Direction.Down) {
    console.log('Going down')
  } else if (dir === Direction.Left) {
    console.log('Going left')
  } else if (dir === Direction.Right) {
    console.log('Going right')
  } else {
    console.log('Invalid direction')
  }
}
walk(Direction.Up)

const enum Color {
  Red = 1,
  Green,
  Blue
}
console.log(Color.Green) //2

enum Direction2 {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
console.log(Direction2)  //{Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT'}
console.log(Direction2.Up) // 'UP'

//type类型
type num = number
let num1: num = 123
type strList = string[]
let list1: strList = ['hello', 'world']

type status = number | string
let code1: status = 200
let code2: status = 'OK'

type gender = 'Male' | 'Female'
let g1: gender = 'Male'

type Rectangle = {
  length: number,
  width: number
}
type G3d = {
  height: number
}
type Rect3D = Rectangle & G3d
let rect3d: Rect3D = {
  length: 10,
  width: 20,
  height: 30
}

function demo(): void {
  console.log('demo')
  return undefined

  // return 123 //error
  // return 'hello' //error
}

type LogFunc = () => void
let f1: LogFunc = function () {
  return 123
}

let src = [1, 2, 3]
let dst = [0]
src.forEach((item) => dst.push(item))

//定义接口
interface IPerson {
  name: string,
  age: number,
  speak(): void
}
//接口继承
interface IStudent extends IPerson {
  grade: number
  study(): void
}
let stu: IStudent = {
  name: 'Tom',
  age: 20,
  grade: 3,
  speak() {
    console.log('hello')
  },
  study() {
    console.log('studying')
  }
}

//实现接口
class Student implements IPerson {
  constructor(
    public name: string,
    public age: number,
    public grade: number
  ) { }
  speak(): void {
    console.log(`I am ${this.name} ,${this.age} years old and grade ${this.grade}.`)
  }
  study() {
    console.log('studying')
  }
}

//约束对象结构
let per1: IPerson = {
  name: 'John',
  age: 30,
  speak() {
    console.log(this.name + ',' + this.age)
  }
}

//定义接口
interface IFunc {
  (a: number, b: number): number
}
//约束函数结构
let fun: IFunc = (x, y) => {
  return x + y
}

//接口的自动合并
interface IA{
  a:number
}
interface IA{
  b:string
}
let ia:IA={
  a:123,
  b:'hello'
}

//定义抽象类
abstract class Package{
  //构造方法
  constructor(
    public weight:number
  ){}
  //抽象方法
  abstract calculate():number
  //普通方法
  printPackage(){
    console.log(`the weight of package is ${this.weight},the price is ${this.calculate()}`)    
  }
}
//继承抽象类
class StardardPackage extends Package{
  constructor(
    weight:number,
    private unitPrice:number
  ) {
    super(weight)
  }
  //实现抽象方法
  calculate(): number {
    return this.weight * this.unitPrice
  }
}

let sp=new StardardPackage(8,10)
sp.printPackage()

let abc:Array<string> = ['a', 'b', 'c']

//类型声明文件
import { add,mul } from './demo.js'

console.log(add(1,2))
console.log(mul(2,3)) 