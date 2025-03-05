import { Graticule, Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat, Projection } from "ol/proj";
import { Vector, XYZ } from "ol/source";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";

const map1 = new Map({
  target: "map1",
  layers: [
    new TileLayer({
      source: new XYZ({
        url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      }),
    }),
    new VectorLayer({
      source: new Vector({
        url: "https://geojson.cn/api/china/100000.json",
        format: new GeoJSON(),
      }),
    }),
  ],
  view: new View({
    center: fromLonLat([116.397428, 39.90816]),
    zoom: 5,
    projection: "EPSG:3857",
  }),
});

// 定义球形摩尔魏特投影坐标系，对应ESRI编号为 53009
proj4.defs(
  "ESRI:53009",
  "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs"
);
//注册到OpenLayers
register(proj4);
//定义球形摩尔魏特投影坐标系
const sphereMollweideProj = new Projection({
  code: "ESRI:53009",
  extent: [
    -9009954.605703328, -9009954.605703328, 9009954.605703328,
    9009954.605703328,
  ],
  worldExtent: [-179, -90, 179, 90],
});

let transformMap: Map;
document.querySelector("#btn")?.addEventListener("click", () => {
  if (!transformMap) {
    transformMap = new Map({
      target: "map2",
      layers: [
        new VectorLayer({
          source: new Vector({
            url: "https://geojson.cn/api/china/100000.json",
            format: new GeoJSON(),
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([116.397428, 39.90816]),
        projection: sphereMollweideProj,
        zoom: 3,
      }),
    });
    const graticule = new Graticule({
      showLabels: true,
    });
    transformMap.addLayer(graticule);
  }
});
