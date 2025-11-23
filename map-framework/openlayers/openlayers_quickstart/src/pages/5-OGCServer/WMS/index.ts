import { View } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import { Projection } from "ol/proj";
import { ImageWMS } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import Select from "ol/interaction/Select";

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

//WMS-GetCapabilities
fetch(
  "http://localhost:8070/geoserver/wms?service=wms&version=1.1.1&request=GetCapabilities"
).then(async (res) => {
  console.log(await res.text());
});

//WMS-GetMap
const url = "http://localhost:8070/geoserver/webgis-test/wms";
const wmsLayer = new ImageLayer({
  source: new ImageWMS({
    url,
    params: {
      service: "WMS",
      version: "1.1.0",
      request: "GetMap",
      layers: "webgis-test:山东省图层组",
      styles: "",
      format: "image/png",
      //以下参数根据view对象动态生成
      // srs: "EPSG:4490",
      // bbox: "114.80586593155356,34.37736573293456,122.70560688985348,38.40051200014238",
      // width: 790,
      // height: 450,
    },
  }),
});
map.addLayer(wmsLayer);

const vectorLayer = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    fill: new Fill({
      color: "rgba(0, 255, 85, 0.64)",
    }),
    stroke: new Stroke({
      color: "#000033",
      width: 2,
    }),
  }),
});
map.addLayer(vectorLayer);


const select = new Select({});
vectorLayer.getSource()!.removeFeatures(select.getFeatures().getArray());

map.on("singleclick", (evt) => {
  const pixel = evt.pixel.map((p) => Math.round(p));
  const extend = map.getView().calculateExtent();
  const mapSize = map.getSize() as [number, number];

  // WMS-GetFeatureInfo
  fetch(
    "http://localhost:8070/geoserver/webgis-test/wms?service=WMS&request=GetFeatureInfo&" +
      "info_format=application/json&query_layers=webgis-test:县级行政区划&feature_count=1&layers=webgis-test:山东省图层组" +
      "&styles=&srs=EPSG:4490&version=1.1.0" +
      `&bbox=${extend.join(",")}&width=${mapSize[0]}&height=${mapSize[1]}&x=${
        pixel[0]
      }&y=${pixel[1]}`
  ).then((res) => {
    res.json().then((data) => {
      const features = new GeoJSON().readFeatures(data);
      console.log(features);

      vectorLayer.getSource()!.clear();
      vectorLayer.getSource()!.addFeatures(features);
    });
  });
});
