<template>
  <div class="person">
    computed:
    <div>
      first name:
      <input type="text" v-model="firstName">
    </div>
    <div>
      last name:
      <input type="text" v-model="lastName">
    </div>
    fullname:
    <input type="text" v-model="fullName">
  </div>
</template>

<script lang="ts" setup name="PersonComputed">
import { ref,computed } from 'vue'

let firstName = ref('zhang')
let lastName = ref('san')
// computed
// let fullName =computed(()=>{
//   return firstName.value+' '+lastName.value
// })
let fullName =computed({
  get(){
    return firstName.value+' '+lastName.value
  },
  set(value){
    firstName.value = value.split(' ')[0]
    lastName.value = value.split(' ')[1]
  }
})

</script>

<style scoped>
.person {
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}

button {
  margin: 0 5px;
}
</style>