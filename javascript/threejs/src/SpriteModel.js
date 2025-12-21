import { initScene } from "./common.js";
import * as THREE from "three";

const { renderer, camera, scene } = initScene();
document.body.appendChild(renderer.domElement);

//#region 精灵模型标注场景物体
// Three.js的精灵模型Sprite和Threejs的网格模型Mesh一样都是模型对象，父类都是Object3D
// 创建精灵模型对象和创建网格模型对象相似，不同在于创建精灵模型对象不需要创建几何体对象Geometry
// 创建精灵材质对象SpriteMaterial
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("../data/sprite.png");
// 网格材质.transparent属性默认是false，如果贴图是背景透明的png贴图，需要设置为true
// 对于SpriteMaterial而言，.transparent默认是true
const spriteMaterial = new THREE.SpriteMaterial({
  color: 0xff0000, //设置颜色
  map: texture, //设置纹理贴图
});
// 创建精灵模型对象，不需要几何体geometry参数
const sprite = new THREE.Sprite(spriteMaterial);
scene.add(sprite);

// 创建平面物体
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const geometry = new THREE.PlaneGeometry(100, 100);
const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(-Math.PI / 2); // 绕X轴旋转90度
scene.add(mesh);

// 控制精灵大小
console.log("sprite.scale", sprite.scale);
sprite.scale.set(10, 10, 1); //只需要设置x、y两个分量就可以
sprite.position.set(0, 5, 0);

//#endregion

//#region 精灵模型模仿下雨
// 提供一个背景透明的png雨滴贴图，然后作为Sprite的颜色贴图，用来模拟雨滴3D几何体
const raindropTexture = new THREE.TextureLoader().load("../data/雨滴.png");
// const raindropTexture = new THREE.TextureLoader().load("../data/雪花.png");
const rainMaterial = new THREE.SpriteMaterial({
  map: raindropTexture,
  color: 0x81c0fc,
  // color: 0xbfd9e3,
});

// 创建一个Group对象，用来存放所有的雨滴对象
const rain = new THREE.Group();
// 随机创建20000个雨滴对象，并添加到Group对象中
for (let i = 0; i < 20000; i++) {
  // 精灵模型共享材质
  const sprite = new THREE.Sprite(rainMaterial);
  rain.add(sprite);
  sprite.scale.set(1, 1, 1);
  // 设置精灵模型位置，在长方体空间上上随机分布
  const x = 800 * (Math.random() - 0.5);
  const y = 600 * Math.random();
  const z = 800 * (Math.random() - 0.5);
  sprite.position.set(x, y, z);
}
scene.add(rain);

// const clock = new THREE.Clock();
function loop() {
  // const t = clock.getDelta();
  // loop()每次执行都会更新雨滴的位置，进而产生动画效果
  rain.children.forEach((sprite) => {
    // 雨滴的y坐标每次减t*60
    sprite.position.y -= Math.random() * 1.3;
    if (sprite.position.y < 0) {
      sprite.position.y = 600;
    }
  });

  requestAnimationFrame(loop);
}
loop();
// 相机在下雨的场景中，相机会渲染near~far范围的Sprite，距离相机0~near范围不会渲染
// 小部分Sprite会在相机镜头前经过，这时候相机near附近雨滴Sprite会显示比较大
// 可以把near调整大一些，这样距离相机非常近的Sprite不会渲染

//#endregion
