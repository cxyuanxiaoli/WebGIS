<template>
  <div class='modal'>
    <h3>Teleport</h3>
    <button @click="visible = !visible">modal</button>
    <Teleport to="body">
      <div class="content" v-if="visible">
        弹窗
      </div>
    </Teleport>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

let visible = ref(false)
</script>

<style scoped>
.modal {
  background-color: grey;
  border-radius: 10px;
  box-shadow: 0 0 5px;

  filter: saturate(50%);
}

.content {
  width: 200px;
  height: 200px;
  background-color: skyblue;
  border-radius: 10px;
  box-shadow: 0 0 5px;
  padding: 10px;
  box-sizing: border-box;

  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

button {
  margin: 10px;
}
</style>