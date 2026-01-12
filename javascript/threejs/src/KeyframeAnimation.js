import { initScene } from "./common.js";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import TWEEN from "@tweenjs/tween.js";

const { renderer, camera, scene } = initScene();
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 4, 2000, 0);
pointLight.position.set(100, 300, 100);
scene.add(pointLight);

const gui = new GUI();

//#region 关键帧动画
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// 1. 创建动画剪辑 AnimationClip
// 1.1 设置关键帧轨道KeyframeTrack数据
// 1.2 动画剪辑(AnimationClip)是一个可重用的关键帧轨道集, 它代表动画

// 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
const posKF = new THREE.KeyframeTrack(
  ".position",
  [0, 3, 6],
  [0, 0, 0, 100, 20, 0, 0, 0, 100]
);
// 从2秒到5秒，物体从红色逐渐变化为蓝色
const colorKF = new THREE.KeyframeTrack(
  ".material.color",
  [2, 5],
  [1, 0, 0, 0, 0, 1]
);
// 创建一个clip关键帧动画对象，命名"test"，持续时间6秒。
const clip = new THREE.AnimationClip("test", 6, [posKF, colorKF]);

// 2. 播放动画
// 2.1 创建动画混合器AnimationMixer将静态对象转为动画对象
// 2.2 `.clipAction()`为动画对象添加动画剪辑clip
// 2.3 AnimationAction用于控制动画播放
// 2.2 mixer.update()更新混合器AnimationMixer

const mixer = new THREE.AnimationMixer(mesh);
const clipAction = mixer.clipAction(clip);
clipAction.setLoop(THREE.LoopOnce, 1);

const obj = {
  enabled: true,
  pause: false,
  clampWhenFinished: false,
  time: 0,
  timeScale: 1,
  loop: "once",
  repertNum: 1,
};
//#endregion

//#region 动画控制按钮

function addFuncBtn(text, func) {
  const btn = document.createElement("button");
  btn.style = `position:absolute;top:5px;left:${10 + btnCount++ * 50}px;`;
  btn.textContent = text;
  btn.addEventListener("click", func);
  document.body.appendChild(btn);
}

let btnCount = 0;
addFuncBtn("重置", () => {
  clipAction.reset();
});
addFuncBtn("播放", () => {
  clipAction.play();
});
addFuncBtn("停止", () => {
  clipAction.stop();
});

gui
  .add(obj, "enabled")
  .onChange(() => {
    clipAction.enabled = obj.enabled;
  })
  .name("启用");
gui
  .add(obj, "pause")
  .onChange(() => {
    clipAction.paused = obj.pause;
  })
  .name("暂停");
gui
  .add(obj, "clampWhenFinished")
  .onChange(() => {
    clipAction.clampWhenFinished = obj.clampWhenFinished;
  })
  .name("停在最后一帧");

gui
  .add(obj, "time", 0, 6, 0.1)
  .onChange(() => {
    clipAction.time = obj.time;
  })
  .name("时间");
gui
  .add(obj, "timeScale", 0, 6)
  .onChange(() => {
    clipAction.timeScale = obj.timeScale;
  })
  .name("时间缩放");

gui
  .add(obj, "loop", ["once", "repeat", "pingpong"])
  .onChange(() => {
    const checked = ["once", "repeat", "pingpong"].findIndex(
      (i) => i === obj.loop
    );
    if (checked === 0) {
      clipAction.setLoop(THREE.LoopOnce, obj.repertNum);
    } else if (checked === 1) {
      clipAction.setLoop(THREE.LoopRepeat, obj.repertNum);
    } else if (checked === 2) {
      clipAction.setLoop(THREE.LoopPingPong, obj.repertNum);
    }
  })
  .name("循环模式");
gui
  .add(obj, "repertNum", 1, 10, 1)
  .onChange(() => {
    clipAction.repetitions = obj.repertNum;
  })
  .name("循环次数");

setInterval(() => {
  obj.enabled = clipAction.enabled;
  obj.pause = clipAction.paused;
  obj.clampWhenFinished = clipAction.clampWhenFinished;
  obj.time = clipAction.time;
  obj.timeScale = clipAction.timeScale;

  const loop = clipAction.loop;
  if (loop === THREE.LoopOnce) obj.loop = "once";
  else if (loop === THREE.LoopRepeat) obj.loop = "repeat";
  else if (loop === THREE.LoopPingPong) obj.loop = "pingpong";

  obj.repertNum = clipAction.repetitions;

  gui.updateDisplay();
}, 200);
//#endregion

//#region 加载外部模型动画
const gltfLoader = new GLTFLoader();
// 模型动画混合器
let modelMixer = null;
// 模型动画动作集, 单项包含 name, action, duration
const modelAnimationActions = [];
// 当前播放的动作
let activeAnimation = {
  value: "",
  action: null,
};

const onLoadFunc = (gltf) => {
  // 显示骨架
  const skeletonHelper = new THREE.SkeletonHelper(gltf.scene);
  scene.add(skeletonHelper);

  // 加载模型
  const model = gltf.scene.children[0];
  model.scale.set(10, 10, 10);
  model.position.set(50, 0, 0);
  scene.add(model);

  // 创建模型动画混合器
  modelMixer = new THREE.AnimationMixer(model);
  // 将所有动作保存到变量
  gltf.animations.forEach((animation) => {
    const action = modelMixer.clipAction(animation);
    modelAnimationActions.push({
      name: animation.name,
      action: action,
      duration: animation.duration,
    });
  });
  console.log(modelAnimationActions);

  // 添加gui按钮切换动作
  const modelFolder = gui.addFolder("加载模型动画");
  const actionNames = modelAnimationActions.map((item) => item.name);
  modelFolder.add(activeAnimation, "value", actionNames).onChange((value) => {
    // 切换动作逻辑
    // 1.查找要切换到的动作
    const action = modelAnimationActions.find(
      (item) => item.name === value
    ).action;
    // 2.确保要切换到的动画已准备
    action.reset().play();
    // 3.淡出旧动作
    if (activeAnimation.action) {
      activeAnimation.action.crossFadeTo(action, 1, true);
    }
    // 4.更新当前播放的动作
    activeAnimation.action = action;
  });
};

// 加载外部模型
gltfLoader.load(
  "../data/3D卡通风格小智角色模型/80b8d5b144ca4e3fb3ff97a12e9b3454.glb",
  onLoadFunc,
  undefined,
  (error) => {
    console.error(error);
  }
);
//#endregion

//#region 变形动画
//几何体两组顶点一一对应，位置不同，然后通过权重系数，可以控制模型形状在两组顶点之间变化
const geometry = new THREE.BoxGeometry(20, 20, 20);
// 为geometry提供变形目标的顶点数据(注意和原始geometry顶点数量一致)
const target1 = new THREE.BoxGeometry(20, 80, 20).attributes.position; //变高
const target2 = new THREE.BoxGeometry(5, 20, 5).attributes.position; //变瘦
// 几何体顶点变形目标数据
geometry.morphAttributes.position = [target1, target2];

const meshDemo = new THREE.Mesh(
  geometry,
  new THREE.MeshLambertMaterial({ color: 0x00ff00 })
);
meshDemo.position.set(0, 0, 100);
scene.add(meshDemo);

// 设置变形目标影响权重，范围一般0~1，mesh在geometry原始形状和变形目标1顶点对应形状之间变化
// 几何体变形目标是放在一个数组.morphAttributes.position中的，设置权重系数时候需要设置索引值，
// 比如.morphTargetInfluences[0]影响的变形目标是.morphAttributes.position[0]
const morphFolder = gui.addFolder("变形动画");
morphFolder.add(meshDemo.morphTargetInfluences, "0", 0, 1, 0.1).name("变高");
morphFolder.add(meshDemo.morphTargetInfluences, "1", 0, 1, 0.1).name("变瘦");

// 使用关键帧生成变形动画
const KF1 = new THREE.NumberKeyframeTrack(
  ".morphTargetInfluences[0]",
  [0, 3],
  [0, 1]
);
const KF2 = new THREE.NumberKeyframeTrack(
  ".morphTargetInfluences[1]",
  [3, 6],
  [0, 1]
);
const morphClip = new THREE.AnimationClip("morph", 6, [KF1, KF2]);

const morphMixer = new THREE.AnimationMixer(meshDemo);
const morphAction = morphMixer.clipAction(morphClip);
morphAction.setLoop(THREE.LoopOnce, 1);
morphAction.clampWhenFinished = true;

morphAction.play();
//#endregion

//#region 骨骼动画
const bone1 = new THREE.Bone(); //头部关节
const bone2 = new THREE.Bone(); //上躯干关节
const bone3 = new THREE.Bone(); //下躯干关节
const bone4 = new THREE.Bone(); //手臂关节1
const bone5 = new THREE.Bone(); //手臂关节2
const bone6 = new THREE.Bone(); //腿部关节1
const bone7 = new THREE.Bone(); //腿部关节2
// 设置关节连接关系
bone2.add(bone1).add(bone4).add(bone5).add(bone3);
bone3.add(bone6).add(bone7);

// 设置关节初始位置
bone2.position.set(40, 20, 40);
bone3.position.y = -6;
bone1.position.y = 3;
bone4.position.set(0, -2, 7);
bone5.position.set(0, -2, -7);
bone6.position.set(0, -12, 3);
bone7.position.set(0, -12, -3);

// 骨骼关节可以和普通网格模型一样作为其他模型子对象，添加到场景中
const group = new THREE.Group();
group.add(bone2);
// SkeletonHelper会可视化参数模型对象所包含的所有骨骼关节
const skeletonHelper = new THREE.SkeletonHelper(group);
group.add(skeletonHelper);
scene.add(group);

const boneFolder = gui.addFolder("骨骼动画");
boneFolder.add(bone4.position, "z", 0, 20, 1);
//#endregion

//#region tween动画库
new TWEEN.Tween(mesh.position).to({ x: 20, z: 20 }, 3000).start();

addFuncBtn("相机动画", () => {
  console.log("123");
  const position = camera.position.clone();

  new TWEEN.Tween(camera.position)
    .to({ x: -100 })
    .onUpdate(() => {
      camera.lookAt(0, 0, 0);
    }, 3000)
    .onComplete(() => {
      camera.position.copy(position);
      camera.lookAt(0, 0, 0);
    })
    .start();
});

//#region 渲染循环
const clock = new THREE.Clock();
function loop() {
  requestAnimationFrame(loop);
  const frameT = clock.getDelta();
  mixer.update(frameT);
  if (modelMixer) {
    modelMixer.update(frameT);
  }
  morphMixer.update(frameT);
  TWEEN.update();
}
loop();
//#endregion
