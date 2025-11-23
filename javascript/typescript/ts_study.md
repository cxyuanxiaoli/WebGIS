# Typescript

## ts简介

### 编译ts文件

#### 命令行编译

1. 配置环境 ，全局安装ts： 

   ```
   npm i typescript -g
   ```

2. 编译文件：

   ```
   tsc index
   ```

#### 自动化编译

1. 创建typescript编译控制文件 tsconfig.json

   ```cmd
   tsc --init
   ```

2. 监视目录中的 .ts文件变化

   ```
   tsc --watch
   ```

## ts语法

### 类型声明

```ts
let a:number
```

### 类型推断

```ts
let b = '123'  //自动推断类型为 string
```

### 类型总览

1. javascript 中的数据类型

   * string
   * number
   * boolean
   * null
   * undefined
   * bigint
   * symbol
   * object

   其中object 包含：Array、Function、Date、Error等

2. typescript中的数据类型

   * 所有javascript类型
   * 六个新类型
     * any
     * unknown
     * never
     * void
     * tuple
     * enum
   * 用于自定义类型的方式
     * type
     * interface

### 常用类型

#### any

any的含义是：任意类型，一旦将变量类型限制为any，就意味着放弃了对该变量的类型检查

```ts
//显示声明any类型
let a: any
a = 'Hello'
a = 10
a = false
//隐式any类型
let b
```

any类型的变量，可以赋值给任意类型的变量

```ts
let c: any
c = 1
//不报错
let x: string
x = c
```

#### unknown

 unknown的含义是：未知类型

1. unknown可以理解为一个类型安全的any，适用于不确定数据的具体类型

   ```ts
   //声明unknown类型
   let m: unknown
   m = 'Hello'
   m = 10
   m = false
   
   let n: string
   n = m    //报错，不能将类型 unknown 分配给类型 string
   ```

2. unknown会强制开发者在使用之前进行类型检查，从而提供更强的类型安全性

   ```ts
   let m: unknown
   m = 'Hello'
   
   let n: string
   //第一种方法：加类型检查
   if(typeof m === 'string'){
     n = m
   }
   //第二种，断言
   n=m as string
   //断言的另一种写法
   n=<string>m
   ```

3. 读取any类型数据的任何属性都不会报错，而unknown正好与之相反

   ```ts
   let y:any
   console.log(y.a)  //不报错
   
   let z:unknown = 'Hello'
   console.log(z.length)     //报错
   console.log((z as string).length)    //断言后不报错
   ```

#### never

never的含义是：任何值都不是，简言之就是不能有值，undefined、null、' '、0 都不行！

1. 几乎不用never去直接限制变量，因为没有意义，例如：

   ```ts
   let p: never
   //报错，不能将类型xxx分配给类型 never
   p = 1
   p = 'Hello'
   p = true
   ```

2. never一般是typescript主动推断出来的，如：

   ```ts
   let p: string = 'Hello'
   if (typeof p === 'string') {
     console.log(p.length)
   } else {
     console.log(p)  //typescript推断此处p的类型为never
   }
   ```

   

3. never也可用于限制函数的返回值

   ```ts
   function throwError(): never {
     throw new Error('Error occurred')
   }
   ```

#### void

void 通常用于函数返回值声明，含义：函数返回值为空，调用者不应该依赖返回值进行任何操作

```ts
function getSum(a: number, b: number): void {
  console.log(a + b)
}

let res=getSum(10, 20)
if(res){   //报错，无法测试 void 类型的表达式的真实性
}
```

若函数返回类型为void，那么：

1. 从语法上讲，函数是可以返回undefined的，至于显示返回还是隐式返回，无所谓
2. 从语义上讲，函数调用者不应关心函数的返回值，也不应依赖函数返回值进行任何操作！即使函数返回了undefined值

#### object

关于object与Object，实际开发中用的相对较少，因为范围太大了

object的含义是：所有非原始类型，可存储对象、函数、数组等。

```ts
let obj:object
obj={}
obj=[1,2,3]
obj=function(){}
obj=new String('Hello')
class Person{}
obj=new Person()
//不能将类型xxx分配给类型 object
obj=1
obj=true
obj="Hello"
obj=null
obj=undefined
```

Object

官方描述：所有可以调用Object方法的类型

简单记忆：除了undefined和null的任何值

```ts
let Obj:Object
//不能将类型xxx分配给类型 Object
Obj=null
Obj=undefined
```

##### 声明对象类型

1. 实际开发中，限制一般对象，通常使用以下形式

   ```ts
   //限制person对象必须有name属性，age为可选属性，各属性间用逗号、分号或换行分隔
   let person: { name: string, age?: number }
   let person1: { name: string; age?: number }
   let person2: {
     name: string
     age?: number
   }
   ```

2. 索引签名：允许定义对象可以具有任意数量的属性，这些属性的键和类型是可变的，常用于描述类型不确定的属性（具有动态属性的对象）

   ```ts
   let person3: {
     name: string,
     age?: number,
     [key: string]: any
   }
   ```

##### 声明函数类型

```ts
let count: (a: number, b: number) => number
count = function (x, y) {
  return x + y
}
```

##### 声明数组类型

```ts
let arr1: number[]
let arr2: Array<number>  //泛型
```

#### tuple

元组是一种特殊的数组类型，可以储存固定数量的元素，并且每个元素的类型是已知的且可以不同。元组用于精确描述一组值的类型，?表示可选元素

```ts
let tuple1: [string, number]
//第二个元素可选
let tuple2: [string, number?]
//第一个元素必须是string类型，后面可有任意数量的number类型
let tuple3: [string, ...number[]]

tuple1 = ['hello', 10]
tuple2 = ['hello']
tuple3 = ['hello', 1, 2, 3, 4, 5]
```

#### enum

枚举可以定义一组命名常量，它能增强代码的可读性，也让代码更好维护

1. 数字枚举

   数字枚举是一种最常见的枚举类型，其成员的值会自动递增，且数字枚举还具有反向映射的特点

   ```ts
   enum Direction {
     Up,
     Down,
     Left,
     Right
   }
   
   console.log(Direction) //{0: 'Up', 1: 'Down', 2: 'Left', 3: 'Right', Up: 0, Down: 1, Left: 2, Right: 3}
   console.log(Direction.Up)  //0
   console.log(Direction[0])  //Up
   ```

   可以指定枚举成员的初始值，其后的成员值会自动递增

   ```ts
   enum Color {
     Red = 1,
     Green,
     Blue
   }
   console.log(Color.Green) //2
   ```

2. 字符串枚举

   枚举成员的值是字符串

   ```ts
   enum Direction2 {
     Up = 'UP',
     Down = 'DOWN',
     Left = 'LEFT',
     Right = 'RIGHT'
   }
   console.log(Direction2)     //{Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT'}
   console.log(Direction2.Up)  // 'UP'
   ```

3. 常量枚举

   官方描述：常量枚举是一种特殊的枚举类型，它使用const关键字定义，在编译时会被内联，避免生成一些额外的代码

   编译时内联：typescript在编译时会将枚举成员引用替换为它们的实际值，而不是生成额外的枚举对象。这可以减少生成的javascript代码量，并提高运行时的性能

   ```ts
   //使用常量枚举
   const enum Color {
     Red = 1,
     Green,
     Blue
   }
   console.log(Color.Green) //2
   ```

   ```js
   //正常生成的js代码
   var Color;
   (function (Color) {
       Color[Color["Red"] = 1] = "Red";
       Color[Color["Green"] = 2] = "Green";
       Color[Color["Blue"] = 3] = "Blue";
   })(Color || (Color = {}));
   console.log(Color.Green); //2
   
   //使用常量枚举生成的js代码
   console.log(2 /* Color.Green */);
   ```

#### type

type可以为任意类型创建别名，让代码更简洁、可读性更强，同时能更方便地进行类型复用和扩展

1. 基本用法

   类型别名使用type关键字定义，type后跟类型名称

   ```ts
   type num = number
   let num1: num = 123
   type strList = string[]
   let list1: strList = ['hello', 'world']
   ```

2. 联合类型

   联合类型是一种高级类型，它表示一个值可以是几种不同类型之一

   ```ts
   type status = number | string
   let code1:status = 200
   let code2:status = 'OK'
   
   type gender = 'Male' | 'Female'
   let g1:gender = 'Male'
   ```

3. 交叉类型

   交叉类型允许将多个类型合并为一个类型，合并后的类型将拥有所有被合并类型的成员。交叉类型通常用于对象类型

   ```ts
   type Rectangle = {
     length:number,
     width:number
   }
   type G3d = {
     height:number
   }
   type Rect3D = Rectangle & G3d
   let rect3d:Rect3D = {
     length:10,
     width:20,
     height:30
   }
   ```

#### 特殊情况

定义函数时，限制函数的返回值为void，那么返回值就必须为空

```ts
function demo():void{
  console.log('demo')
  return undefined

  return 123    //error
  return 'hello'    //error
}
```

使用类型声明限制函数返回值为void时，typescript并不会严格要求函数返回空

```ts
type LogFunc = () => void
let f1:LogFunc = function(){
  return 123    //并不会报错
}
```

原因：

为了确保类似如下代码的成立。push()函数会返回添加元素后的数组长度，而箭头函数的简写会将代码的运行结果作为返回值返回，但是forEach()函数的参数为一个期望返回值为void的回调函数

```ts
let src=[1,2,3]
let dst=[0]
src.forEach((item)=>dst.push(item))
```

####  abstract class

抽象类是一种无法被实例化的类，专门用来定义类的结构和行为，类中可以写抽象方法，也可以写具体实现。抽象类主要用来为其派生类提供一个基础结构，要求其派生类必须实现其中的抽象方法。

简记：抽象类不能实例化，其意义是可以被继承，抽象类里可以有普通方法、也可以有抽象方法

示例：

```ts
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
```

总结：何时使用抽象类？

1. 定义通用接口：为一组相关的类定义通用的属性或方法时
2. 提供基础实现：在抽象类中提供某些方法或为其提供基础实现，这样派生类就可以继承这些实现
3. 确保关键实现：强制派生类实现一些关键行为
4. 共享代码和逻辑：当多个类需要共享部分代码时，抽象类可以避免代码重复

#### interface

interface 是一种定义结构的方式，主要作用是为 类、对象、函数等规定一种契约，这样可以确保代码的一致性和类型安全，但要注意interface只能定义格式，不能包含任意实现！

1. 定义类结构

   ```ts
   //定义接口
   interface IPerson {
     name: string,
     age: number,
     speak(): void
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
   ```

2. 定义对象结构

   ```ts
   //约束对象结构
   let per1: IPerson = {
     name: 'John',
     age: 30,
     speak() {
       console.log(this.name + ',' + this.age)
     }
   }
   ```

3. 定义函数结构

   ```ts
   //定义接口
   interface IFunc{
     (a:number,b:number):number
   }
   //约束函数结构
   let fun:IFunc=(x,y)=>{
     return x+y
   }
   ```

4. 接口之间的继承

   ```ts
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
   ```

5. 接口自动合并

   ```ts
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
   ```

总结：何时使用接口？

1. 定义对象的格式：描述数据模型、API响应格式、配置对象等等，是开发中用的最多的场景
2. 类的契约：规定一个类需要实现哪些属性和方法
3. 自动合并：一般用于扩展第三方库的类型，这种特性在大型项目中可能会用到

#### 概念辨析

##### interface and type

相同点：interface和type 都可以用于定义对象结构，两者在许多场景中是可以互换的

不同点：

1. interface 更专注于定义对象和类的结构，支持继承、合并
2. type 可以定义类型别名、联合类型、交叉类型，但不支持继承和自动合并

##### interface and abstract class

相同点：都用于定义一个类的格式

不同点：

1. interface：只能描述结构，不能有任何实现代码，一个类可以实现多个接口
2. abstract class：既可以包含抽象方法，也可以包含具体方法，一个类只能继承一个抽象类

#### 泛型

### 类型声明文件

类型声明文件是typescript中的一种特殊文件，通常以 .d.ts 作为扩展名。它的主要作用是为现有的javascript代码提供类型信息，使得typescript能够在使用这些javascript库或模块时进行类型检查和提示。

demo.js

```js
function add(a, b) {
  return a + b
}
function mul(a, b) {
  return a * b
}

export { add, mul }
```

demo.d.ts

```ts
declare function add(a: number, b: number): number
declare function mul(a: number, b: number): number

export { add, mul }
```

index.ts

```ts
import { add,mul } from './demo.js'

console.log(add(1,2))
console.log(mul(2,3))
```

 
