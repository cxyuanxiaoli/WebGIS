import { reactive, onMounted } from 'vue'
import axios from 'axios'

export default function () {
  let dogList = reactive([''])

  async function addDog() {
    try {
      let dog = await axios.get('https://dog.ceo/api/breeds/image/random')
      dogList.push(dog.data.message)
    } catch (error) {
      alert(error)
    }
  }
  onMounted(() => {
    console.log('hooks mounted')
  })
  return { dogList, addDog }
}