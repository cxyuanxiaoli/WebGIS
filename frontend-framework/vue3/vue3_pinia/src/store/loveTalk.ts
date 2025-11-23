import { defineStore } from 'pinia'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { reactive } from 'vue'

// export const useLoveTalkStore = defineStore('loveTalk', {
//   actions: {
//     async getTalk() {
//       let res = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
//       this.talks.unshift({ id: nanoid(), content: res.data.content })
//     }
//   },
//   state() {
//     return {
//       talks: JSON.parse(localStorage.getItem('loveTalk') as string) || []
//     }
//   }
// })

//组合式写法
export const useLoveTalkStore = defineStore('loveTalk', () => {
  const talks = reactive(JSON.parse(localStorage.getItem('loveTalk') as string) || [])

  async function getTalk() {
    let res = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
    talks.unshift({ id: nanoid(), content: res.data.content })
  }
  return{talks, getTalk}
})