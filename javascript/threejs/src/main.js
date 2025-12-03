import "./main.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "stats.js";
import { GUI } from "dat.gui";

//#region 创建场景
// 创建3D场景对象scene
const scene = new THREE.Scene();
// 创建辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);
//#endregion

//#region 加载模型
const loader = new GLTFLoader();
loader.load(
  "../data/3D卡通风格小智角色模型/80b8d5b144ca4e3fb3ff97a12e9b3454.glb",
  function (gltf) {
    gltf.scene.scale.set(10, 10, 10); // 将模型放大10倍
    gltf.scene.position.set(100, 100, -100); // 将模型移动到位置坐标(100,100,-100)
    scene.add(gltf.scene); //将模型添加到场景中
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
//#endregion

//#region 创建物体
// 创建一个长方体几何对象
const geometry = new THREE.BoxGeometry(60, 60, 60);
// 创建一个基础材质对象
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000, // 设置材质颜色为红色
  transparent: true, // 开启透明
  opacity: 0.5, //设置透明度
});
// 创建一个lambert材质对象, 对光线进行漫反射
const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
});
// 创建一个Phong材质对象, 可以进行镜面反射,产生一个高光效果
const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  transparent: true,
  opacity: 0.9,
  shininess: 40, //高光部分的亮度，默认30
  specular: 0x00ff00, //高光部分的颜色
});

// 创建一个物体
const mesh = new THREE.Mesh(geometry, phongMaterial); //网格模型对象Mesh
//设置位置坐标, 默认是坐标原点
mesh.position.set(30, 30, 30);
scene.add(mesh);
//#endregion

//#region 创建光源
// 点光源：两个参数分别表示光源颜色和光照强度
const pointLight = new THREE.PointLight(0xffffff, 2.0);
pointLight.decay = 0.0; //设置光源不随距离衰减
pointLight.position.set(100, 100, 70); //点光源放在x轴上
scene.add(pointLight); //点光源添加到场景中
// 点光源辅助观察
const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
scene.add(pointLightHelper);
//环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight); //环境光添加到场景中
// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(-80, 100, 50);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh;
scene.add(directionalLight);
// 平行光辅助观察
const dirLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5,
  0xff0000
);
scene.add(dirLightHelper);
//#endregion

//#region 创建相机
// width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
const width = window.innerWidth;
const height = window.innerHeight;
// 实例化一个透视投影相机对象
// 80:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(80, width / height, 1, 3000);
// 根据需要设置相机位置具体值
camera.position.set(100, 120, 100);
//相机观察目标指向Threejs 3D空间中某个位置
camera.lookAt(0, 0, 0);
//#endregion

//#region 创建渲染器
// 创建渲染器对象
const renderer = new THREE.WebGLRenderer({
  antialias: true, //开启抗锯齿, 用于减少图像边缘的锯齿状效果,使渲染出的图形更加平滑
});
renderer.setSize(width, height); //设置渲染区域的尺寸(像素px)
renderer.setPixelRatio(window.devicePixelRatio); //设置渲染器输出画布的设备像素比
renderer.setClearColor(0xaaaaaa, 1); //设置背景颜色
renderer.render(scene, camera); //执行渲染操作

document.getElementById("webgl").appendChild(renderer.domElement);
//#endregion

//#region 页面尺寸自适应
window.onresize = () => {
  // 重置渲染器输出画布canvas尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
};
//#endregion

//#region 其他控件
// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
// controls.addEventListener("change", function () {
//   renderer.render(scene, camera); //执行渲染操作
// });

// 性能监控
const stats = new Stats();
//stats.dom:web页面上输出计算结果,一个div元素，
document.body.appendChild(stats.dom);
stats.showPanel(0);

// 实例化一个gui对象
const gui = new GUI();
gui.domElement.style.width = "300px"; //设置GUI界面宽度

gui.add(mesh.position, "x", [-100, 0, 100]);
gui.add(mesh.position, "y", 0, 100);
gui.add(mesh.position, "z", {
  min: -80,
  max: 80,
});
// .addColor()生成颜色值改变的交互界面
gui.addColor(mesh.material, "color").onChange(function (value) {
  mesh.material.color.set(value);
});

const pointLightFolder = gui.addFolder("点光源");
const pointLightObj = {
  pointLight: true,
};
pointLightFolder
  .add(pointLightObj, "pointLight")
  .onChange((value) => {
    pointLight.visible = value;
  })
  .name("点光源显示");
pointLightFolder.add(pointLight, "intensity", 0, 100).name("点光源强度");
pointLightFolder.close();
//#endregion

//#region 渲染循环
//创建时钟对象
const clock = new THREE.Clock();
function render() {
  //计算两帧渲染时间间隔, 转为ms
  const spt = clock.getDelta() * 1000;
  stats.update(); //更新stats对象
  renderer.render(scene, camera); //执行渲染操作
  // mesh.rotateY(0.005); //物体每次绕y轴旋转0.005弧度
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();
//#endregion

//#region 其他测试代码
// 随机创建大量的模型,测试渲染性能
const num = 200; //控制长方体模型数量
for (let i = 0; i < num; i++) {
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.7,
  });
  const mesh = new THREE.Mesh(geometry, material);
  // 随机生成长方体xyz坐标
  const x = (Math.random() - 0.5) * 200 - 100;
  const y = (Math.random() - 0.5) * 200 + 100;
  const z = (Math.random() - 0.5) * 200 + 100;
  mesh.position.set(x, y, z);
  scene.add(mesh); // 模型对象插入场景中
}

// 创建方形阵列
const geometry2 = new THREE.BoxGeometry(100, 100, 100);
//材质对象Material
const material2 = new THREE.MeshLambertMaterial({
  color: 0x00ffff, //设置材质颜色
  transparent: true, //开启透明
  opacity: 0.5, //设置透明度
});
for (let i = 1; i < 10; i++) {
  for (let j = 1; j < 10; j++) {
    const mesh = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
    // 在XOZ平面上分布
    mesh.position.set(i * 200, 0, j * 200);
    scene.add(mesh); //网格模型添加到场景中
  }
}
//#endregion

//#region 创建其他几何体
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.8,
});
// SphereGeometry：球体
const sphereGeom = new THREE.SphereGeometry(50);
const sphere = new THREE.Mesh(sphereGeom, basicMaterial);
sphere.position.set(0, 50, -50);
// CylinderGeometry：圆柱
const cylinderGeom = new THREE.CylinderGeometry(30, 50, 100);
const cylinder = new THREE.Mesh(cylinderGeom, basicMaterial);
cylinder.position.set(0, 50, -150);

const basicPlaneMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
// PlaneGeometry：矩形平面
const planeGeom = new THREE.PlaneGeometry(100, 50);
const plane = new THREE.Mesh(planeGeom, basicPlaneMaterial);
plane.position.set(0, 25, -210);
// CircleGeometry：圆形平面
const circleGeom = new THREE.CircleGeometry(50);
const circle = new THREE.Mesh(circleGeom, basicPlaneMaterial);
circle.position.set(0, 25, -230);

scene.add(sphere).add(cylinder).add(plane).add(circle);
//#endregion

// 不同硬件设备的屏幕的设备像素比window.devicePixelRatio值可能不同
console.log("查看当前屏幕设备像素比", window.devicePixelRatio);

const geom = new THREE.BoxGeometry();
const mat = new THREE.MeshBasicMaterial();
console.log(geom, mat); //查看对象初始值
