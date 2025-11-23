<template>
  <div class='my-input'>
    <input type="text" :value="name" @input="$emit('update:name', (<HTMLInputElement>$event.target).value)">
    <br>
    <input type="text" :value="password" @input="$emit('update:password', (<HTMLInputElement>$event.target).value)">
  </div>
</template>

<script lang='ts' setup>
defineProps(['name', 'password'])
const emit = defineEmits(['update:name', 'update:password'])
</script>

<style scoped>
.my-input {
  input {
    margin: 5px 0;
    border-radius: 5px;
    background-color: #d8d8d8;
    font-size: 20px;
    color: white;
    border: none;

    &:focus {
      background-color: #ffabab;
    }
  }
}
</style>