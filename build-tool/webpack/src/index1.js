import a from './a.js';
import './css/index.css';

function component() {
  const element = document.createElement('div');

  element.innerHTML = a + 'Hello webpack' + '111';

  return element;
}

console.log('hello webpack');
document.body.appendChild(component());
