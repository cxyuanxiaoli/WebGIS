import { initScene } from "./common";
import * as THREE from "three";
import { GUI } from "dat.gui";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);

//#region 分组管理
const lightGroup = new THREE.Group();
scene.add(lightGroup);

const meshGroup = new THREE.Group();
scene.add(meshGroup);
//#endregion

//#region 光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
lightGroup.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 1000, 0);
pointLight.position.set(20, 50, 50);
lightGroup.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 5, 0xff0000);
lightGroup.add(pointLightHelper);
//#endregion

//#region 调试面板
const gui = new GUI();
const pointLightFolder = gui.addFolder("Point Light");
pointLightFolder.add(pointLight.position, "x", -100, 100).name("X");
pointLightFolder.add(pointLight.position, "y", -100, 100).name("Y");
pointLightFolder.add(pointLight.position, "z", -100, 100).name("Z");
pointLightFolder.add(pointLight, "intensity", 0, 10).name("Intensity");
//#endregion

//#region 创建纹理贴图

//纹理贴图加载器TextureLoader, .load()方法加载图像，返回一个纹理对象Texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("../data/testTexture.jpg");
// 新版本webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为THREE.SRGBColorSpace
texture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间

const geometry = new THREE.PlaneGeometry(50, 30);
const material = new THREE.MeshLambertMaterial({
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  map: texture, //map表示材质的颜色贴图属性
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(geometry, material);
planeMesh.position.set(0, 15, 0);
meshGroup.add(planeMesh);

const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshLambertMaterial()
);
boxMesh.material.map = texture;
boxMesh.position.set(0, 5, 20);
meshGroup.add(boxMesh);

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(5),
  new THREE.MeshLambertMaterial()
);
sphereMesh.material.map = texture;
sphereMesh.position.set(0, 5, 40);
meshGroup.add(sphereMesh);
//#endregion

//#region 顶点UV坐标
// 顶点UV坐标的作用是从纹理贴图上提取像素映射到网格模型Mesh的几何体表面上
// 浏览器控制台查看threejs几何体默认的UV坐标数据
console.log(
  planeMesh.geometry.attributes.position,
  planeMesh.geometry.attributes.uv
);
console.log(
  sphereMesh.geometry.attributes.position,
  sphereMesh.geometry.attributes.uv
);

// 顶点UV坐标可以在0~1.0之间任意取值，纹理贴图左下角对应的UV坐标是(0,0)，右上角对应的坐标(1,1)
// 顶点UV坐标geometry.attributes.uv和顶点位置坐标geometry.attributes.position是一一对应的
// prettier-ignore
const uvData=new Float32Array([
    0, 0, //图片左下角
    1, 0, //图片右下角
    0, 1, //图片左上角
    1, 1, //图片右上角
])
// 自定义uv坐标，使图片倒置
planeMesh.geometry.attributes.uv = new THREE.BufferAttribute(uvData, 2);
//#endregion

//#region 圆形平面设置纹理贴图
const circlePlaneMesh = new THREE.Mesh(
  new THREE.CircleGeometry(5, 32),
  new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide })
);
circlePlaneMesh.position.set(0, 5, 60);
meshGroup.add(circlePlaneMesh);

// CircleGeometry的UV坐标会对颜色纹理贴图.map进行提取
// CircleGeometry的UV坐标默认提取的就是一个圆形轮廓

console.log(
  circlePlaneMesh.geometry.attributes.position,
  circlePlaneMesh.geometry.attributes.uv
);

//#endregion

//#region 纹理贴图阵列
const planeGeom = new THREE.PlaneGeometry(1000, 1000);
//纹理贴图加载器TextureLoader
// .load()方法加载图像，返回一个纹理对象Texture
const texture2 = textureLoader.load("../data/cizhuan.jpg");
texture2.colorSpace = THREE.SRGBColorSpace;
// 设置阵列模式
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
texture2.repeat.set(16, 16); //注意选择合适的阵列数量
const material2 = new THREE.MeshLambertMaterial({
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  map: texture2, //map表示材质的颜色贴图属性
});
const planeMesh2 = new THREE.Mesh(planeGeom, material2);
// 注意旋转方向影响矩形平面背面还是正面朝上，threejs默认渲染正面，不渲染背面
planeMesh2.rotateX(-Math.PI / 2);
scene.add(planeMesh2);

//#endregion

//#region PNG纹理贴图
// 矩形平面网格模型设置背景透明的png贴图
const texture3 = textureLoader.load("../data/fengjing.png");
texture3.colorSpace = THREE.SRGBColorSpace;
const planeMesh3 = new THREE.Mesh(
  new THREE.PlaneGeometry(150, 100),
  new THREE.MeshLambertMaterial({
    map: texture3,
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
  })
);
planeMesh3.position.set(0, 50, -50);

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(150, 15, 0x004444, 0x004444);
gridHelper.position.set(0, 75, -50);
gridHelper.rotateX(Math.PI / 2);
scene.add(gridHelper);

meshGroup.add(planeMesh3);
//#endregion

//#region UV动画
// 纹理对象Texture的.offset的功能是偏移贴图在Mesh上位置，本质上相当于修改了UV顶点坐标
texture3.offset.x += 0.2;
// texture3.offset.y += 0.5;
console.log(planeMesh3.geometry.attributes.uv);

// 设置纹理映射偏移后, 把.wrapS或.wrapT设置为THREE.RepeatWrapping, 使得纹理贴图在U或V方向重复
texture3.wrapS = THREE.RepeatWrapping; //对应offste.x偏移
texture3.wrapT = THREE.RepeatWrapping; //对应offste.y偏移
texture3.repeat.x = 2;
texture3.repeat.y = 2;

// 渲染循环
function render() {
  texture3.offset.x += 0.001;
  // texture3.offset.y += 0.001;
  requestAnimationFrame(render);
}
render();

//#endregion
