import * as THREE from "three";
import { initScene } from "./common";
import { GUI } from "dat.gui";

const { scene, camera, renderer } = initScene();

document.body.appendChild(renderer.domElement);

//#region 创建点、线
// BufferGeometry是一个没有任何形状的空几何体
// 通过BufferGeometry自定义任何几何形状，具体一点说就是定义顶点数据
const geom = new THREE.BufferGeometry();

//类型化数组创建顶点数据
// prettier-ignore
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
]);
// 使用属性缓冲区对象BufferAttribute表示threejs几何体顶点数据
const attr = new THREE.BufferAttribute(vertices, 3);

// 设置几何体attributes属性的位置属性
geom.attributes.position = attr;

// 点渲染模式
const pointsMaterial = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 5.0, //点对象像素尺寸
});

const points = new THREE.Points(geom, pointsMaterial); //点模型对象
scene.add(points); //添加到场景中

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000,
});

const line = new THREE.Line(geom, lineMaterial); //线模型对象
// const lineLoop = new THREE.LineLoop(geom, lineMaterial); //线环模型对象
// const lineSegments = new THREE.LineSegments(geom, lineMaterial); //线段模型对象
scene.add(line); //添加到场景中
//#endregion

//#region 创建面
// prettier-ignore
const polyVertices = new Float32Array([
    0, 0, -20, //顶点1坐标
    80, 0, -20, //顶点2坐标
    80, 80, -20, //顶点3坐标

    0, 0, -20, //顶点4坐标   和顶点1位置相同
    80, 80, -20, //顶点5坐标  和顶点3位置相同
    0, 80, -20, //顶点6坐标
]);

const polyGeom = new THREE.BufferGeometry();
// 设置几何体顶点位置数据
polyGeom.attributes.position = new THREE.BufferAttribute(polyVertices, 3);

const polyMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
});
const poly = new THREE.Mesh(polyGeom, polyMaterial);
scene.add(poly);

// 使用顶点索引数据
// prettier-ignore
const polyVertices2 = new Float32Array([
    0, 0, -40, //顶点1坐标
    80, 0, -40, //顶点2坐标
    80, 80, -40, //顶点3坐标
    0, 80, -40, //顶点4坐标
]);
const polyIndexs = new Uint16Array([0, 1, 2, 0, 2, 3]);

const polyGeom2 = new THREE.BufferGeometry();
polyGeom2.attributes.position = new THREE.BufferAttribute(polyVertices2, 3);
polyGeom2.index = new THREE.BufferAttribute(polyIndexs, 1);
const polyMaterial2 = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  side: THREE.DoubleSide,
});
const poly2 = new THREE.Mesh(polyGeom2, polyMaterial2);
scene.add(poly2);
//#endregion

//#region 光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); //环境光
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10); //点光源
pointLight.decay = 1; //衰减值
pointLight.position.set(70, 70, -70);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xffffff, 10); //点光源
pointLight2.decay = 1; //衰减值
pointLight2.position.set(150, 140, 150);
scene.add(pointLight2);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10, 0xff0000); //点光源辅助对象
scene.add(pointLightHelper);
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 10, 0xff0000); //点光源辅助对象
scene.add(pointLightHelper2);
//#endregion

//#region 控制
const gui = new GUI();
gui.add(pointLight, "intensity", 0, 100).name("光照强度");
//#endregion

//#region 几何体法线
// MeshBasicMaterial不受光照影响, 使用受光照影响的材质, 几何体Geometry需要定义顶点法线数据
const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0x00ffff,
  side: THREE.DoubleSide,
});

// 定义顶点、索引、法线数据
// prettier-ignore
const polyVertices3 = new Float32Array([
    0, 0, -90, //顶点1坐标
    80, 0, -90, //顶点2坐标
    80, 80, -90, //顶点3坐标
    0, 80, -90, //顶点4坐标
]);
const polyIndexs3 = new Uint16Array([0, 1, 2, 0, 2, 3]);
// 每个顶点的法线数据和顶点位置数据一一对应, 若不使用索引, 则法线数据也需要一一对应
// prettier-ignore
const normals = new Float32Array([
    0, 0, 1, //顶点1法线 ( 法向量 )
    0, 0, 1, //顶点2法线
    0, 0, 1, //顶点3法线
    0, 0, 1, //顶点4法线
]);

const polyGeom3 = new THREE.BufferGeometry();
// 定义顶点、索引、法线数据
polyGeom3.attributes.position = new THREE.BufferAttribute(polyVertices3, 3);
polyGeom3.index = new THREE.BufferAttribute(polyIndexs3, 1);
polyGeom3.attributes.normal = new THREE.BufferAttribute(normals, 3);

scene.add(new THREE.Mesh(polyGeom3, lambertMaterial));
//#endregion

//#region 现成几何体结构查看
// 线条模式渲染，查看几何体三角形结构
const wireframeMaterial = new THREE.MeshLambertMaterial({
  color: 0x000000,
  wireframe: true,
});

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 2, 2),
  wireframeMaterial
);
planeMesh.position.set(140, 50, 0);
console.log(planeMesh.geometry.attributes, planeMesh.geometry.index);

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(50, 30, 15),
  wireframeMaterial
);
sphereMesh.position.set(0, 50, 130);
console.log(sphereMesh.geometry.attributes, sphereMesh.geometry.index);

scene.add(planeMesh).add(sphereMesh);

//#endregion

//#region 几何体位置变换
//BufferGeometry通过scale、translate、rotate等方法可以对几何体本身进行缩放、平移、旋转
// 这些方法本质上都是改变几何体的顶点数据
const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(30, 30, 30),
  lambertMaterial
);

boxMesh.position.set(100, 50, 100);
scene.add(boxMesh);
// 平移
const boxMesh2 = boxMesh.clone();
boxMesh2.geometry = boxMesh.geometry.clone();
boxMesh2.geometry.translate(40, 0, 0);
scene.add(boxMesh2);
// 缩放
const boxMesh3 = boxMesh.clone();
boxMesh3.geometry = boxMesh.geometry.clone();
boxMesh3.geometry.translate(0, 0, 40).scale(1.5, 1.5, 1.5);
scene.add(boxMesh3);
// 旋转
const boxMesh4 = boxMesh.clone();
boxMesh4.geometry = boxMesh.geometry.clone();
boxMesh4.geometry.translate(0, 40, 0).rotateY(Math.PI / 4);
scene.add(boxMesh4);

// 归位, 已经偏移的几何体重新与变化前的几何体原点重合
setTimeout(() => {
  boxMesh3.geometry.center();
}, 3000);
//#endregion
