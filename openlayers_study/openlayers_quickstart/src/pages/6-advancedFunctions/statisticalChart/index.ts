import { Feature, Graticule, Map, Overlay, View } from "ol";
import { defaults, MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import KML from "ol/format/KML";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";
import * as echarts from "echarts";

const map = new Map({
  target: "map",
  layers: [],
  view: new View({
    center: fromLonLat([105.9579, 34.9235]),
    zoom: 5,
  }),
  controls: defaults().extend([
    new MousePosition({
      projection: "EPSG:4326",
      coordinateFormat: createStringXY(4),
    }),
  ]),
});

const layer = new VectorLayer({
  source: new VectorSource({
    url: "../../../../static/data/tj.kml",
    format: new KML({
      extractStyles: false,
    }),
  }),
  style: new Style({
    fill: new Fill({
      color: "#113EAD",
    }),
    stroke: new Stroke({
      color: "rgb(75, 117, 255)",
      width: 1,
    }),
  }),
});
map.addLayer(layer);

const highlightLayer = new VectorLayer({
  source: new VectorSource({}),
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.4)",
    }),
    stroke: new Stroke({
      color: "#fff",
      width: 1,
    }),
  }),
});
map.addLayer(highlightLayer);
//经纬网
map.addLayer(
  new Graticule({
    showLabels: true,
    strokeStyle: new Stroke({
      color: "#0c056d",
      width: 0.5,
    }),
    latLabelStyle: new Text({
      fill: new Fill({
        color: "#fff",
      }),
      offsetX: -15,
    }),
    lonLabelStyle: new Text({
      fill: new Fill({
        color: "#fff",
      }),
      offsetY: -5,
    }),
  })
);

//popup弹窗
const popupContainter = document.createElement("div");
popupContainter.className = "popup";
const chartContainer = document.createElement("div");
chartContainer.id = "chartContainer";
popupContainter.appendChild(chartContainer);
const popup = new Overlay({
  element: popupContainter,
  positioning: "bottom-center",
  stopEvent: false,
});
map.addOverlay(popup);

let preFeature: Feature | null = null;
let flag: boolean = false;
map.on("pointermove", (evt) => {
  const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f) as Feature;
  //如果当前为空
  //如果当前不为空，需要判断是否是同一个
  if (!feature) {
    preFeature = null;
    flag = false;
    highlightLayer.getSource()?.clear();
    popup.setPosition(undefined);
    return;
  } else {
    if (preFeature === feature) {
      flag = true;
    } else {
      flag = false;
      preFeature = feature;
    }
  }
  if (!flag) {
    const description = feature?.get("description");
    const gdpData = parserProperties(description);
    createChart(gdpData, feature.get("name"));
    highlightLayer.getSource()?.clear();
    highlightLayer.getSource()?.addFeature(feature);
  }
  popup.setPosition(evt.coordinate);
});

//解析properties，获取gdp数据
function parserProperties(description: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");

  const tdElems = doc.querySelectorAll("td");
  const gdpData: number[] = [];
  tdElems.forEach((td) => {
    if (!td.nextElementSibling?.textContent) {
      return;
    }
    let gdp = parseFloat(td.nextElementSibling.textContent);
    if (td.textContent === "GDP_1994") {
      gdpData.push(gdp);
      return;
    } else if (td.textContent === "GDP_1997") {
      gdpData.push(gdp);
      return;
    } else if (td.textContent === "GDP_1998") {
      gdpData.push(gdp);
      return;
    } else if (td.textContent === "GDP_1999") {
      gdpData.push(gdp);
      return;
    } else if (td.textContent === "GDP_2000") {
      gdpData.push(gdp);
      return;
    }
  });
  return gdpData;
}

//创建图表
const myChart = echarts.init(
  document.querySelector(`#chartContainer`) as HTMLElement
);
function createChart(data: number[], title: string) {
  const option: echarts.EChartOption = {
    xAxis: {
      type: "category",
      data: ["1994", "1997", "1998", "1999", "2000"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data,
        type: "line",
      },
    ],
    title: {
      text: title + " GDP",
      left: "center",
    },
  };
  myChart.setOption(option);
}
