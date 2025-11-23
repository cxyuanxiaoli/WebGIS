import { Feature, Geolocation, Map, Overlay, View } from "ol";
import { Coordinate } from "ol/coordinate";
import { LineString, Point, Polygon } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { defaults, FullScreen, MousePosition } from "ol/control";

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new XYZ({
        url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      }),
    }),
  ],
  view: new View({
    center: [116.397428, 39.90923],
    projection: "EPSG:4326",
    zoom: 7,
  }),
  controls: defaults().extend([new FullScreen(), new MousePosition()]),
});

//创建定位导航对象
const geoLocation = new Geolocation({
  projection: map.getView().getProjection(),
  //追踪参数
  trackingOptions: {
    maximumAge: 10000, // 允许使用10秒内的缓存位置
    enableHighAccuracy: true,
    timeout: 600000,
  },
});

//位置变化时更新信息
geoLocation.on("change", () => {
  const accuracy = document.querySelector("#accuracy") as HTMLElement;
  const altitude = document.querySelector("#altitude") as HTMLElement;
  const altitudeAccuracy = document.querySelector(
    "#altitudeAccuracy"
  ) as HTMLElement;
  const heading = document.querySelector("#heading") as HTMLElement;
  const speed = document.querySelector("#speed") as HTMLElement;
  accuracy.textContent = geoLocation.getAccuracy() + "m";
  altitude.textContent = geoLocation.getAltitude() + "m";
  altitudeAccuracy.textContent = geoLocation.getAltitudeAccuracy() + "m";
  heading.textContent = geoLocation.getHeading() + "°";
  speed.textContent = geoLocation.getSpeed() + "m/s";
});

//位置获取失败时处理
geoLocation.on("error", function (error) {
  console.log("Geolocation error occurred: ", error);
});

//创建要素显示位置信息
let accuracyFeature: Feature<Polygon> = new Feature();
let positionFeature: Feature<Point> = new Feature();

geoLocation.on("change:accuracyGeometry", () => {
  accuracyFeature.setGeometry(geoLocation.getAccuracyGeometry() as Polygon);
});

geoLocation.on("change:position", function () {
  const position = geoLocation.getPosition() as Coordinate;
  positionFeature.setGeometry(position ? new Point(position) : undefined);
  flyLocation(position);
});

function flyLocation(position: Coordinate) {
  map.getView().animate({
    center: position,
    duration: 2000,
  });
  map.getView().animate(
    {
      zoom: (map.getView().getZoom() as number) - 2,
      duration: 1000,
    },
    {
      zoom: map.getView().getZoom() as number,
      duration: 1000,
    }
  );
}

const layer = new VectorLayer({
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
  style: new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: "red",
      }),
    }),
    fill: new Fill({
      color: "rgba(0,0,0, 0.2)",
    }),
    stroke: new Stroke({
      color: "red",
    }),
  }),
});

const trackInput = document.querySelector("#track") as HTMLInputElement;
trackInput.onchange = () => {
  geoLocation.setTracking(trackInput.checked);
  if (trackInput.checked) {
    map.addLayer(layer);
  } else {
    map.removeLayer(layer);
  }
};

//模拟运动轨迹
const sportLine = new Feature({
  geometry: new LineString([], "XYZ"),
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [sportLine],
  }),
  style: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: "blue",
      }),
    }),
  }),
});
map.addLayer(vectorLayer);
//创建标注
const markerContainer = document.createElement("div");
markerContainer.className = "marker-container";
markerContainer.innerText = "运动轨迹";
const sportMarker = new Overlay({
  element: markerContainer,
  stopEvent: false,
  positioning: "bottom-center",
  offset: [0, -5],
});
map.addOverlay(sportMarker);

//创建定位对象
const sportLocate = new Geolocation({
  projection: map.getView().getProjection(),
  trackingOptions: {
    maximumAge: 10000, // 允许使用10秒内的缓存位置
    enableHighAccuracy: true,
    timeout: 600000,
  },
});

//轨迹点数据接口
interface ISimulateData {
  coord: {
    lon: number;
    lat: number;
  };
  heading: number;
}
type SimulateDataArr = ISimulateData[];

const getSimulateData = async () => {
  return await (await fetch("../../../../static/data/simulate.json")).json();
};

//读取轨迹数据
let simulateData: SimulateDataArr;
getSimulateData().then((data) => {
  simulateData = data;
});

const simulateBtn = document.querySelector(
  "#simulate-btn"
) as HTMLButtonElement;

//模拟轨迹函数，按时添加轨迹点并更新定位信息
function addSportPoint() {
  const first = simulateData.shift() as ISimulateData;
  if (!first) {
    simulateBtn.disabled = false;
    return;
  }
  const { lon, lat } = first.coord;
  setTimeout(() => {
    map.render();
    addSportPoint();
  }, 1000);
  //添加轨迹点，绘制轨迹线
  sportLine.getGeometry()?.appendCoordinate([lon, lat, 0]);
  //更新定位信息
  sportLocate.set("position", [lon, lat]);
  sportLocate.changed();
}

//定位对象监听
sportLocate.on("change:position", function () {
  sportMarker.setPosition(sportLocate.getPosition() as Coordinate);
  map.getView().animate({
    center: sportLocate.getPosition() as Coordinate,
    duration: 500,
  });
});

//
simulateBtn.onclick = () => {
  addSportPoint();
  simulateBtn.disabled = true;
};
