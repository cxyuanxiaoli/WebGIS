import { initScene } from "./common.js";
import * as THREE from "three";
import { GUI } from "dat.gui";
import * as Suncalc from "suncalc";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0x666666);
const gui = new GUI();
const helperFolder = gui.addFolder("光源辅助");
const boxFolder = gui.addFolder("阴影盒子");

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);
gui.add(ambientLight, "intensity", 0, 0.2).name("环境光强度");

//#region 聚光灯
// 聚光源
const spotLight = new THREE.SpotLight(0xffffff, 1.0, 230);
scene.add(spotLight); //光源添加到场景中

spotLight.angle = Math.PI / 4; //聚光灯角度
spotLight.decay = 0.1; // 光源衰减
spotLight.position.set(0, 200, 0); //聚光灯位置
// spotLight.target是一个模型对象Object3D，默认在坐标原点
console.log(spotLight.target);
spotLight.target.position.set(30, 0, 30);
//spotLight.target添加到场景中.target.position才会起作用
scene.add(spotLight.target);
gui.add(spotLight, "intensity", 0, 5).name("聚光灯强度");

// 聚光源辅助对象，可视化聚光源
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xffffff);
scene.add(spotLightHelper);
helperFolder.add(spotLightHelper, "visible").name("聚光灯辅助");

const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(50, 50, 50),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
boxMesh.position.set(60, 25, 50);
scene.add(boxMesh);
//#endregion

//#region 平行光阴影
// 平行光DirectionalLight阴影步骤
// 1..castShadow设置产生阴影的光源对象
// 2..castShadow设置产生阴影的模型对象
// 3..receiveShadow设置接收阴影效果的模型
// 4..shadowMap.enabledWebGl渲染器允许阴影渲染
// 5..shadow.camera设置光源阴影渲染范围

const directLight = new THREE.DirectionalLight(0xffffff, 1.0);
scene.add(directLight);
directLight.target.position.x = 300;
directLight.target.position.y = 0;
directLight.target.position.z = 130;
scene.add(directLight.target);

directLight.position.set(0, 260, 0);
// 1.光源对象开启光源阴影计算
directLight.castShadow = true;
gui.add(directLight, "intensity", 0, 5).name("平行光强度");

const directLightHelper = new THREE.DirectionalLightHelper(directLight, 10);
scene.add(directLightHelper);
helperFolder.add(directLightHelper, "visible").name("平行光辅助");

const boxMesh2 = boxMesh.clone();
boxMesh2.position.set(280, 25, 140);
scene.add(boxMesh2);
boxFolder.add(boxMesh2.position, "x", 100, 320);
boxFolder.add(boxMesh2.position, "y", -20, 70);
boxFolder.add(boxMesh2.position, "z", 40, 200);

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 300),
  new THREE.MeshLambertMaterial({ color: 0x888888, side: THREE.DoubleSide })
);
planeMesh.position.set(300, 0, 130);
planeMesh.rotation.x = -Math.PI / 2;
scene.add(planeMesh);

const boxMesh3 = boxMesh.clone();
boxMesh3.position.set(350, 30, 110);
scene.add(boxMesh3);
boxMesh3.receiveShadow = true;
boxMesh3.castShadow = true;

// 2.产生阴影的模型对象开启阴影
boxMesh2.castShadow = true;
// 3.设置阴影的承载模型对象接收阴影
planeMesh.receiveShadow = true;
// 4.设置渲染器，允许光源阴影渲染
renderer.shadowMap.enabled = true;
//#endregion

//#region 阴影范围.shadow.camera
// 平行光DirectionalLight的.shadow属性是平行光阴影对象DirectionalLightShadow
// 平行光阴影对象DirectionalLightShadow有一个相机属性.camera
// .shadow.camera属性值(正投影相机OrthographicCamera)

// 查看平行光阴影相机属性
console.log("阴影相机属性", directLight.shadow.camera);
// 5.设置三维场景计算阴影的范围
directLight.shadow.camera.left = -100;
directLight.shadow.camera.right = 100;
directLight.shadow.camera.top = 120;
directLight.shadow.camera.bottom = -120;
directLight.shadow.camera.near = 0.5;
directLight.shadow.camera.far = 1200;

// 可视化平行光阴影对应的正投影相机对象
const cameraHelper = new THREE.CameraHelper(directLight.shadow.camera);
scene.add(cameraHelper);
helperFolder.add(cameraHelper, "visible").name("平行光阴影相机辅助");

//#endregion

//#region 阴影贴图尺寸.mapSize和阴影半径.radius
// mapSize属性默认512x512
// 在能覆盖包含阴影渲染范围的情况下，.shadow.camera的尺寸尽量小
// 增加.shadow.camera长方体尺寸范围，阴影模糊锯齿感，可以提升.shadow.mapSize的大小
console.log("阴影默认像素", directLight.shadow.mapSize);
directLight.shadow.mapSize.set(1024, 1024);

// 模糊弱化阴影边缘
console.log(".shadow.radius", directLight.shadow.radius);
directLight.shadow.radius = 2;
//#endregion

//#region 环境贴图
// 不设置任何光源和环境贴图，gltf模型默认PBR材质不会正常显示，一片漆黑。
// 只设置环境贴图，物体表面也能看到。虽然环境贴图不是光源，但是会模拟物体周围环境的反射光
const cubeTexture = new THREE.CubeTextureLoader().load([
  "../data/env1.jpg",
  "../data/env1.jpg",
  "../data/env1.jpg",
  "../data/env1.jpg",
  "../data/env1.jpg",
  "../data/env1.jpg",
]);
const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(30, 30, 30),
  new THREE.MeshStandardMaterial({
    // color: 0xff0000,
    roughness: 0,
    metalness: 1,
    envMap: cubeTexture,
  })
);
box1.position.set(20, 15, 350);
scene.add(box1);

gui
  .addFolder("盒子1的环境贴图强度")
  .add(box1.material, "envMapIntensity", 0, 5)
  .name("强度");
//#endregion

//#region 平行光模拟太阳光
const obj = {
  // 太阳方位角
  azimuth: 203.4,
  // 太阳高度角
  elevation: 38.5,
};

// 太阳高度角变化函数
const elevFunc = (value) => {
  obj.elevation = value;
  // 围绕点位置
  const target = new THREE.Vector3(300, 0, 130);
  // 根据高度角变化计算光源位置
  directLight.position.copy(
    calculatePosition(directLight.position, target, obj.elevation)
  );
  // 更新辅助对象
  directLightHelper.update();
};

// 太阳方位角变化函数
const aziFunc = (value) => {
  obj.azimuth = value;
  const rad = (value / 180) * Math.PI;
  const target = new THREE.Vector3(300, 0, 130);
  const horizonDistance = 326.95; // 水平距离
  // 根据方位角变化计算光源位置
  directLight.position.x = target.x + horizonDistance * Math.cos(rad);
  directLight.position.z = target.z + horizonDistance * Math.sin(rad);
  directLightHelper.update();
};

gui.add(obj, "elevation", 1, 89).onChange(elevFunc).name("平行光高度角");
gui.add(obj, "azimuth", 0, 360).onChange(aziFunc).name("平行光方位角");

/**
 * @function calculateNewAPositionVector3 根据传入的高度角重新计算A点的坐标
 * @param {THREE.Vector3} A 动点
 * @param {THREE.Vector3} B 围绕点
 * @param {number} elevation  B点看A点的高度角
 * @returns {THREE.Vector3} 新的A点坐标
 */
function calculatePosition(A, B, elevation) {
  const d = A.distanceTo(B); // 计算光源与中心点距离
  const dVector = A.clone().sub(B).normalize(); // 计算光源与中心点的单位方向向量
  const horizonVector = dVector.clone().setY(0).normalize(); // 计算光源与中心点连线在水平面的单位方向向量
  const thetaRad = THREE.MathUtils.degToRad(elevation);
  // 计算垂直距离与水平距离
  const horizonComponent = d * Math.cos(thetaRad);
  const verticalComponent = d * Math.sin(thetaRad);

  return new THREE.Vector3(
    B.x + horizonComponent * horizonVector.x,
    B.y + verticalComponent,
    B.z + horizonComponent * horizonVector.z
  );
}

const sunFolder = gui.addFolder("太阳运行动画");
const timeObj = {
  animate: false,
  month: 8,
  speed: 100,
};
sunFolder.add(timeObj, "animate").name("开始动画");
sunFolder
  .add(timeObj, "month", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  .onChange((value) => {
    timeObj.month = value;
    time.setMonth(timeObj.month - 1);
  })
  .name("月份");

// 时间变量
const time = new Date();
time.setHours(0, 0, 0);
time.setMonth(timeObj.month - 1);
let min = 0;
// 地点变量
const location = [39.9042, 116.4074];

sunFolder.add(location, "0", -80, 80, 5).name("纬度");

// 时间提示
const span = document.createElement("span");
span.textContent = "时间：";
span.style = "font-size:18px;color:white;position:absolute;top:10px;left:10px";
document.body.appendChild(span);

// 太阳轨迹动画
const func = () => {
  if (!timeObj.animate) {
    return;
  }
  time.setMinutes(min);

  // 根据时间计算太阳位置
  const position = Suncalc.getPosition(time, ...location);
  obj.azimuth = (position.azimuth * 180) / Math.PI + 180;
  obj.elevation = (position.altitude * 180) / Math.PI;
  // 更新光源位置
  elevFunc(obj.elevation);
  aziFunc(obj.azimuth);

  // 更新文本提示
  if (time.getMinutes() % 30 == 0) {
    span.textContent = `时间：${time.toLocaleString()}, 高度角：${obj.elevation.toFixed(
      2
    )}°, 方位角：${obj.azimuth.toFixed(2)}°`;
  }

  // 太阳未升起，光源强度为0
  if (obj.elevation < 0) {
    directLight.intensity = 0;
  } else {
    directLight.intensity = 1;
  }

  // 时间递增
  min += 2;
  if (min >= 60) {
    time.setHours((time.getHours() + 1) % 24);
    min = 0;
  }
};

// 开始动画
let intervalId;
intervalId = setInterval(func, timeObj.speed);
// 改变动画速率
sunFolder
  .add(timeObj, "speed", 10, 100, 10)
  .onChange(() => {
    clearInterval(intervalId);
    intervalId = setInterval(func, timeObj.speed);
  })
  .name("动画速度");
//#endregion

//#region 阴影类型
// 渲染器的阴影贴图属性.shadowMap的属性值是一个对象，具有.enabled、.type等属性。
// 模型表面产生条纹影响渲染效果，可以改变.shadowMap.type默认值优化
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//#endregion
