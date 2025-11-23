import { map } from "../1-loadMap/loadMap";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Point, LineString, Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Style, Text, Fill, Stroke, Circle } from "ol/style";

//自定义样式函数
export default function customStyle() {
  // 自定义文字样式
  const textStyle = new Text({
    textAlign: "center",
    textBaseline: "middle",
    rotation: 0,
    font: "normal 14px Arial",
    offsetX: 0,
    offsetY: -10,
    fill: new Fill({
      color: "black",
    }),
    text: "shape",
    stroke: new Stroke({
      color: "white",
      width: 3,
    }),
    // scale: 1,
  });

  //创建点线面图层，添加元素，定义初始样式
  const pointLayer = new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new Point(fromLonLat([116, 36])),
          name: "p1",
        }),
      ],
    }),
    style: new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: "red",
        }),
      }),
      text: textStyle,
    }),
  });
  pointLayer.set("name", "point-customstyle");

  const lineLayer = new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new LineString([
            fromLonLat([116, 36]),
            fromLonLat([117, 37]),
          ]),
          name: "p1",
        }),
      ],
    }),
    style: new Style({
      stroke: new Stroke({
        color: "blue",
        width: 2,
      }),
      text: textStyle,
    }),
  });
  lineLayer.set("name", "line-customstyle");
  const polygonLayer = new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new Polygon([
            [
              fromLonLat([115, 36]),
              fromLonLat([116, 37]),
              fromLonLat([117, 37]),
              fromLonLat([115, 39]),
            ],
          ]),
          name: "p1",
        }),
      ],
    }),
    style: new Style({
      stroke: new Stroke({
        color: "#00ff00",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(255,0,0, 0.3)",
      }),
      text: textStyle,
    }),
  });
  polygonLayer.set("name", "polygon-customstyle");

  // 添加图层到地图
  map.addLayer(pointLayer);
  map.addLayer(lineLayer);
  map.addLayer(polygonLayer);

  // 绑定样式修改事件
  document.querySelector("#apply-style")?.addEventListener("click", () => {
    pointLayer.setStyle(getCustomPointStyle());
    lineLayer.setStyle(getCustomLineStyle());
    polygonLayer.setStyle(getCustomPolygonStyle());
  });
}

function getCustomPointStyle() {
  const pointSize = +(document.querySelector("#point-size") as HTMLInputElement)
    .value;
  const pointColor = (
    document.querySelector("#point-color") as HTMLInputElement
  ).value;

  return new Style({
    image: new Circle({
      radius: pointSize,
      fill: new Fill({
        color: pointColor,
      }),
    }),
    text: getCustomTextStyle(),
  });
}

function getCustomLineStyle() {
  const strokeColor = (
    document.querySelector("#stroke-color") as HTMLInputElement
  ).value;
  const strokeWidth = +(
    document.querySelector("#stroke-width") as HTMLInputElement
  ).value;

  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
    text: getCustomTextStyle(),
  });
}
function getCustomPolygonStyle() {
  const fillColor = (document.querySelector("#fill-color") as HTMLInputElement)
    .value;
  const fillOpacity =
    +(document.querySelector("#fill-opacity") as HTMLInputElement).value / 10;
  const strokeColor = (
    document.querySelector("#fill-stroke-color") as HTMLInputElement
  ).value;
  const strokeWidth = +(
    document.querySelector("#fill-stroke-width") as HTMLInputElement
  ).value;

  return new Style({
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
    text: getCustomTextStyle(),
  });
}

function getCustomTextStyle() {
  const position = (
    document.querySelector("#text-position") as HTMLInputElement
  ).value as CanvasTextAlign;
  const baseline = (
    document.querySelector("#text-baseline") as HTMLInputElement
  ).value as CanvasTextBaseline;
  const rotation = +(document.querySelector("#text-rotate") as HTMLInputElement)
    .value;
  const fontweight = (
    document.querySelector("#text-fontweight") as HTMLInputElement
  ).value;
  const fontsize = +(
    document.querySelector("#text-fontsize") as HTMLInputElement
  ).value;
  const fontstyle = (
    document.querySelector("#text-fontstyle") as HTMLInputElement
  ).value;
  const offsetx = +(document.querySelector("#text-offsetx") as HTMLInputElement)
    .value;
  const offsety = +(document.querySelector("#text-offsety") as HTMLInputElement)
    .value;
  const fontcolor = (document.querySelector("#text-color") as HTMLInputElement)
    .value;
  const strokecolor = (
    document.querySelector("#text-stroke-color") as HTMLInputElement
  ).value;
  const strokewidth = +(
    document.querySelector("#text-stroke-width") as HTMLInputElement
  ).value;
  const text = (document.querySelector("#text-content") as HTMLInputElement)
    .value;

  return new Text({
    textAlign: position,
    textBaseline: baseline,
    rotation: rotation,
    font: `${fontweight} ${fontsize}px ${fontstyle}`,
    offsetX: offsetx,
    offsetY: offsety,
    fill: new Fill({
      color: fontcolor,
    }),
    stroke: new Stroke({
      color: strokecolor,
      width: strokewidth,
    }),
    text: text,
  });
}
