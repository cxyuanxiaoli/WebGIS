import { initScene } from "./common";
import * as THREE from "three";

const { scene, camera, renderer } = initScene();
document.body.appendChild(renderer.domElement);

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
