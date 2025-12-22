import { initScene } from "./common.js";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";

const { renderer, camera, scene } = initScene();
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x888888);

const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light);
const light2 = new THREE.PointLight(0xffffff, 2, 1000, 0);
light2.position.set(100, 100, 100);
scene.add(light2);

//#region CSS2DRenderer
// 通过CSS2DRenderer.js可以把HTML元素作为标签标注三维场景
const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial({ color: 0x00ff00 })
);
box.position.set(50, 5, 50);
scene.add(box);
// 写代码把世界坐标xyz，转化为像素px表示屏幕坐标，比较麻烦，threejs扩展库帮助实现坐标转化，给HTML元素标签定位
// 通过CSS2DObject类，可以把一个HTML元素转化为一个类似threejs网格模型的对象
const tagDiv = document.createElement("div");
// 若需加载外部模型，可以先把标签隐藏display: none; 等gltf模型加载完成，CSS2渲染器默认会把标签设置为display: block;
tagDiv.style =
  "background-color:red;color:white;padding:5px;font-size:12px;border-radius:5px;top:-15px;display:none;";
tagDiv.innerHTML = "Hello World";

const tagObj = new CSS2DObject(tagDiv);
tagObj.position.set(0, 5, 0);
box.add(tagObj);
// 引入CSS2渲染器CSS2DRenderer
// CSS2渲染器CSS2DRenderer和WebGLRenderer一样都是渲染器，只是渲染模型对象不同，WebGLRenderer主要是渲染threejs自身的网格、点、线等模型
// CSS2DRenderer用来渲染HTML元素标签对应的CSS2模型对象CSS2DObject
const css2dRenderer = new CSS2DRenderer();
css2dRenderer.domElement.style =
  "position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";
css2dRenderer.setSize(
  renderer.domElement.clientWidth,
  renderer.domElement.clientHeight
);
document.body.appendChild(css2dRenderer.domElement);
// CSS2DRenderer渲染的本质：把CSS2DObject模型对象对应的HTML元素标签渲染到CSS2DRenderer的dom元素中
// 渲染HTML标签对应的CSS2DObject模型对象
css2dRenderer.render(scene, camera);

// 渲染循环
function render() {
  css2dRenderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

// 窗口自适应
window.addEventListener("resize", () => {
  css2dRenderer.setSize(
    renderer.domElement.clientWidth,
    renderer.domElement.clientHeight
  );
  css2dRenderer.render(scene, camera);
});
//#endregion

//#region 鼠标选中模型弹出标签
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);
outlinePass.visibleEdgeColor.set(0x00ff00);
composer.addPass(outlinePass);

function render2() {
  composer.render();
  requestAnimationFrame(render2);
}
render2();

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 32),
  new THREE.MeshLambertMaterial({
    color: 0xff0000,
  })
);

scene.add(sphere);

const tagDiv2 = document.createElement("div");
tagDiv2.innerHTML = "球体";
tagDiv2.style =
  "background-color:blue;color:white;padding:5px;font-size:12px;border-radius:5px;top:-14px;";
const tag2 = new CSS2DObject(tagDiv2);
tag2.visible = false;
tag2.position.set(0, 10, 0);
sphere.add(tag2);

const raycaster = new THREE.Raycaster();
const screenToDevice = (x, y) => {
  const width = renderer.domElement.clientWidth;
  const height = renderer.domElement.clientHeight;
  const deviceX = (x / width) * 2 - 1;
  const deviceY = (-y / height) * 2 + 1;
  return { x: deviceX, y: deviceY };
};

let selectedObj = null;
window.addEventListener("click", (event) => {
  const { x, y } = screenToDevice(event.offsetX, event.offsetY);
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

  const intersects = raycaster.intersectObjects([sphere]);
  if (intersects.length > 0) {
    selectedObj = intersects[0].object;
    console.log(selectedObj);
    if (selectedObj.children[0].isCSS2DObject) {
      selectedObj.children[0].visible = true;
      outlinePass.selectedObjects = [selectedObj];
    }
  } else {
    if (selectedObj) selectedObj.children[0].visible = false;
    outlinePass.selectedObjects = [];
  }
});
//#endregion

//#region CSS3DRenderer
// CSS3渲染器CSS3DRenderer和CSS2渲染器CSS2DRenderer整体使用流程基本相同
// 在HTML标签渲染效果方面不同，如CSS3渲染的标签会跟着场景相机同步缩放，而CSS2渲染的标签默认保持自身像素值
// 创建一个CSS3渲染器CSS3DRenderer
const css3dRenderer = new CSS3DRenderer();
css3dRenderer.domElement.style =
  "position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";
css3dRenderer.setSize(
  renderer.domElement.clientWidth,
  renderer.domElement.clientHeight
);
document.body.appendChild(css3dRenderer.domElement);

// 渲染循环
function render3() {
  css3dRenderer.render(scene, camera);
  requestAnimationFrame(render3);
}
render3();

// 窗口自适应
window.addEventListener("resize", () => {
  css3dRenderer.setSize(
    renderer.domElement.clientWidth,
    renderer.domElement.clientHeight
  );
  css3dRenderer.render(scene, camera);
});

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(15, 30),
  new THREE.MeshLambertMaterial({
    color: 0x0000ff,
  })
);
cone.position.set(0, 15, 50);
scene.add(cone);

const tagDiv3 = document.createElement("div");
tagDiv3.innerHTML = "圆锥体";
// 禁止CSS3DObject标签对应HTMl元素背面显示   backface-visibility: hidden;
tagDiv3.style =
  "height:4px;background-color:green;color:white;padding:1px;font-size:2px;border-radius:2px;backface-visibility: hidden;";

// 默认情况下CSS3模型对象渲染的标签的几何中心默认和标注位置的坐标重合
// HTML像素高度40px，那么HTML标签对象在threejs中的数字相当于高度为40的矩形平面网格模型
// CSS2渲染的标签和CSS3渲染的标签偏移方式不同，CSS3标签，直接按照threejs模型尺寸修改方式改变，比用HTML像素方式更方便准确
const tag3 = new CSS3DObject(tagDiv3);
tag3.position.set(0, 18, 0);
cone.add(tag3);
//#endregion

//#region CSS3D精灵模型
// CSS3对象模型CSS3DObject渲染效果类似矩形平面网格模型Mesh
// CSS3精灵模型可以跟着场景缩放，位置可以跟着场景旋转，但是自身的姿态角度始终平行于画布
const tagDiv4 = tagDiv3.cloneNode(true);
tagDiv4.textContent = "圆锥体sprite";
const tag4 = new CSS3DSprite(tagDiv4);
tag4.position.set(0, 25, 0);
cone.add(tag4);

// 在CSS3渲染器渲染的时候，标签默认会被设置为pointer-events: auto;
// 这时候虽然css3Renderer.domElement不遮挡画布的鼠标事件，但是标签会遮挡
// 所以可以在创建CSS3DObject对象后强制将标签的pointer-events设置为none
// 因为执行new CSS3DObject(div)的时候，会把HTML标签设置为.style.pointerEvents = 'auto'
tagDiv4.style.pointerEvents = "none";
//#endregion

//#region 精灵模型Sprite作为标签
// 实际开发的时候，可以使用精灵模型Sprite + 颜色贴图作为标签，标注三维场景
// 精灵模型Sprite和CSS3精灵模型CSS3DSprite标签差异
// 精灵模型渲染的标签可以被其他网格模型遮挡，但是CSS3渲染器渲染的标签不会被其它网格模型遮挡
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load("../data/sprite.png");
const spriteMaterial = new THREE.SpriteMaterial({
  map: texture,
});
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(8, 8, 1);
sprite.position.set(0, 33, 0);
cone.add(sprite);
//#endregion
