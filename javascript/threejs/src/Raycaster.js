import { initScene } from "./common.js";
import * as THREE from "three";

const { renderer, camera, scene } = initScene();
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 1);

//#region 射线Ray
// 射线Ray和三维向量Vector3一样属于数学几何计算相关的API,可以进行射线交叉计算
// 创建射线对象Ray
const ray = new THREE.Ray();
// 起点.origin属性值是三维向量Vector3，也可以用.set()方法设置
ray.origin = new THREE.Vector3(1, 0, 3);
// 射线Ray的方向.direction通用用一个三维向量Vector3表示,向量长度保证为1，也就是单位向量
// 表示射线沿着x轴正方向
ray.direction = new THREE.Vector3(1, 0, 0);

//#endregion

//#region 射线与三角形相交检测
// 方法.intersectTriangle(), 计算一个射线和一个三角形在3D空间中是否交叉
// 执行.intersectTriangle()方法，如果相交返回交点坐标，不相交返回空值null
// 三角形三个点坐标
const p1 = new THREE.Vector3(100, 25, 0);
const p2 = new THREE.Vector3(100, -25, 25);
const p3 = new THREE.Vector3(100, -25, -25);
const point = new THREE.Vector3();
let result = ray.intersectTriangle(p1, p2, p3, false, point);
console.log("交叉点坐标", point);
console.log("查看是否相交", result);

// .intersectTriangle()参数4设为true，表示进行背面剔除
// 即三角形背面对着射线，视为交叉无效，进行背面剔除，返回值r是null
result = ray.intersectTriangle(p1, p2, p3, true, point);
console.log("查看是否相交", result);
//#endregion

//#region 射线拾取模型Raycaster
// 创建多个物体
const geometry = new THREE.SphereGeometry(25, 50, 50);
const material = new THREE.MeshBasicMaterial({
  color: 0x009999,
});
const selectedMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = mesh1.clone();
mesh2.position.y = 100;
const mesh3 = mesh1.clone();
mesh3.position.x = 100;
const model = new THREE.Group();
// 三个网格模型mesh1,mesh2,mesh3用于射线拾取测试
model.add(mesh1, mesh2, mesh3);
// 注意更新下模型的世界矩阵，你设置的mesh.position生效，再进行射线拾取计算
model.updateMatrixWorld(true);
scene.add(model);
// scene.updateMatrixWorld(true);

// 射线投射器Raycaster具有一个射线属性.ray，该属性的值就是上节课讲解的射线对象Ray
const raycaster = new THREE.Raycaster();
console.log("射线属性", raycaster.ray);
raycaster.ray.origin = new THREE.Vector3(180, -80, 0);
raycaster.ray.direction = new THREE.Vector3(-1, 1, 0).normalize();

// 射线发射箭头辅助器ArrowHelper
let arrowHelper = new THREE.ArrowHelper(
  raycaster.ray.direction,
  raycaster.ray.origin,
  400
);
scene.add(arrowHelper);
// 射线发射拾取模型对象
const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);
console.log("射线器返回的对象", intersects);
// 改变选中模型的材质
intersects.forEach((intersect) => {
  intersect.object.material = selectedMaterial;
});

//#endregion

//#region 屏幕坐标转标准设备坐标
document.addEventListener("click", function (event) {
  // event对象有很多鼠标事件相关信息
  // .offsetX、.offsetY表示鼠标单击位置的坐标，单位是像素px，以点击的HTML元素左上角为坐标原点，水平向右方向为x轴，竖直向下方向为y轴
  // .clientX、.clientY表示鼠标单击位置的坐标，区别在于该值以浏览器左上角为坐标原点
  console.log(
    "event",
    event.clientX,
    event.clientY,
    event.offsetX,
    event.offsetY
  );
  console.log(
    "屏幕坐标转标准设备坐标",
    screenToDevice(
      event.offsetX,
      event.offsetY,
      renderer.domElement.clientWidth,
      renderer.domElement.clientHeight
    )
  );
});
// Three.js Canvas画布具有一个标准设备坐标系，该坐标系原点在画布的中间位置，x轴水平向右，y轴竖直向上
// 标准设备坐标系的坐标值不是绝对值，是相对值，范围是[-1,1]区间

// 屏幕坐标转标准设备坐标
function screenToDevice(x, y, width, height) {
  const deviceX = (x / width) * 2 - 1;
  const deviceY = (-y / height) * 2 + 1;
  return { x: deviceX, y: deviceY };
}
//#endregion

//#region 鼠标点击选中物体
const screenToDevice2 = (x, y) =>
  screenToDevice(
    x,
    y,
    renderer.domElement.clientWidth,
    renderer.domElement.clientHeight
  );

// 创建一个射线投射器`Raycaster`
const raycaster2 = new THREE.Raycaster();
// 点击后物体材质
const clickMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//点击事件
renderer.domElement.onclick = (event) => {
  const { x, y } = screenToDevice2(event.offsetX, event.offsetY);

  //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
  // 形象点说就是在点击位置创建一条射线，用来选中拾取模型对象
  raycaster2.setFromCamera(new THREE.Vector2(x, y), camera);

  //可视化射线
  arrowHelper.position.copy(raycaster2.ray.origin);
  arrowHelper.setDirection(raycaster2.ray.direction);

  const clickedObjs = raycaster2.intersectObjects([mesh1, mesh2, mesh3]);
  if (clickedObjs.length > 0) {
    // 选中模型的第一个模型，设置为红色
    clickedObjs[0].object.material = clickMaterial;
  }
};
//#endregion
