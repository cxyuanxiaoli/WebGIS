import { initScene } from "./common";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 1, 2000, 0);
pointLight.position.set(100, 100, 130);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

//#region 算法计算绘制圆弧
function createCurvePoints(radius, start, end, numSegments) {
  const sp = (start - end) / numSegments; //两个相邻点间隔弧度
  // 批量生成圆弧上的顶点数据
  const points = [];
  for (let i = 0; i <= numSegments; i++) {
    const angle = start + sp * i; //当前点弧度
    // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push(x, y, 0);
  }
  return points;
}
const points = createCurvePoints(100, 0, Math.PI * 2, 50);
console.log(points);

const curveGeom = new THREE.BufferGeometry();
curveGeom.attributes.position = new THREE.BufferAttribute(
  new Float32Array(points),
  3
);
const curve = new THREE.Line(
  curveGeom,
  new THREE.LineBasicMaterial({ color: 0xff0000 })
);
scene.add(curve);

const pointsArr = createCurvePoints(50, 0, Math.PI * 2, 50);
const vec3Arr = [];
for (let i = 0; i < pointsArr.length; i += 3) {
  vec3Arr.push(
    new THREE.Vector3(pointsArr[i], pointsArr[i + 1], pointsArr[i + 2])
  );
}

// .setFromPoints()是几何体BufferGeometry的一个方法，可以把Vector数组中坐标数据提取出来赋值给几何体
const curve2 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(vec3Arr),
  new THREE.LineBasicMaterial({ color: 0x0000ff })
);
scene.add(curve2);
//#endregion

//#region 使用THREE.EllipseCurve()生成圆弧
// 参数1和2表示椭圆中心坐标  参数3和4表示x和y方向半径
const arc = new THREE.EllipseCurve(0, 0, 100, 50);
// 通过.getPoints()可以从曲线上获取顶点数据, 该方法会考虑曲线斜率变化，斜率变化快的位置返回的顶点更密集
// const arcPoints = arc.getPoints(40);

// 通过.getSpacedPoints()是按照曲线长度等间距返回顶点数据
const arcPoints = arc.getSpacedPoints(40);
console.log(arcPoints);

const curve3 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(arcPoints),
  new THREE.LineBasicMaterial({ color: 0x00ff00 })
);
const curvePoints = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(arcPoints),
  new THREE.PointsMaterial({ color: 0xff00ff, size: 2 })
);
scene.add(curve3);
scene.add(curvePoints);

//绘制圆弧
const arc2 = new THREE.EllipseCurve(0, 0, 25, 25, 0, Math.PI, true);
const curve4 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(arc2.getPoints(20)),
  curve3.material.clone()
);
scene.add(curve4);
//#endregion

//#region 样条曲线
const pts = [
  new THREE.Vector3(-25, 1, 0),
  new THREE.Vector3(-12, 25, 0),
  new THREE.Vector3(0, 8, 0),
  new THREE.Vector3(12, 25, 0),
  new THREE.Vector3(25, 1, 0),
];
const crCurve = new THREE.CatmullRomCurve3(pts);

const curve5 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(crCurve.getPoints(60)),
  curve3.material.clone()
);
scene.add(curve5);
const point = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(pts),
  new THREE.PointsMaterial({ color: 0x0000ff, size: 2 })
);
scene.add(point);
//#endregion

//#region 贝塞尔曲线
// 三维二次贝塞尔曲线
const bezierPts = [
  new THREE.Vector3(120, 0, 0),
  new THREE.Vector3(150, 20, 0),
  new THREE.Vector3(200, 0, 0),
];

const quadraticBezier = new THREE.QuadraticBezierCurve3(...bezierPts);
const curve6 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(quadraticBezier.getPoints(60)),
  curve3.material.clone()
);
scene.add(curve6);
const point2 = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(bezierPts),
  new THREE.PointsMaterial({ color: 0x0000ff, size: 2 })
);
scene.add(point2);

// 三维三次贝塞尔曲线
const bezierPts2 = [
  new THREE.Vector3(120, 0, 0),
  new THREE.Vector3(125, -70, 0),
  new THREE.Vector3(190, -55, 0),
  new THREE.Vector3(200, 0, 0),
];

const quadraticBezier2 = new THREE.CubicBezierCurve3(...bezierPts2);
const curve7 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(quadraticBezier2.getPoints(60)),
  curve3.material.clone()
);
scene.add(curve7);
const point3 = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(bezierPts2),
  new THREE.PointsMaterial({ color: 0x0000ff, size: 2 })
);
scene.add(point3);

const line = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([...bezierPts, ...bezierPts2]),
  new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 })
);
scene.add(line);
//#endregion

//#region 组合曲线CurvePath
// 通过threejs组合曲线CurvePath对象，可以把直线、圆弧、贝塞尔等线条拼接为一条曲线
// 直线1
const line1 = new THREE.LineCurve(
  new THREE.Vector2(-110, 80),
  new THREE.Vector2(-110, 0)
);
// 圆弧
const arc3 = new THREE.EllipseCurve(-155, 0, 45, 45, 0, Math.PI, true);
// 直线2
const line2 = new THREE.LineCurve(
  new THREE.Vector2(-200, 0),
  new THREE.Vector2(-200, 80)
);

// CurvePath创建一个组合曲线对象
const curvePath = new THREE.CurvePath();
//line1, arc3, line2拼接出来一个U型轮廓曲线，注意顺序
curvePath.curves.push(line1, arc3, line2);

// 组合曲线CurvePath和它的父类Curve一样具有.getPoints()和.getSpacedPoints()取点方法
const points4 = curvePath.getPoints(10);
// const points4 = curvePath.getSpacedPoints(20);
console.log(points4);
const curve8 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(points4),
  curve3.material.clone()
);
scene.add(curve8);

const curvePts = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(points4),
  new THREE.PointsMaterial({ color: 0x0000ff, size: 2 })
);
scene.add(curvePts);
//#endregion

//#region 曲线路径管道
// 管道TubeGeometry几何体的功能就是基于一个3D曲线路径，生成一个管道几何体
// 三维样条曲线
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-50, 20, 90),
  new THREE.Vector3(-10, 10, 80),
  new THREE.Vector3(0, 0, 100),
  new THREE.Vector3(60, -20, 70),
  new THREE.Vector3(70, 0, 80),
]);

// path:路径   40：沿着轨迹细分数  4：管道半径   25：管道截面圆细分数
const tubeGeom = new THREE.TubeGeometry(path, 40, 4, 25);

const tubeMesh = new THREE.Mesh(
  tubeGeom,
  new THREE.MeshStandardMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    roughness: 0.4,
    metalness: 0.6,
  })
);
scene.add(tubeMesh);

// 使用CurvePath对象生成管道
const p1 = new THREE.Vector3(0, 0, 50);
const p2 = new THREE.Vector3(0, 0, 30);
const p3 = new THREE.Vector3(0, 0, 0);
const p4 = new THREE.Vector3(30, 0, 0);
const p5 = new THREE.Vector3(100, 0, 0);
// 1. 3D直线线段
const l1 = new THREE.LineCurve3(p1, p2);
// 2. 三维二次贝塞尔曲线
const c1 = new THREE.QuadraticBezierCurve3(p2, p3, p4);
// 3. 3D直线线段
const l2 = new THREE.LineCurve3(p4, p5);

const curvePath2 = new THREE.CurvePath();
// 三条线拼接为一条曲线
curvePath2.curves.push(l1, c1, l2);
const tubeGeom2 = new THREE.TubeGeometry(curvePath2, 50, 3, 25);

const tubeMesh2 = new THREE.Mesh(tubeGeom2, tubeMesh.material.clone());
scene.add(tubeMesh2);

//#endregion

//#region 旋转成型LatheGeometry
// 通过三个点定义一个二维样条曲线
const spline = new THREE.SplineCurve([
  new THREE.Vector2(5, 50),
  new THREE.Vector2(25, 10),
  new THREE.Vector2(10, -50),
]);
//曲线上获取点,作为旋转几何体的旋转轮廓
const points5 = spline.getPoints(50);
// LatheGeometry：pointsArr轮廓绕y轴旋转生成几何体曲面
const latheGeom = new THREE.LatheGeometry(points5, 30);
const latheMesh = new THREE.Mesh(latheGeom, tubeMesh.material.clone());
latheMesh.position.set(0, 0, 150);
scene.add(latheMesh);
//#endregion

//#region 多边形轮廓Shape
// 一组二维向量表示一个多边形轮廓坐标
const points6 = [
  new THREE.Vector2(-50, -50),
  new THREE.Vector2(-60, 0),
  new THREE.Vector2(0, 50),
  new THREE.Vector2(60, 0),
  new THREE.Vector2(50, -50),
];
// Shape表示一个平面多边形轮廓,参数是二维向量构成的数组pointsArr
const shape = new THREE.Shape(points6);

// 轮廓填充
const shapeGeom = new THREE.ShapeGeometry(shape);
const shapeMesh = new THREE.Mesh(
  shapeGeom,
  new THREE.MeshLambertMaterial({
    color: 0x55ffaa,
    // side: THREE.DoubleSide,
    wireframe: true,
  })
);
shapeMesh.position.set(270, 0, 0);
scene.add(shapeMesh);

// 轮廓拉伸
const extrudeGeom = new THREE.ExtrudeGeometry(shape, {
  depth: 20,
  bevelThickness: 5, //倒角尺寸:拉伸方向
  bevelSize: 5, //倒角尺寸:垂直拉伸方向
  bevelSegments: 6, //倒圆角：倒角细分精度，默认3
});
const extrudeMesh = new THREE.Mesh(
  extrudeGeom,
  new THREE.MeshLambertMaterial({
    color: 0xffaa55,
    // wireframe: true,
  })
);
extrudeMesh.position.set(270, 0, 50);
scene.add(extrudeMesh);

// 轮廓扫描
const shape2 = new THREE.Shape([
  new THREE.Vector2(0, 0),
  new THREE.Vector2(20, 0),
  new THREE.Vector2(20, 20),
  new THREE.Vector2(0, 20),
]);
// 扫描轨迹：创建轮廓的扫描轨迹(3D样条曲线)
const curve9 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 190),
  new THREE.Vector3(30, 0, 220),
  new THREE.Vector3(20, 0, 240),
  new THREE.Vector3(-20, 0, 235),
]);
// 通过ExtrudeGeometry除了可以实现拉伸成型，也可以让一个平面轮廓Shape沿着曲线扫描成型
const extrudeGeom2 = new THREE.ExtrudeGeometry(shape2, {
  extrudePath: curve9, //扫描轨迹
  steps: 60, //沿着路径细分精度，越大越光滑
});
const extrudeMesh2 = new THREE.Mesh(
  extrudeGeom2,
  new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    // wireframe: true,
  })
);
scene.add(extrudeMesh2);

// 多边形轮廓Shape不仅可以通过一组二维向量Vector2表示的xy点坐标创建
// 还可以使用Shape的一些2D绘图API表达多边形轮廓
// Shape的父类是Path,Path提供了直线、圆弧、贝塞尔、样条等绘制方法

const shape3 = new THREE.Shape();
shape3.moveTo(10, 10);
shape3.lineTo(50, 10);
shape3.lineTo(30, 40);
shape3.closePath();

const extrudeMesh3 = new THREE.Mesh(
  new THREE.ExtrudeGeometry(shape3, {
    depth: 20,
  }),
  new THREE.MeshLambertMaterial({
    color: 0x0000ff,
  })
);
extrudeMesh3.position.set(100, 0, 100);
scene.add(extrudeMesh3);

const shape4 = new THREE.Shape();
shape4.absarc(0, 0, 50, Math.PI / 2, Math.PI, false);
shape4.ellipse(50, 0, 50, 30, Math.PI, Math.PI * 2);
shape4.bezierCurveTo(40, 30, 20, 20, 0, 50);

const extrudeMesh4 = new THREE.Mesh(
  new THREE.ExtrudeGeometry(shape4, {
    depth: 20,
    curveSegments: 20, //贝塞尔曲线细分精度
  }),
  new THREE.MeshLambertMaterial({
    color: 0x0000ff,
  })
);
extrudeMesh4.position.set(150, 0, 170);
scene.add(extrudeMesh4);

// 多边形空洞
const hole = new THREE.Path();
hole.moveTo(15, 15);
hole.lineTo(-15, 15);
hole.lineTo(-15, -15);
hole.lineTo(15, -15);
hole.closePath();

const shape5 = new THREE.Shape();
shape5.arc(0, 0, 29, 0, Math.PI * 2);
// 空洞轮廓插入到holes属性中
shape5.holes.push(hole);

const extrudeMesh5 = new THREE.Mesh(
  new THREE.ExtrudeGeometry(shape5, {
    depth: 5,
    bevelEnabled: false,
    curveSegments: 50,
  }),
  new THREE.MeshLambertMaterial({
    color: 0x0000ff,
  })
);
extrudeMesh5.position.set(230, 0, 170);
scene.add(extrudeMesh5);
//#endregion

//#region 模型边界线EdgesGeometry
const box = new THREE.BoxGeometry(50, 50, 50);
const boxMesh = new THREE.Mesh(
  box,
  new THREE.MeshLambertMaterial({
    color: 0x004444,
    transparent: true,
    opacity: 0.5,
  })
);

// 长方体作为EdgesGeometry参数创建一个新的几何体
const edges = new THREE.EdgesGeometry(box);
const edgesMaterial = new THREE.LineBasicMaterial({
  color: 0x00ffff,
});
const lineSegments = new THREE.LineSegments(edges, edgesMaterial);
boxMesh.add(lineSegments);
scene.add(boxMesh);

// 为拉伸后的物体创建一个边界线
const edges2 = new THREE.EdgesGeometry(extrudeMesh5.geometry, 2);
const lineSegments2 = new THREE.LineSegments(
  edges2,
  lineSegments.material.clone()
);
extrudeMesh5.add(lineSegments2);
//#endregion

//#region 几何体顶点颜色数据
const geom = new THREE.BufferGeometry();
// prettier-ignore
geom.attributes.position = new THREE.BufferAttribute(
  new Float32Array([
    -230,0,0, //顶点1坐标
    -250,0,0, //顶点2坐标
    -230,25,0, //顶点3坐标
  ]),
  3
);
// 与几何体BufferGeometry顶点位置数据一一对应的顶点颜色数据.attributes.color
// prettier-ignore
const colors=new Float32Array([
  1,0,0, //顶点1颜色
  0,1,0, //顶点2颜色
  0,0,1, //顶点3颜色
]);
geom.attributes.color = new THREE.BufferAttribute(colors, 3);

// 点渲染模式
const material = new THREE.PointsMaterial({
  // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
  vertexColors: true, //默认false，设置为true表示使用顶点颜色渲染
  size: 5, //点对象像素尺寸
});
const points2 = new THREE.Points(geom, material); //点模型对象
scene.add(points2);

// 自定几何体顶点颜色数据，然后用线模型Line渲染，直线的颜色是渐变的
const line3 = new THREE.Line(
  geom,
  new THREE.LineBasicMaterial({
    vertexColors: true, //顶点颜色渲染
  })
);
scene.add(line3);

// 自定几何体顶点颜色数据，然后用网格模型Mesh渲染，和Line一样，也会产生颜色渐变效果
const mesh = new THREE.Mesh(
  geom,
  new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
);
mesh.translateX(-30);
scene.add(mesh);
//#endregion

//#region 曲线段的颜色渐变
const curve10 = new THREE.SplineCurve([
  new THREE.Vector2(0, 0),
  new THREE.Vector2(10, 10),
  new THREE.Vector2(8, 20),
  new THREE.Vector2(0, 15),
]);
const points7 = curve10.getPoints(20);
const colors2 = [];
for (let i = 0; i < points7.length; i++) {
  colors2.push(i / points7.length, 0, 1 - i / points7.length);
}
const geom2 = new THREE.BufferGeometry();
geom2.setFromPoints(points7);
geom2.attributes.color = new THREE.BufferAttribute(
  new Float32Array(colors2),
  3
);
const line4 = new THREE.Line(
  geom2,
  new THREE.LineBasicMaterial({
    vertexColors: true,
  })
);
line4.position.set(-300, 0, 0);
scene.add(line4);
//#endregion

//#region 颜色渐变插值Color对象
const color1 = new THREE.Color(0xff0000); //红色
const color2 = new THREE.Color(0x0000ff); //蓝色
const color3 = new THREE.Color();
// .lerpColors通过一个百分比参数percent，可以控制Color1和Color2两种颜色混合的百分比
// 颜色插值结果，和color=80% color1 + 20% color2混合
color3.lerpColors(color1, color2, 0.2); //颜色插值
console.log(color3.r, color3.g, color3.b);

// .lerp()和.lerpColors()功能一样，只是混合后的rgb值，赋值给color1.clone()对象的rgb属性
// 通过颜色对象克隆方法.clone()可以返回一个新的颜色对象
const color4 = color1.clone().lerp(color2, 0.2);
console.log(color4.r, color4.g, color4.b);

//上述曲线颜色渐变可以改写成如下方式
const curve11 = new THREE.SplineCurve([
  new THREE.Vector2(0, 0),
  new THREE.Vector2(-10, 10),
  new THREE.Vector2(-8, 20),
  new THREE.Vector2(0, 15),
]);
const points8 = curve11.getPoints(20);
const colors3 = [];
for (let i = 0; i < points7.length; i++) {
  const { r, g, b } = color1.clone().lerp(color2, i / points7.length);
  colors3.push(r, g, b);
}
const geom3 = new THREE.BufferGeometry();
geom3.setFromPoints(points8);
geom3.attributes.color = new THREE.BufferAttribute(
  new Float32Array(colors3),
  3
);
const line5 = new THREE.Line(
  geom3,
  new THREE.LineBasicMaterial({
    vertexColors: true,
  })
);
line5.position.set(-300, 0, 0);
scene.add(line5);

//#endregion

//#region 山脉地形高低可视化
const loader = new GLTFLoader();
loader.load("../data/地形.glb", function (gltf) {
  const mesh = gltf.scene.children[0];
  scene.add(mesh);
  console.log(mesh);

  const pos = mesh.geometry.attributes.position;
  console.log(pos);
  const count = pos.count;

  // 1. 计算模型y坐标高度差
  const yArr = []; //顶点所有y坐标，也就是地形高度
  for (let i = 0; i < count; i++) {
    yArr.push(pos.getY(i)); //获取顶点y坐标，也就是地形高度
  }
  yArr.sort(); //数组元素排序，从小到大
  const height = yArr[yArr.length - 1] - yArr[0]; //山脉整体高度
  console.log(height);

  // 2. 计算每个顶点的颜色值
  const colorsArr = [];
  const c1 = new THREE.Color(0x0000ff); //山谷颜色
  const c2 = new THREE.Color(0xff0000); //山顶颜色
  for (let i = 0; i < count; i++) {
    //当前高度和整体高度比值
    const percent = (pos.getY(i) - yArr[0]) / height;
    const c = c1.clone().lerp(c2, percent); //颜色插值计算
    colorsArr.push(c.r, c.g, c.b);
  }
  // 设置几何体attributes属性的颜色color属性
  mesh.geometry.attributes.color = new THREE.BufferAttribute(
    new Float32Array(colorsArr),
    3
  );

  // 3. 设置材质，使用顶点颜色渲染
  mesh.material = new THREE.MeshLambertMaterial({
    vertexColors: true,
  });
  mesh.position.set(-100, 0, 100);
});

//#endregion
