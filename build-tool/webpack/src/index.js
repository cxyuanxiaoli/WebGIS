import a from '@/a';
import './css/index.css';
import img from '@/asset/pic.jpg';
import _ from 'lodash';

setTimeout(() => {
  import(/* webpackChunkName: "b" */ './b.js').then((b) => {
    console.log('b.js loaded:', b.default);
  });
}, 3000);

console.log(_.VERSION);

function component() {
  const element = document.createElement('div');

  element.innerHTML = 'Hello webpack' + a;
  element.className = 'title';
  return element;
}

console.log('hello webpack');
document.body.appendChild(component());
const imgElem = new Image();
imgElem.src = img;
document.body.appendChild(imgElem);

fetch('/test')
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
