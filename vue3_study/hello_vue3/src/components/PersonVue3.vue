<template>
  <div class="person">
    <h2>name:{{ name }}</h2>
    <h2>age:{{ age }}</h2>
    <button @click="changeName">changeName</button>
    <button @click="changeAge">changeName</button>
    <button @click="showTel">show Tel</button>
  </div>
</template>

<!-- 标准写法 -->
<!-- <script lang="ts">
export default{
  name: "PersonVue3",
  setup(){
    //data
    let name = 'zhangsan'
    let age = 30
    let tel = '123456'

    //methods
    function changeName(){
      name = 'lisi'
    }
    function changeAge(){
      age += 1
    }
    function showTel(){
      alert(tel)
    }

    return {name,age,changeName,changeAge,showTel}
  }
}

</script> -->

<!-- setup语法糖 -->
<script lang="ts" setup name="PersonVue3">
//data
let name = 'zhangsan'
let age = 30
let tel = '123456'

//methods
function changeName() {
  name = 'lisi'
}
function changeAge() {
  age += 1
}
function showTel() {
  alert(tel)
}

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