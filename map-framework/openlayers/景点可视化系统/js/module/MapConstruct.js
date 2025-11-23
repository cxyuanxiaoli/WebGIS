import {
  Map,
  View,
  Feature,
  Point,
  createStringXY,
  GeoJSON,
} from "./MyOpenlayers.js";
import {
  defaultControls,
  FullScreen,
  MousePosition,
  OverviewMap,
  ScaleLine,
  ZoomSlider,
  ZoomToExtent,
} from "./MyOpenlayers.js";
import { TileLayer, VectorLayer } from "./MyOpenlayers.js";
import { XYZ, VectorSource } from "./MyOpenlayers.js";
import { Style, Circle, Stroke, Fill, Text } from "./MyOpenlayers.js";
import Popup from "./Popup.js";
import { randomColor } from "../util/Color.js";

/**
 * @function init 初始化
 * @returns {Map}
 */
const init = () => {
  const map = initMap();
  addLayer(map);
  addPointAndPopup(map);
  return map;
};

/**
 * @function initMap 初始化地图
 * @returns {Map}
 */
const initMap = () => {
  const map = new Map({
    target: "map",
    view: new View({
      center: [118.75, 36.3],
      zoom: 8,
      projection: "EPSG:4326",
    }),
    layers: [],
    controls: defaultControls().extend([
      new FullScreen(),
      new MousePosition({
        coordinateFormat: createStringXY(4),
      }),
      new OverviewMap({
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
            }),
          }),
        ],
        collapsed: false,
      }),
      new ScaleLine(),
      new ZoomSlider(),
      new ZoomToExtent({
        extent: [114.7949, 34.0341, 122.7203, 38.5714],
      }),
    ]),
  });
  new Map({
    target: "right-map",
    view: map.getView(),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
        }),
      }),
    ],
    controls: [],
  });
  return map;
};

/**
 * @function addLayer 添加图层
 * @param {Map} map
 */
const addLayer = (map) => {
  const TdtTerrainLayer = new TileLayer({
    source: new XYZ({
      url: "http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
    }),
  });
  TdtTerrainLayer.set("name", "天地图地形");
  TdtTerrainLayer.setVisible(false);
  map.addLayer(TdtTerrainLayer);

  const TdtImageLayer = new TileLayer({
    source: new XYZ({
      url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
    }),
  });
  TdtImageLayer.set("name", "天地图影像");
  TdtImageLayer.setVisible(false);
  map.addLayer(TdtImageLayer);

  const TdtVectorLayer = new TileLayer({
    source: new XYZ({
      url: "http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
    }),
  });
  TdtVectorLayer.set("name", "天地图矢量");
  map.addLayer(TdtVectorLayer);

  const TdtVectorLabelLayer = new TileLayer({
    source: new XYZ({
      url: "http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
    }),
  });
  TdtVectorLabelLayer.set("name", "天地图矢量注记");
  TdtVectorLabelLayer.setVisible(false);
  map.addLayer(TdtVectorLabelLayer);

  const SdsVectorLayer = new VectorLayer({
    source: new VectorSource({
      url: "../data/山东省行政区划.json",
      format: new GeoJSON(),
    }),
    style: (f) =>
      new Style({
        stroke: new Stroke({
          color: "red",
          width: 2,
        }),
        text: new Text({
          textAlign: "center",
          textBaseline: "bottom",
          font: "normal 12px sans-serif",
          offsetY: -5,
          text: f.getProperties().fullname,
          stroke: new Stroke({
            color: "#fff",
            width: 1,
          }),
        }),
      }),
  });
  SdsVectorLayer.set("name", "山东省行政区划");
  map.addLayer(SdsVectorLayer);

  //景点 点图层 根据city属性设置不同的颜色
  const pointStyles = {};
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [],
    }),
    style: (f) => {
      const city = f.getProperties().properties.city;
      if (pointStyles[city]) return pointStyles[city];
      pointStyles[city] = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: randomColor("hex"),
          }),
        }),
      });
    },
  });
  vectorLayer.set("name", "景点");
  map.addLayer(vectorLayer);
};

/**
 * @function addPointAndPopup 添加点数据和信息弹窗
 * @param {*} map
 */
const addPointAndPopup = (map) => {
  const vectorLayer = map
    .getLayers()
    .getArray()
    .filter((layer) => layer.get("name") === "景点")[0];
  fetch("../data/4A景点.json")
    .then((res) => res.json())
    .then((res) => {
      res.forEach((item) => {
        const feature = new Feature({
          geometry: new Point([item["经度"], item["纬度"]]),
          properties: {
            id: item["序号"],
            name: item["景区名称"],
            city: item["所在地市"],
            region: item["所在区县"],
            level: item["等级"],
            photos: item["照片"],
            description: item["简介"],
          },
        });
        vectorLayer.getSource().addFeature(feature);
      });
    });

  Popup.setMap(map);

  map.on("singleclick", (e) => {
    Popup.hide();
    const flag = map.hasFeatureAtPixel(e.pixel);
    if (!flag) return;
    map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
      if (!layer === vectorLayer) return;
      const { name, city, region, level, photos, description } =
        feature.getProperties().properties;
      //填充信息弹窗并设置位置
      Popup.fillContent(
        name,
        {
          所在城市: city,
          所在区县: region,
          等级: level,
          简介: description,
        },
        photos[0]
      ).setPosition(feature.getGeometry().getCoordinates());
    });
  });
};

export default { init };
