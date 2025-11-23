<template>
  <Suspense>
    <template #default>
      <dv-border-box-7>
        <my-chart :method="method"></my-chart>
      </dv-border-box-7>
    </template>
    <template #fallback>
      <dv-border-box-7>
        <dv-loading class="loading">
          Loading...
        </dv-loading>
      </dv-border-box-7>
    </template>
  </Suspense>
</template>

<script setup>
import MyChart from './MyChart.vue';
defineProps(['method'])
</script>

<style scoped>
.loading {
  color: #ffffff;
}
</style>