import * as THREE from 'three';

const width=window.innerWidth;
const height=window.innerHeight;
const aspect=width/height;

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,aspect,0.1,3000);
camera.position.set(100,100,100)
camera.lookAt(0,0,0);

const renderer=new THREE.WebGLRenderer({
  antialias:true,
  alpha:true,
});
renderer.setSize(width,height);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);


const box=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({color:0x00ff00}))
scene.add(box);

renderer.render(scene,camera);

console.log('123');


function render(){
  requestAnimationFrame(render);
  renderer.render(scene,camera);
}
render();

window.addEventListener('resize',()=>{
  const width=window.innerWidth;
  const height=window.innerHeight;
  const aspect=width/height;
  camera.aspect=aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(width,height);
})

