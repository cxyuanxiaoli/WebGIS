import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { TileDebug, Vector, XYZ } from "ol/source";

export default function () {
  const map = new Map({
    view: new View({
      center: [117, 36],
      zoom: 6,
      projection: "EPSG:4326",
    }),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        }),
      }),
      new TileLayer({
        source: new TileDebug(),
      }),
      new VectorLayer({
        source: new Vector({
          features: [new Feature(new Point([117, 36]))],
        }),
        style: {
          "circle-radius": 10,
          "circle-fill-color": "blue",
        },
      }),
    ],
  });
  return map;
}
