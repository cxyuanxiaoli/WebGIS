import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";

export default function () {
  const map = new Map({
    view: new View({
      center: [116.2936979, 37.4501076],
      zoom: 5,
      projection: "EPSG:4326",
    }),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
        }),
      }),
    ],
  });
  return map;
}
