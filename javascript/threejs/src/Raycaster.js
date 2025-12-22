import { initScene } from "./common.js";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";

const { renderer, camera, scene } = initScene();
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xaaaaaa, 1);

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
    event.offsetY,
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

//#region 射线拾取层级模型
const pointLight = new THREE.PointLight(0xffffff, 3, 1000, 0);
pointLight.position.set(40, 50, 100);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 构建层级模型
const group = new THREE.Group();
group.position.set(0, 10, 200);
group.name = "组对象";
const group2 = new THREE.Group();
group2.position.set(200, 10, 200);
group2.name = "组对象2";

const box = new THREE.Mesh(
  new THREE.BoxGeometry(150, 20, 150),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
box.name = "底座";
group.add(box);

group2.add(box.clone());

for (let i = 0; i < 5; i++) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(20, 20, 20),
    new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
  );
  box.position.set(Math.random() * 130 - 65, 20, Math.random() * 130 - 65);
  box.name = "子物体" + i;
  group.add(box);
  group2.add(box.clone());
}
group.updateMatrixWorld(true);
scene.add(group);
scene.add(group2);

// 如果需要实现点击任一子物体均能选中整个组对象，则需要给每个子物体添加一个属性，指向其父对象
// 在点击事件中，通过该属性获取到组对象，为整个组对象添加描边效果
group.traverse((child) => {
  if (child.isMesh) {
    child.ancestor = group;
  }
});

// 后处理
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const v2 = new THREE.Vector2(
  renderer.domElement.clientWidth,
  renderer.domElement.clientHeight
);
// 添加描边效果
const outlinePass = new OutlinePass(v2, scene, camera);
outlinePass.selectedObjects = [group];
composer.addPass(outlinePass);

// 点击事件
const raycaster3 = new THREE.Raycaster();
renderer.domElement.addEventListener("click", (event) => {
  const { x, y } = screenToDevice2(event.offsetX, event.offsetY);
  raycaster3.setFromCamera(new THREE.Vector2(x, y), camera);
  const intersects = raycaster3.intersectObjects([group, group2]);
  if (intersects.length > 0) {
    console.log("点击物体名称：" + intersects[0].object.name);
    if (intersects[0].object.ancestor) {
      // 给整个组对象添加描边效果
      outlinePass.selectedObjects = [intersects[0].object.ancestor];
    } else {
      // 给单个物体添加描边效果
      outlinePass.selectedObjects = [intersects[0].object];
    }
  } else {
    outlinePass.selectedObjects = [];
  }
});

// 渲染循环
function render() {
  composer.render();
  requestAnimationFrame(render);
}
render();
//#endregion

//#region 射线拾取Sprite
const cylinder1 = new THREE.Mesh(
  new THREE.CylinderGeometry(25, 25, 50),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
cylinder1.position.set(100, 25, -100);
scene.add(cylinder1);

const cylinder2 = cylinder1.clone();
cylinder2.material = cylinder1.material.clone();
cylinder2.position.set(180, 25, -100);
scene.add(cylinder2);

//添加精灵模型
const spriteMaterial = new THREE.SpriteMaterial({
  map: new THREE.TextureLoader().load("../data/sprite.png"),
});

const sprite1 = new THREE.Sprite(spriteMaterial);
sprite1.scale.set(20, 20, 1);
sprite1.position.set(100, 60, -100);
scene.add(sprite1);

const sprite2 = sprite1.clone();
sprite2.position.set(180, 60, -100);
scene.add(sprite2);

// 三维场景中提供了两个精灵模型对象，可以分别自定义一个方法.change()
sprite1.change = () => {
  cylinder1.material.color.setHex(Math.random() * 0xffffff);
};

sprite2.change = () => {
  cylinder2.material.color.setHex(Math.random() * 0xffffff);
};

// 精灵模型点击事件
renderer.domElement.addEventListener("click", (event) => {
  const { x, y } = screenToDevice2(event.offsetX, event.offsetY);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  // 射线交叉计算拾取精灵模型
  const intersects = raycaster.intersectObjects([sprite1, sprite2]);
  if (intersects.length > 0) {
    intersects[0].object.change(); //执行选中sprite绑定的change函数
  }
});
//#endregion
