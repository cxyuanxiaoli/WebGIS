import { initScene } from "./common";
import * as THREE from "three";

const { scene, camera, renderer } = initScene("orthographic");
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 1, 1000, 0);
pointLight.position.set(0, 80, 100);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

//#region 正投影相机
// 正投影相机OrthographicCamera和透视投影相机PerspectiveCamera的区别
// 透视投影可以模拟人眼观察世界的视觉效果，正投影相机不会
const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
box.position.set(0, 0, 70);
scene.add(box);
scene.add(box.clone().translateZ(200));
//#endregion

//#region 包装盒Box3
// 包围盒Box3，就是一个长方体空间，把模型的所有顶点数据包围在一个最小的长方体空间中
const box3 = new THREE.Box3();
console.log("init", box3.min, box3.max);

box3.min = new THREE.Vector3(-1, -1, 0);
box3.max = new THREE.Vector3(1, 2, 5);
console.log("box3", box3.min, box3.max);

// 计算物体的包装盒
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(10),
  new THREE.MeshLambertMaterial({ color: 0x00ff00 })
);
scene.add(sphere);

// 扩展此包围盒的边界，使得对象及其子对象在包围盒内，包括对象和子对象的世界坐标的变换
// 该方法可能会导致一个比严格需要的更大的框
box3.expandByObject(sphere);
console.log("box3 after expand", box3);

const vector = new THREE.Vector3();
// getSize()计算包围盒尺寸
box3.getSize(vector);
console.log("size", vector);
// 计算包围盒中心坐标
box3.getCenter(vector);
console.log("center", vector);

// 计算当前几何体的的边界矩形，该操作会更新已有 [param:.boundingBox]
box.geometry.computeBoundingBox();
let { min, max } = box.geometry.boundingBox;
console.log("box before scale", min, max);
box.geometry.scale(2, 2, 2);
box.geometry.computeBoundingBox();
({ min, max } = box.geometry.boundingBox);
console.log("box after scale", min, max);
//#endregion
