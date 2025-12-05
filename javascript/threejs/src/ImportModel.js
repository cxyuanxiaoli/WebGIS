import { initScene } from "./common";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);

console.log(renderer.outputColorSpace);

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("../data/testTexture.jpg");
texture.colorSpace = THREE.SRGBColorSpace;
texture.flipY = false;
console.log(texture.colorSpace);

const pointLight = new THREE.PointLight(0xffffff, 1, 1000, 0);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// .gltf格式模型文件，有不同的组织形式。
// 单独.gltf文件   单独.glb文件   .gltf + .bin + 贴图文件
// 这些不同形式的gltf模型，加载代码没什么区别
const loader = new GLTFLoader();
loader.load(
  "../data/地形.glb",
  (gltf) => {
    console.log(gltf);
    console.log(gltf.scene.children[1]);
    gltf.scene.children[1].material.map = texture;

    scene.add(gltf.scene);
  },
  undefined,
  () => {
    console.log("Loading error");
  }
);

function render() {
  // console.log(camera.position);

  requestAnimationFrame(render);
}
render();
