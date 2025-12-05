import { initScene } from "./common";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { scene, camera, renderer } = initScene();
// 改变背景透明度值
renderer.setClearAlpha(0); //完全透明

//#region 光源设置
const poinLight = new THREE.PointLight(0xffffff, 1, 1000, 0);
poinLight.position.set(0, 60, 100);
scene.add(poinLight);
//#endregion

//#region Dom交互
document.querySelector(".webgl").appendChild(renderer.domElement);

document.querySelector("#save").onclick = () => {
  const imgData = renderer.domElement.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = imgData;
  a.download = "image.png";
  a.click();
};
document.querySelector("#load").onclick = () => {
  document.querySelector("#loadInput").click();
};
document.querySelector("#loadInput").onchange = (e) => {
  const file = e.target.files[0];

  const url = URL.createObjectURL(file);
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      gltf.scene.scale.set(10, 10, 10);
      scene.add(gltf.scene);
    },
    (xhr) => {
      const progress = (xhr.loaded / xhr.total) * 100;
      document.querySelector(
        "#progress"
      ).textContent = `进度: ${progress.toFixed(2)}%`;
    },
    (error) => {
      console.error(error);
    }
  );
};
//#endregion

//#region 添加物体
const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
box.position.set(0, 0, 40);
scene.add(box);
//#endregion
