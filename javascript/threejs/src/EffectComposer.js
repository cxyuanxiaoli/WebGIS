import { initScene } from "./common.js";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// 引入OutlinePass通道
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
// 引入UnrealBloomPass通道
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
// 引入GlitchPass通道
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
// 伽马校正后处理Shader
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
// FXAA抗锯齿Shader
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
// SMAA抗锯齿通道
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";

const { renderer, camera, scene } = initScene();
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 1);

//#region 创建后处理对象
// 创建后处理对象EffectComposer，WebGL渲染器作为参数
const composer = new EffectComposer(renderer);
// 通过EffectComposer(renderer)指定了需要后处理的渲染器WebGLRenderer
// 渲染器通道RenderPass的作用是指定后处理对应的相机camera和场景scene
const renderPass = new RenderPass(scene, camera);
// 设置renderPass通道
composer.addPass(renderPass);
//#endregion

//#region 描边高亮处理
const v2 = new THREE.Vector2(window.innerWidth, window.innerHeight);
// OutlinePass第一个参数v2的尺寸和canvas画布保持一致
const outlinePass = new OutlinePass(v2, scene, camera);

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);
const mesh2 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
mesh2.position.x = 20;
scene.add(mesh2);
const mesh3 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
mesh3.position.x = 40;
scene.add(mesh3);

// 通过OutlinePass的选择对象属性.selectedObjects设置要高亮的对象
outlinePass.selectedObjects = [mesh];
//模型描边颜色，默认白色
outlinePass.visibleEdgeColor.set(0x00ff00);
//高亮发光描边厚度
outlinePass.edgeThickness = 4;
//高亮描边发光强度
outlinePass.edgeStrength = 6;
//模型闪烁频率控制，默认0不闪烁
outlinePass.pulsePeriod = 3;

// 设置OutlinePass通道
composer.addPass(outlinePass);
//#endregion

//#region 发光处理
const unrealBloomPass = new UnrealBloomPass(v2);
composer.addPass(unrealBloomPass);
//#endregion

//#region 闪屏处理
const glitchPass = new GlitchPass();
composer.addPass(glitchPass);
//#endregion

//#region 处理导入模型的颜色异常
// 加载gltf模型，如果使用EffectComposer添加后处理功能，模型颜色可能会出现异常
// 使用threejs后处理功能EffectComposer，renderer.outputEncoding会无效，自然会出现颜色偏差
// 创建伽马校正通道
const gammaPass = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaPass);
//#endregion

//#region 抗锯齿处理
// 设置FAXX抗锯齿通道
const FXAAPass = new ShaderPass(FXAAShader);
// `.getPixelRatio()`获取`renderer.setPixelRatio()`设置的值
const pixelRatio = renderer.getPixelRatio(); //获取设备像素比
// width、height是canva画布的宽高度
FXAAPass.uniforms.resolution.value.x = 1 / (window.innerWidth * pixelRatio);
FXAAPass.uniforms.resolution.value.y = 1 / (window.innerHeight * pixelRatio);
// composer.addPass(FXAAPass);

// 设置SMAA抗锯齿通道
const smaaPass = new SMAAPass();
composer.addPass(smaaPass);
//#endregion

//#region 后处理渲染循环
// 渲染循环中后处理EffectComposer执行.render()，会调用webgl渲染器执行.render()
// 也就是说renderer.render(scene, camera)不用再执行
function render() {
  composer.render();
  // renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
//#endregion
