import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import Heatmap from "ol/layer/Heatmap";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";

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
    center: [116, 39],
    zoom: 5,
    projection: "EPSG:4326",
  }),
});

const radius = document.querySelector("#radius") as HTMLInputElement;
const blur = document.querySelector("#blur") as HTMLInputElement;

const heatmap = new Heatmap({
  source: new VectorSource({
    features: createRandomFeatures(1000),
  }),
  radius: parseInt(radius.value, 10),
  blur: parseInt(blur.value, 10),
  weight: (feature: Feature) => {
    return feature.get("weight") as number;
  },
});
map.addLayer(heatmap);

radius.onchange = () => {
  heatmap.setRadius(parseInt(radius.value, 10));
};
blur.onchange = () => {
  heatmap.setBlur(parseInt(blur.value, 10));
};

//创建随机点
function createRandomFeatures(number: number): Feature[] {
  const features: Feature[] = [];
  for (let i = 0; i < number; i++) {
    const feature = new Feature({
      geometry: new Point([Math.random() * 55 + 75, Math.random() * 30 + 20]),
      weight: Math.random() * 80 + 2,
    });
    features.push(feature);
  }
  return features;
}
