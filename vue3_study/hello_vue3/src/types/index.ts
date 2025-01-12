//定义一个接口
export interface Person{
  id:string
  name:string
  age:number
}
//定义一个自定义类型
export type PersonList = Array<Person>

