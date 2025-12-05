import { initScene } from "./common";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "dat.gui";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 2000, 0);
pointLight.position.set(0, 50, 80);
scene.add(pointLight);

const gui = new GUI();
const lightFolder = gui.addFolder("光照");
lightFolder.add(pointLight, "intensity", 0, 10, 1).name("点光源强度");
lightFolder.add(ambientLight, "intensity", 0, 2, 0.1).name("环境光源强度");

// Three.js提供了两个PBR材质相关的APIMeshStandardMaterial和MeshPhysicalMaterial
// MeshPhysicalMaterial是MeshStandardMaterial扩展的子类，提供了更多功能属性
// 渲染表现能力 MeshBasicMaterial < MeshLambertMaterial < MeshPhongMaterial < MeshStandardMaterial < MeshPhysicalMaterial

//#region 金属度与粗糙度
const material = new THREE.MeshStandardMaterial({
  metalness: 0,
  color: 0xf7cc69,
  roughness: 0.5,
});

gui.add(material, "metalness", 0, 1, 0.1).name("金属度");
gui.add(material, "roughness", 0, 1, 0.1).name("粗糙度");

const sphere = new THREE.Mesh(new THREE.SphereGeometry(10), material);
scene.add(sphere);

const box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material);
box.position.set(20, 0, 0);
scene.add(box);

//#endregion

//#region 环境贴图
// 环境贴图对PBR材质渲染效果影响比较大，一般渲染PBR材质的模型，最好设置一个合适的环境贴图
// 所谓环境贴图，就是一个模型周围的环境的图像，比如一间房子，房子的上下左右前后分别拍摄一张照片，就是3D空间中6个角度方向的照片
// 加载周围环境6个方向贴图
// CubeTexture表示立方体纹理对象，父类是纹理对象Texture
const textureCube = new THREE.CubeTextureLoader().setPath("../data/").load([
  "env1.jpg", //x轴正方向
  "env1.jpg", //x轴负方向
  "env1.jpg", //y轴正方向
  "env1.jpg", //y轴负方向
  "env1.jpg", //z轴正方向
  "env1.jpg", //z轴负方向
]);
textureCube.colorSpace = THREE.SRGBColorSpace;

const material2 = new THREE.MeshStandardMaterial({
  color: 0xf7cc69,
  roughness: 0.2,
  metalness: 1,
  envMap: textureCube,
});
// .envMapIntensity相当于环境贴图的系数，环境贴图像素值乘以该系数后，在用于影响模型表面
//默认值1, 设置为0.0则相当于没有环境贴图
material2.envMapIntensity = 1.0;

const localFolder = gui.addFolder("局部环境贴图");

localFolder.add(material2, "metalness", 0, 1, 0.1).name("金属度");
localFolder.add(material2, "roughness", 0, 1, 0.1).name("粗糙度");
localFolder.add(material2, "envMapIntensity", 0, 1, 0.1).name("环境贴图强度");

// 对于PBR材质，如果threejs三维场景不添加任何光源，物体就是完全黑色的
// 但是只使用环境贴图，物体表面的颜色也能看到，这说明环境贴图提供了物体周围环境发射或反射的光线
// 更换不同明暗的环境贴图，场景中模型的明暗也会有变化

const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(10), material2);
sphere2.position.set(0, 0, 30);
scene.add(sphere2);

const box2 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material2);
box2.position.set(30, 0, 30);
scene.add(box2);
//#endregion

//#region 场景环境贴图
// 要实现环境贴图影响场景中所有Mesh，可以把Scene.environment设置为环境贴图纹理对象
scene.environment = textureCube;
gui.add(scene, "environmentIntensity", 0, 1, 0.1).name("全局贴图强度");
//#endregion

//#region Physical Material
// MeshPhysicalMaterial是在MeshStandardMaterial基础上扩展出来的子类
// 除了继承金属度、粗糙度等属性，还新增了清漆、透光率、反射率、光泽、折射率等等各种用于模拟生活中不同材质的属性
// 为获得最佳效果，使用此材质时应始终指定environment map
const physicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
});
const phyFolder = gui.addFolder("物理材质");
phyFolder.add(physicalMaterial, "metalness", 0, 1, 0.1).name("金属度");
phyFolder.add(physicalMaterial, "roughness", 0, 1, 0.1).name("粗糙度");
phyFolder.add(physicalMaterial, "clearcoat", 0, 1, 0.1).name("清漆层厚度");
phyFolder
  .add(physicalMaterial, "clearcoatRoughness", 0, 1, 0.1)
  .name("清漆层粗糙度");
// 为非金属材质所设置的折射率，范围由1.0到2.333
phyFolder.add(physicalMaterial, "ior", 1, 2.3, 0.1).name("折射率");
// 非金属材质的反射率, 由0.0到1.0
phyFolder.add(physicalMaterial, "reflectivity", 0, 1, 0.1).name("反射率");
// 光泽层的强度,范围是0.0到1.0
phyFolder.add(physicalMaterial, "sheen", 0, 1, 0.1).name("光泽强度");
// 透光率（或者说透光性），范围从0.0到1.0
// 很薄的透明或者半透明的塑料、玻璃材质即便在几乎完全透明的情况下仍旧会保留反射的光线，透光性属性用于这种类型的材质
phyFolder.add(physicalMaterial, "transmission", 0, 1, 0.1).name("透光率");

const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(30, 10, 20),
  physicalMaterial
);
box3.position.set(60, 0, 0);
scene.add(box3);
//#endregion

//#region 加载gltf文件定义的材质
// 实际开发的时候PBR材质的属性，很多时候是可以在三维建模软件中设置的
// 通过gltf导出即可，这样就不用在threejs代码设置
// threejs解析gltf模型材质的时候，一般默认使用标准网格材质MeshStandardMaterial
// 如果gltf有的材质具有.clearcoat、.transmission等属性，用MeshPhysicalMaterial来解析gltf材质

const loader = new GLTFLoader();
loader.load(
  "../data/材质.glb",
  (gltf) => {
    console.log(gltf.scene.children[0].material);
  },
  undefined,
  (err) => {
    console.error(err);
  }
);

//#endregion
