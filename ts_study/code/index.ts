const person = {
  name: "John",
  age: 30
}

// let a: string
// a = 'Hello'
console.log(`Hello, my name is ${person.name} and I am ${person.age} years old.`)

let a: any
a = 'Hello'
a = 10
a = false

let b

let c: any
c = 1

let x: string
x = c

let m: unknown
m = 'Hello'

let n: string
if (typeof m === 'string') {
  n = m
}
n = m as string
n = <string>m

let y: any
console.log(y.a)

let z: unknown = 'Hello'
// console.log(z.length)
console.log((z as string).length)

let p: string = 'Hello'
if (typeof p === 'string') {
  console.log(p.length)
} else {
  console.log(p)  //
}

function throwError(): never {
  throw new Error('Error occurred')
}

