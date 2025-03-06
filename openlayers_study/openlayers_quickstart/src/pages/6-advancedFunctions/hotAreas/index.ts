import { Feature, Map, MapBrowserEvent, Overlay, View } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import { Draw, Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";

const map = new Map({
  target: "map",
  layers: [],
  view: new View({
    center: [116, 36],
    zoom: 5,
    projection: "EPSG:4326",
  }),
});
//数据层样式
const normalStyle = new Style({
  fill: new Fill({
    color: "rgba(7, 139, 255, 0.2)",
  }),
  stroke: new Stroke({
    color: "#aa33aa",
    width: 2,
  }),
});
//热区层样式
const flashStyle = new Style({
  fill: new Fill({
    color: "rgba(255, 25, 0, 0.5)",
  }),
  stroke: new Stroke({
    color: "#ff0000",
    width: 2,
  }),
});

//加载数据
const data = await (await fetch("./data.json")).json(); //从后端获取数据
const features = new GeoJSON().readFeatures(data);
//数据层
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [...features],
    // url: "https://geojson.cn/api/china/100000.json",
    // format: new GeoJSON(),
  }),
  style: normalStyle,
  opacity: 0.5,
});
map.addLayer(vectorLayer);
//热区层
const hotAreaLayer = new VectorLayer({
  source: new VectorSource({}),
  style: flashStyle,
  opacity: 1,
});
map.addLayer(hotAreaLayer);
hotAreaLayer.setVisible(false);

//创建popup弹窗
const popupDiv = document.createElement("div");
popupDiv.innerHTML = "";
popupDiv.className = "popup";
const popup = new Overlay({
  element: popupDiv,
  positioning: "bottom-center",
  stopEvent: false,
});
map.addOverlay(popup);

//前一个热区要素
let preFeature: Feature | null = null;
//当前热区要素是否和前一个热区要素相同
let flag: boolean = false;
//显示热区按钮点击事件
(document.querySelector("#showReg") as HTMLButtonElement).onclick = () => {
  //解绑绘制和删除热区事件
  map.removeInteraction(draw as Interaction);
  map.un("singleclick", singleClickHandler);
  map.un("pointermove", pointerMoveHandler);
  map.on("pointermove", pointerMoveHandler);
};

function pointerMoveHandler(event: MapBrowserEvent<any>) {
  const pixel = event.pixel; // map.getEventPixel(event.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTargetElement().style.cursor = hit ? "pointer" : "";
  //当前没有指向要素
  if (!hit) {
    preFeature = null;
    popup.setPosition(undefined);
    hotAreaLayer.setVisible(false);
    return;
  }
  //获取当前鼠标位置的要素
  const feature = map.forEachFeatureAtPixel(
    pixel,
    (feature) => feature
  ) as Feature;

  if (preFeature === feature) {
    flag = true;
  } else {
    flag = false;
    preFeature = feature;
  }
  //当前要素和前一个要素不同
  if (!flag) {
    hotAreaLayer.getSource()?.clear();
    hotAreaLayer.getSource()?.addFeature(feature);
    hotAreaLayer.setVisible(true);
    (popup.getElement() as HTMLElement).innerText = `${feature.get(
      "name"
    )}\n${feature.get("GDP_2015")}\n${feature.get("GDP_2016")}\n${feature.get(
      "GDP_2017"
    )}`;
  }
  popup.setPosition(event.coordinate);
}

//绘制交互
let draw: Draw | null;
let drawFeature: Feature | null = null;
//绘制热区按钮点击事件
(document.querySelector("#drawReg") as HTMLButtonElement).onclick = () => {
  map.getTargetElement().style.cursor = "";
  map.removeInteraction(draw as Interaction);
  map.un("pointermove", pointerMoveHandler);
  map.un("singleclick", singleClickHandler);
  popup.setPosition(undefined);
  hotAreaLayer.setVisible(false);
  draw = new Draw({
    source: vectorLayer.getSource() as VectorSource,
    type: "Polygon",
  });
  map.addInteraction(draw);
  draw.on("drawend", (e) => {
    map.removeInteraction(draw as Interaction);
    const confirm = document.querySelector("#dialog-confirm") as HTMLElement;
    confirm.classList.remove("hide");
    drawFeature = e.feature;
  });
};

const confirm = document.querySelector("#dialog-confirm") as HTMLElement;
document.querySelector("#add-confirm")?.addEventListener("click", () => {
  confirm.classList.add("hide");
  if (!drawFeature) {
    return;
  }
  // new GeoJSON().writeFeatures(vectorSource.getFeatures())  //发送给后端保存
  const info = {
    name: (document.querySelector("#name") as HTMLInputElement).value,
    id: (document.querySelector("#ID") as HTMLInputElement).value,
    GDP_2015: (document.querySelector("#gdp-2015") as HTMLInputElement).value,
    GDP_2016: (document.querySelector("#gdp-2016") as HTMLInputElement).value,
    GDP_2017: (document.querySelector("#gdp-2017") as HTMLInputElement).value,
  };
  drawFeature.set("name", info.name);
  drawFeature.set("ID", info.id);
  drawFeature.set("GDP_2015", info.GDP_2015);
  drawFeature.set("GDP_2016", info.GDP_2016);
  drawFeature.set("GDP_2017", info.GDP_2017);
  drawFeature = null;
});

document.querySelector("#add-cancel")?.addEventListener("click", () => {
  confirm.classList.add("hide");
  if (!drawFeature) {
    return;
  }
  vectorLayer.getSource()?.removeFeature(drawFeature);
  drawFeature = null;
});

//要删除的当前要素
let currentFeature: Feature | null = null;
(document.querySelector("#deleteReg") as HTMLButtonElement).onclick = () => {
  map.getTargetElement().style.cursor = "";
  map.removeInteraction(draw as Interaction);
  popup.setPosition(undefined);
  hotAreaLayer.setVisible(false);
  map.un("pointermove", pointerMoveHandler);
  map.un("singleclick", singleClickHandler);
  map.on("singleclick", singleClickHandler);
};

//单击事件
function singleClickHandler(event: MapBrowserEvent<any>) {
  const pixel = event.pixel; // map.getEventPixel(event.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  if (!hit) {
    return;
  }
  const feature = map.forEachFeatureAtPixel(
    pixel,
    (feature) => feature
  ) as Feature;
  hotAreaLayer.getSource()?.clear();
  hotAreaLayer.getSource()?.addFeature(feature);
  hotAreaLayer.setVisible(true);
  const deleteDialog = document.querySelector("#dialog-delete") as HTMLElement;
  deleteDialog.classList.remove("hide");
  currentFeature = feature;
}

const deleteDialog = document.querySelector("#dialog-delete") as HTMLElement;
document.querySelector("#delete-confirm")?.addEventListener("click", (evt) => {
  vectorLayer.getSource()?.removeFeature(currentFeature as Feature);
  currentFeature = null;
  deleteDialog.classList.add("hide");
  hotAreaLayer.setVisible(false);
});

document.querySelector("#delete-cancel")?.addEventListener("click", () => {
  deleteDialog.classList.add("hide");
  currentFeature = null;
  hotAreaLayer.setVisible(false);
});
