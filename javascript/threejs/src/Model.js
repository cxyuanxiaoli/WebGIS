import { initScene } from "./common";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);
console.log(scene);

//#region 光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.decay = 0;
pointLight.position.set(0, 100, 50);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 10, 0xff0000);
scene.add(pointLightHelper);
//#endregion

//#region 控件
const orbitControls = new OrbitControls(camera, renderer.domElement);

const gridHelper = new THREE.GridHelper(100, 20);
scene.add(gridHelper);
//#endregion

//#region 模型加载
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  "../data/mytest.glb",
  (data) => {
    const model = data.scene;
    // console.log(model);

    model.scale.set(10, 10, 10);
    // model.position.set(0,0,0);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.log("error loading model", error);
  }
);
//#endregion

//#region 三维向量Vector3
const v = new THREE.Vector3(1, 1, 1);
console.log(v);
v.set(2, 2, 2);
v.x = 3;
console.log(v);

// 三维向量Vector3有xyz三个分量，threejs中会用三维向量Vector3表示很多种数据
// 如mesh.position、mesh.scale等属性值都是三维向量
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({
    color: 0xff0000,
  })
);
scene.add(mesh);
// 使用set方法设置位置
mesh.position.set(0, 5, 20);

// 执行.translateX()、.translateY()等方法本质上改变的都是模型的位置属性.position
mesh.translateX(10);
mesh.translateZ(-5);

// 沿着自定义的方向移动，向量Vector3对象表示方向
const axis = new THREE.Vector3(1, 0, 1);
axis.normalize(); //向量归一化
//沿着axis轴表示方向平移100
mesh.translateOnAxis(axis, 10);

// 使用set方法设置缩放
mesh.scale.set(1.5, 1.5, 1.5);
mesh.scale.y = 1;
//#endregion

//#region 欧拉对象Euler
// mesh.rotation 是物体的角度属性，对应属性值是欧拉对象Euler
const mesh2 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({
    color: 0x00ff00,
  })
);
scene.add(mesh2);
// 使用set方法设置位置
mesh2.position.set(-20, 5, 20);
mesh2.rotateY(Math.PI / 2);
console.log(mesh2.rotation);

// 创建一个Euler对象
const euler = new THREE.Euler(Math.PI / 6, Math.PI / 4, Math.PI / 3);
console.log(euler);

mesh2.rotation.x += Math.PI / 2;
// 模型执行.rotateX()、.rotateY()等旋转方法，实质上改变了模型的角度属性
mesh2.rotateZ(Math.PI / 2);

const axis2 = new THREE.Vector3(0, 1, 0); //向量axis
mesh2.rotateOnAxis(axis2, Math.PI / 8); //绕axis轴旋转π/8
//#endregion

//#region 颜色对象Color
// threejs材质对象颜色属性.color是颜色对象Color
const material = new THREE.MeshLambertMaterial(); //默认是纯白色0xffffff
console.log(material.color);

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 16),
  material
);
sphereMesh.position.set(40, 8, 20);
scene.add(sphereMesh);

material.color = new THREE.Color("red");
material.color.set(0x00ffff);
material.color.setRGB(0.5, 0.5, 1);
console.log(material);
//#endregion

//#region 模型的材质和几何体对象
const mesh3 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial()
);
console.log("geometry", mesh3.geometry, "material", mesh3.material);
console.log(
  "position",
  mesh3.position,
  "scale",
  mesh3.scale,
  "rotation",
  mesh3.rotation
);
mesh3.position.set(20, 5, 40);
scene.add(mesh3);

const mesh4 = new THREE.Mesh(mesh3.geometry, mesh3.material);
mesh4.position.set(40, 5, 40);
scene.add(mesh4);
mesh4.translateZ(5);

// 两个mesh共享一个材质，改变一个mesh的颜色，另一个mesh2的颜色也会跟着改变
mesh4.material.color.set(0xffff00);
// 两个mesh共享一个几何体
mesh4.geometry.translate(0, 0, 5);
//#endregion

//#region 克隆和复制
// 克隆.clone()、复制.copy()是threejs很多对象都具有的方法
// 比如三维向量对象Vector3、网格模型Mesh、几何体、材质
const v1 = new THREE.Vector3(1, 2, 3);
console.log("v1", v1);
//v2是一个新的Vector3对象，和v1的.x、.y、.z属性值一样
const v2 = v1.clone();
console.log("v2", v2);
console.log(v1 === v2);

const v3 = new THREE.Vector3(1, 2, 3);
const v4 = new THREE.Vector3(4, 5, 6);
//读取v1.x、v1.y、v1.z的赋值给v3.x、v3.y、v3.z
v4.copy(v3);
console.log(v4);
console.log(v3 === v4);

const mesh5 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial()
);
mesh5.position.set(-20, 5, 40);
scene.add(mesh5);

// 通过克隆.clone获得的新模型和原来的模型共享材质和几何体
const mesh6 = mesh5.clone();
console.log("mesh5", mesh5, "mesh6", mesh6);
console.log(mesh5.position === mesh6.position);
console.log(mesh5.material === mesh6.material);

mesh6.position.set(-40, 5, 40);
mesh6.material.color.set(0x0000ff);
scene.add(mesh6);

// 克隆几何体和材质，重新设置mesh的材质和几何体属性
const mesh7 = mesh5.clone();
mesh7.geometry = mesh5.geometry.clone();
mesh7.material = mesh5.material.clone();
mesh7.material.color.set(0xaa0000);
mesh7.position.copy(mesh5.position);
mesh7.position.y += 20;
scene.add(mesh7);

// 同步mesh5和mesh7的姿态角度
function render() {
  mesh5.rotation.x += 0.01;
  mesh7.rotation.copy(mesh5.rotation);
  requestAnimationFrame(render);
}
render();
//#endregion
