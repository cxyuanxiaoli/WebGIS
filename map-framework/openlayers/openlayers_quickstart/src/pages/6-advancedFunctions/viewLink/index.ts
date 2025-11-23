import { Graticule, Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { Vector, XYZ } from "ol/source";

const map1 = new Map({
  target: "map1",
  layers: [
    new TileLayer({
      source: new XYZ({
        url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      }),
    }),
  ],
  view: new View({
    center: fromLonLat([116.397428, 39.90816]),
    zoom: 5,
    projection: "EPSG:3857",
  }),
});

const map2 = new Map({
  target: "map2",
  layers: [
    new VectorLayer({
      source: new Vector({
        url: "https://geojson.cn/api/china/100000.json",
        format: new GeoJSON(),
      }),
    }),
  ],
  view: map1.getView(),
});
map2.addLayer(new Graticule({ showLabels: true }));
