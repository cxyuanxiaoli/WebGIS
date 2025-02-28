import Circle from "ol/style/Circle";
import VectorLayer from "ol/layer/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Draw, { createRegularPolygon, createBox } from "ol/interaction/Draw";
import { map } from "../1-loadMap/loadMap";
import VectorSource from "ol/source/Vector";

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

  //获取样式设置并应用样式
  document.querySelector("#apply-style")?.addEventListener("click", () => {
    const fillColor = (
      document.querySelector("#fill-color") as HTMLInputElement
    ).value;
    const fillOpacity =
      +(document.querySelector("#fill-opacity") as HTMLInputElement).value / 10;
    const strokeColor = (
      document.querySelector("#stroke-color") as HTMLInputElement
    ).value;
    const strokeWidth = +(
      document.querySelector("#stroke-width") as HTMLInputElement
    ).value;
    const pointSize = +(
      document.querySelector("#point-size") as HTMLInputElement
    ).value;
    const pointColor = (
      document.querySelector("#point-color") as HTMLInputElement
    ).value;

    const style = new Style({
      fill: new Fill({
        color: `rgba(${parseInt(fillColor.slice(1, 3), 16)}, 
                   ${parseInt(fillColor.slice(3, 5), 16)}, 
                   ${parseInt(fillColor.slice(5, 7), 16)}, 
                   ${fillOpacity})`,
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth,
      }),
      image: new Circle({
        radius: pointSize,
        fill: new Fill({
          color: pointColor,
        }),
      }),
    });
    vector.setStyle(style);
  });
}
