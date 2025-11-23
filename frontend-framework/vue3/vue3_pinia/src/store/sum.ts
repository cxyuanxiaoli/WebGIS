import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// export const useSumStore = defineStore('sum', {
//   actions: {
//     increment(value: number) {
//       this.count += value
//     }
//   },
//   state() {
//     return {
//       count: 6,
//       a: 'hello'
//     }
//   },
//   getters: {
//     doubleCount(): number {
//       return this.count * 2
//     },
//     upperA:state=>state.a.toUpperCase()
//   }
// })

export const useSumStore = defineStore('sum',()=>{
  const count = ref(6)
  const a = ref('hello')

  const doubleCount = computed(()=>count.value*2)
  const upperA = computed(()=>a.value.toUpperCase())

  function increment(value: number) {
    count.value += value
  }
  
  return {count,a,doubleCount,upperA,increment}
})

