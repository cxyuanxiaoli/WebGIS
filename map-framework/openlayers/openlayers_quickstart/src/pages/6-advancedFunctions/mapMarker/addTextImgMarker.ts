import Map from "ol/Map";
import { Feature, Overlay } from "ol";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { FeatureLike } from "ol/Feature";

export default function addTextImgMarker(map: Map) {
  //获取marker类型选择元素
  const markerTypeSelect = document.querySelector(
    "#marker-type"
  ) as HTMLSelectElement;
  //获取marker类型,绑定事件保持最新值
  let markerType = markerTypeSelect.value;
  const updateMarkerType = () => {
    markerType = markerTypeSelect.value;
  };
  markerTypeSelect.addEventListener("change", updateMarkerType);

  //通过矢量图层创建标注
  const beijing = fromLonLat([116.46, 39.92]);
  const feature = new Feature({
    geometry: new Point(beijing),
    name: "Beijing",
  });
  //设置标注样式 - 点、文本样式
  feature.setStyle(styleFunction(feature));
  const source = new VectorSource({
    features: [feature],
  });
  const layer = new VectorLayer({
    source: source,
  });
  map.addLayer(layer);

  //通过添加覆盖层创建标注
  const wuhan = fromLonLat([114.27, 30.59]);
  const marker = new Overlay({
    position: wuhan,
    positioning: "center-center",
    element: document.createElement("div"),
    stopEvent: false,
  });
  //设置标注内容，添加样式类
  (marker.getElement() as HTMLElement).innerText = "Wuhan";
  (marker.getElement() as HTMLElement).classList.add("marker");
  map.addOverlay(marker);

  //监听鼠标点击以添加标注
  const markFun = (e: any) => {
    let str = prompt("请输入标注内容:");
    if (!str) {
      return;
    }
    if (markerType == "vector") {
      createVectorMarker(e.coordinate, source, str);
    } else {
      createOverlayLabel(e.coordinate, map, str);
    }
  };
  map.on("click", markFun);

  //绑定关闭标注函数
  document.querySelector("#close-marker")?.addEventListener("click", () => {
    markerTypeSelect.removeEventListener("change", updateMarkerType);
    map.removeLayer(layer);
    map.un("click", markFun);
    document.querySelector(".marker-menu")?.classList.add("custom-hide");
  });
}

//创建覆盖层标注
function createOverlayLabel(coord: Coordinate, map: Map, info: string) {
  const newMarker = document.createElement("div");
  newMarker.classList.add("marker");
  const marker = new Overlay({
    position: coord,
    stopEvent: false,
    element: newMarker,
  });
  newMarker.innerText = info;
  map.addOverlay(marker);
}

//创建矢量图层标注
function createVectorMarker(
  coord: Coordinate,
  layerSource: VectorSource,
  info: string
) {
  //创建一个要素
  const feature = new Feature({
    geometry: new Point(coord),
    name: info,
  });
  //设置要素样式
  feature.setStyle(styleFunction(feature));
  //添加要素到矢量源
  layerSource.addFeature(feature);
}

//要素样式函数
function styleFunction(feature: Feature) {
  return new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: "red",
      }),
    }),
    // image: new Icon({
    //  // anchor: [0.5, 60],
    //   anchorOrigin: "top-right",
    //   anchorXUnits: "fraction",
    //   anchorYUnits: "pixels",
    //   offsetOrigin: "top-right",
    //   opacity: 0.75,
    //   scale: 0.1,
    //   src: ".././../../../static/img/avatar.jpg",
    // }),
    text: new Text({
      textAlign: "center",
      textBaseline: "bottom",
      font: "normal 14px sans-serif",
      offsetY: -5,
      text: feature.get("name"),
      fill: new Fill({
        color: "#000",
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 2,
      }),
    }),
  });
}
