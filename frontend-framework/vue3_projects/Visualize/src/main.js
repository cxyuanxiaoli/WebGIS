import 'normalize.css';
import './assets/css/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import DataV from '@kjgl77/datav-vue3';
import('./hooks/chartInit').then((module) => {
  module.default();
});
const app = createApp(App);
app.use(DataV);
app.mount('#app');
