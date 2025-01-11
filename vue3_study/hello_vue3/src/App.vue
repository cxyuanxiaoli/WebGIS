<template>
<!-- html -->
 <div class="app">
  <h1>Hello</h1>
  <Person></Person>
  <PersonVue3></PersonVue3>
  <PersonRef></PersonRef>
  <PersonComputed></PersonComputed>
  <PersonWatch></PersonWatch>
 </div>

</template>

<script lang="ts">
//js ts
import Person from './components/Person.vue'
import PersonVue3 from './components/PersonVue3.vue'
import PersonRef from './components/PersonRef.vue'
import PersonComputed from './components/PersonComputed.vue'
import PersonWatch from './components/PersonWatch.vue'
export default {
  name : 'App',
  components:{   //register components
    Person,
    PersonVue3,
    PersonRef,
    PersonComputed,
    PersonWatch,
  }

}
</script>

<style>
/* css */
.app{

  background-color: #ddd;
  box-shadow: 5px 5px 10px #000;
  padding: 20px;
  border-radius: 10px;
}

</style>