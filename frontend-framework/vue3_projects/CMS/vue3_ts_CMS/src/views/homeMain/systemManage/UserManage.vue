<template>
  <div class="usermanage">
    <div class="search">
      <UserSearch />
    </div>
    <div class="gap"></div>
    <div class="content">
      <UserTable />
    </div>
  </div>
</template>

<script lang="ts" setup>
import UserSearch from './components/UserSearch.vue'
import UserTable from './components/UserTable.vue'
</script>

<style scoped>
.search {
  padding: 20px 20px 0 20px;
}
.gap {
  height: 10px;
  background-color: #e6e6e6;
}
.content {
  /* height: 500px; */
  padding: 20px;
}
</style>
