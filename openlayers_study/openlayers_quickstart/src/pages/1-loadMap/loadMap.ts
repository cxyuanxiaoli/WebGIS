import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import MyLayers from "./loadLayers";

const map = new Map({
  target: "map",
  layers: [MyLayers.TdtImage, MyLayers.GaodeMap],
  view: new View({
    center: fromLonLat([116, 36]),
    zoom: 5,
    minZoom: 3,
  }),
});
// map.addLayer(MyLayers.TdtImage);
// map.addLayer(MyLayers.GaodeMap);
// map.addLayer(MyLayers.chinaGeojson);
// map.addLayer(MyLayers.huadongKml);

export { map };
