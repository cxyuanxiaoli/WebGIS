import * as THREE from "three";
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 创建3D场景对象Scene
const scene = new THREE.Scene();
//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(60, 60, 60);
//创建一个材质对象Material
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
  transparent: true, //开启透明
  opacity: 0.5, //设置透明度
});
//MeshLambertMaterial受光照影响
const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
});

// 两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, lambertMaterial); //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0, 0, 0);
scene.add(mesh);

//点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.decay = 0.0; //设置光源不随距离衰减
//点光源位置
pointLight.position.set(100, 300, 200); //点光源放在x轴上
scene.add(pointLight); //点光源添加到场景中

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //环境光
scene.add(ambientLight); //环境光添加到场景中

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

// width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
const width = 900; //宽度
const height = 600; //高度
// 实例化一个透视投影相机对象
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
// 根据需要设置相机位置具体值
camera.position.set(100, 120, 100);
//相机观察目标指向Threejs 3D空间中某个位置
camera.lookAt(0, 0, 0); //坐标原点

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
renderer.render(scene, camera); //执行渲染操作

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener("change", function () {
  renderer.render(scene, camera); //执行渲染操作
}); //监听鼠标、键盘事件
document.getElementById("webgl").appendChild(renderer.domElement);
