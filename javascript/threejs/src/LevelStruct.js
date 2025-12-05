import { initScene } from "./common";
import * as THREE from "three";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);

//#region 组
// 通过THREE.Group类创建一个组对象group,构建层级结构
const lightGroup = new THREE.Group();
const objectGroup = new THREE.Group();
// 将组对象添加到场景中
scene.add(lightGroup, objectGroup);

// 场景对象Scene、组对象Group都有一个子对象属性
console.log(scene.children);
//#endregion

//#region 光源
const pointLight = new THREE.PointLight(0xffffff, 1, 1000, 0);
pointLight.position.set(0, 50, 100);
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
lightGroup.add(pointLight, ambientLight);
//#endregion

//#region 物体
const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
box.position.set(0, 5, 0);
const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({ color: 0xff00ff })
);
box2.position.set(0, 20, 0);

objectGroup.add(box, box2);

// 父对象旋转缩放平移变换，子对象跟着变化
objectGroup.rotation.y = Math.PI / 4;
//#endregion

//#region 遍历层级结构
// 在层级模型中可以给一些模型对象通过.name属性命名进行标记
const buildGroup = new THREE.Group();
buildGroup.name = "建筑物组";
scene.add(buildGroup);

// 批量创建多个长方体表示高层楼
const group1 = new THREE.Group(); //所有高层楼的父对象
group1.name = "高层";
for (let i = 0; i < 5; i++) {
  const geometry = new THREE.BoxGeometry(20, 60, 10);
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
  group1.add(mesh); //添加到组对象group1
  mesh.name = i + 1 + "号楼";
  // console.log('mesh.name',mesh.name);
}
group1.position.set(0, 30, -50);

const group2 = new THREE.Group();
group2.name = "洋房";
// 批量创建多个长方体表示洋房
for (let i = 0; i < 5; i++) {
  const geometry = new THREE.BoxGeometry(20, 30, 10);
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = i * 30;
  group2.add(mesh); //添加到组对象group2
  mesh.name = i + 6 + "号楼";
}
group2.position.set(0, 15, -25);
buildGroup.add(group1, group2); //添加到建筑物组buildGroup

// 递归遍历方法.traverse()，可以遍历Threejs一个模型对象包含的所有后代
buildGroup.traverse((obj) => {
  console.log("所有模型节点的名称", obj.name);
  // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
  if (obj.isMesh) {
    //判断条件也可以是obj.type === 'Mesh'
    obj.material.color.set(0xffff00);
  }
});

// 查找某个具体的模型.getObjectByName()
// Threejs和前端DOM一样，可以通过一个方法查找树结构父元素的某个后代对象
// Threejs同样可以通过一些方法查找一个模型树中的某个节点
const building2 = buildGroup.getObjectByName("2号楼");
building2.material.color.set(0x00ff00);
//#endregion

//#region 本地坐标与世界坐标
// 任何一个模型的本地坐标(局部坐标)就是模型的.position属性
// 一个模型的世界坐标，是模型自身.position和所有父对象.position累加的坐标
const testGroup = new THREE.Group();
testGroup.position.set(30, -5, 30);
const testBox = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
);
testBox.position.set(20, 5, 20);
testGroup.add(testBox);
scene.add(testGroup);

// .getWorldPosition(Vector3)读取一个模型的世界坐标，并把读取结果存储到参数Vector3中
const worldPosition = new THREE.Vector3();
testBox.getWorldPosition(worldPosition);
console.log("世界坐标", worldPosition);
console.log("本地坐标", testBox.position);

//可视化局部坐标系
const localAxesHelper = new THREE.AxesHelper(50);
testGroup.add(localAxesHelper);

const testBox2 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
testGroup.add(testBox2);
// 平移几何体的顶点坐标,改变几何体自身相对局部坐标原点的位置
testBox2.geometry.translate(10, 3, 0);
// .rotate()是绕局部坐标轴旋转的
function render() {
  testBox2.rotateY(0.01); //旋转动画
  requestAnimationFrame(render);
}
render();
//#endregion

//#region 移除/隐藏对象
// .remove()方法是把子对象从父对象的.children()属性中删除

const building9 = buildGroup.getObjectByName("9号楼");
console.log(building9);

building9.parent.remove(building9); //从父对象中移除

// Object3D封装了一个属性.visible，通过该属性可以隐藏或显示一个模型
const building5 = buildGroup.getObjectByName("5号楼");
building5.visible = false; //隐藏对象
//#endregion
