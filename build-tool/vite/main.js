import a from "./tsmode.ts"
import img from './123.jpg'
import "./index.css"
import './test.less' 
import { createApp } from "vue"
import App from "./App.vue"

console.log(a); // output: 1
import('./mode1').then(module => {
  console.log(module.default()); // output: 1
})
const image=new Image();
image.src=img;
document.body.appendChild(image);




createApp(App).mount('#app')
