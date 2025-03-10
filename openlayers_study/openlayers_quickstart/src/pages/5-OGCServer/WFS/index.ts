import { View } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import { Projection } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";

const cgcs2000 = new Projection({
  code: "EPSG:4490",
  extent: [-180, -90, 180, 90],
  worldExtent: [-180, -90, 180, 90],
  units: "degrees",
});

const map = new Map({
  target: "map",
  layers: [],
  view: new View({
    center: [118.5, 36.5],
    zoom: 8,
    projection: cgcs2000,
  }),
});

//WFS-GetCapabilities
fetch(
  "http://localhost:8070/geoserver/wfs?service=wfs&version=1.1.1&request=GetCapabilities"
).then(async (res) => {
  console.log("GetCapabilities", await res.text());
});

//WFS-DescribeFeatureType
fetch(
  "http://localhost:8070/geoserver/wfs?service=wfs&version=2.0.0&request=DescribeFeatureType&typeNames=webgis-test:县级行政区划,webgis-test:高速&outputFormat=application/json"
).then(async (res) => {
  console.log("DescribeFeatureType", await res.json());
});

//WFS-GetFeature
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: () =>
      "http://localhost:8070/geoserver/wfs?service=WFS&" +
      "version=2.0.0&request=GetFeature&typename=webgis-test:旅游景点&" +
      "bbox=36,117,39,123&outputFormat=application/json&srsname=EPSG:4490",
    format: new GeoJSON(),
  }),
});
setTimeout(() => {
  console.log(vectorLayer.getSource()!.getFeatures());
}, 3000);

map.addLayer(vectorLayer);
