import { defineStore } from 'pinia'

export const useSumStore = defineStore('sum', {
  actions: {
    increment(value: number) {
      this.count += value
    }
  },
  state() {
    return {
      count: 6,
      a: 'hello'
    }
  },
  getters: {
    doubleCount(): number {
      return this.count * 2
    },
    upperA:state=>state.a.toUpperCase()
  }
})