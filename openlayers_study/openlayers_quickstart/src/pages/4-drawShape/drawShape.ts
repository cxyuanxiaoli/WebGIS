import { map } from "../1-loadMap/loadMap";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill, Circle } from "ol/style";
import Draw, { createRegularPolygon, createBox } from "ol/interaction/Draw";
import customStyle from "./customStyle";
import modifyShape from "./modifyShape";

export default function drawShape() {
  //获取下拉列表元素
  const select = document.querySelector("#shape-type") as HTMLSelectElement;
  document
    .querySelectorAll("#draw-shapes li")[0]
    .addEventListener("click", () => {
      select.disabled = !select.disabled;
    });
  document
    .querySelectorAll("#draw-shapes li")[1]
    .addEventListener("click", () => {
      document.querySelector(".custom-style")?.classList.toggle("custom-hide");
    });

  drawCustomShape();
  customStyle();
  modifyShape();
}

//图形绘制函数
function drawCustomShape() {
  const select = document.querySelector("#shape-type") as HTMLSelectElement;

  let draw: Draw;
  let source: any;

  //创建矢量图层
  const vector = new VectorLayer({
    source: source,
    //设置样式
    style: new Style({
      //填充颜色，边框颜色，宽度，点的样式
      fill: new Fill({
        color: "rgba(117, 117, 117, 0.4)",
      }),
      stroke: new Stroke({
        color: "red",
        width: 2,
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: "red",
        }),
      }),
    }),
  });
  vector.set("name", "drawn-shape");
  map.addLayer(vector);
  //
  select.onchange = () => {
    map.removeInteraction(draw);
    addInteraction();
  };
  addInteraction();

  function addInteraction() {
    //获取下拉列表元素值
    let type = select.value as any;
    let geometryFunction = undefined;
    if (type === "None") {
      //清除绘制内容
      source = null;
      vector.setSource(source);
      return;
    } else {
      if (!source) {
        //source为空时创建矢量源
        source = new VectorSource();
        vector.setSource(source);
      }
      if (type === "Square") {
        type = "Circle";
        //创建一个用于 type: 'Circle' 的 GeometryFunction，
        //该函数将生成一个具有用户指定边数和起始角的正多边形，而不是圆形。
        geometryFunction = createRegularPolygon(4);
      } else if (type === "Box") {
        type = "Circle";
        //创建一个 GeometryFunction，用于生成一个与坐标系轴对齐的矩形多边形
        //将此函数与绘制交互和 type: 'Circle' 一起使用，以返回矩形而不是圆形
        geometryFunction = createBox();
      }
    }

    //创建绘制交互
    draw = new Draw({
      source: source, //绘制的要素的目标源
      type: type, //绘制的要素类型
      geometryFunction: geometryFunction, //当几何图形的坐标更新时调用的函数
    });
    map.addInteraction(draw);
  }
}
