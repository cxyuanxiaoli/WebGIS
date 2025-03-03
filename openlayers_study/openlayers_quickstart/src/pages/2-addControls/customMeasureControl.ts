// import VectorLayer from "ol/layer/Vector";
// import { map } from "../1-loadMap/loadMap";
// import VectorSource from "ol/source/Vector";
// import { Circle, Fill, Stroke, Style } from "ol/style";
// import { Draw } from "ol/interaction";
// import { DrawEvent } from "ol/interaction/Draw";
// import { LineString, Polygon } from "ol/geom";
// import { Coordinate } from "ol/coordinate";
// import { getLength, getArea } from "ol/sphere";
// import { Feature } from "ol";

// export default function customMeasureControl() {
//   const source = new VectorSource();
//   const layer = new VectorLayer({
//     source: source,
//     style: new Style({
//       fill: new Fill({
//         color: "rgba(255, 255,255,0.2)",
//       }),
//       stroke: new Stroke({
//         color: "#ffcc33",
//         width: 2,
//       }),
//       image: new Circle({
//         radius: 7,
//         fill: new Fill({
//           color: "#ffcc33",
//         }),
//       }),
//     }),
//   });
//   layer.set("name", "测量图层");
//   map.addLayer(layer);

//   const geodesicCheckbox = document.querySelector(
//     "#geodesic"
//   ) as HTMLInputElement;
//   const typeSelect = document.querySelector(
//     "#measure-type"
//   ) as HTMLSelectElement;

//   //绘图控件
//   let draw: Draw;
//   //绘制的要素
//   let sketch: Feature;

//   typeSelect.onchange = (e) => {
//     map.removeInteraction(draw);
//     addInteraction();
//   };
//   addInteraction();

//   function addInteraction() {
//     const type = typeSelect.value === "area" ? "Polygon" : "LineString";

//     draw = new Draw({
//       source: source,
//       type: type,
//     });

//     map.addInteraction(draw);

//     let listener: any;
//     let coordinate;
//     draw.on("drawstart", (e: DrawEvent) => {
//       sketch = e.feature;

//       // 创建测量提示元素
//       createMeasureTooltip();
//       createHelpTooltip();

//       // 监听指针移动事件
//       listener = map.on("pointermove", (evt) => {
//         coordinate = evt.pixel;
//         updateHelpTooltip(evt.coordinate); // 更新帮助提示位置
//       });
//     });

//     // 添加以下工具提示相关变量
//     let measureTooltip: HTMLElement;
//     let helpTooltip: HTMLElement;

//     // 创建帮助提示（坐标显示）
//     function createHelpTooltip() {
//       helpTooltip = document.createElement("div");
//       helpTooltip.className = "ol-tooltip";
//       map.getTargetElement().appendChild(helpTooltip);
//     }

//     // 创建测量结果提示
//     function createMeasureTooltip() {
//       measureTooltip = document.createElement("div");
//       measureTooltip.className = "ol-tooltip ol-tooltip-measure";
//       map.getTargetElement().appendChild(measureTooltip);
//     }

//     // 更新帮助提示内容
//     function updateHelpTooltip(coord: Coordinate) {
//       helpTooltip.innerHTML = `坐标：<br/>${coord[0].toFixed(
//         2
//       )}, ${coord[1].toFixed(2)}`;
//       helpTooltip.style.left = coordinate[0] + "px";
//       helpTooltip.style.top = coordinate[1] + "100px";
//     }
//     // 更新帮助提示内容
//     function updateMeasureTooltip(coord: Coordinate) {
//       measureTooltip.style.left = coordinate[0] + "px";
//       measureTooltip.style.top = coordinate[1] + "px";
//     }

//     // 在addInteraction函数中添加drawend事件监听
//     draw.on("drawend", () => {
//       console.log("123");

//       // 最终计算结果
//       const geometry = sketch.getGeometry();
//       if (geometry instanceof Polygon) {
//         const area = geodesicCheckbox.checked
//           ? getArea(geometry)
//           : geometry.getArea();
//         measureTooltip.innerHTML = formatArea(area);
//       } else if (geometry instanceof LineString) {
//         const length = geodesicCheckbox.checked
//           ? getLength(geometry)
//           : geometry.getLength();
//         measureTooltip.innerHTML = formatLength(length);
//       }
//       updateMeasureTooltip(coordinate);

//       // 清理监听器
//       map.un("pointermove", listener);
//       sketch = null;
//     });
//   }
// }

// // 格式化显示函数
// function formatLength(length: number): string {
//   return length > 1000
//     ? `${(length / 1000).toFixed(2)} 公里`
//     : `${length.toFixed(2)} 米`;
// }

// function formatArea(area: number): string {
//   return area > 10000
//     ? `${(area / 1000000).toFixed(2)} 平方公里`
//     : `${area.toFixed(2)} 平方米`;
// }
