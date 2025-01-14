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

### 类型推断



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

















