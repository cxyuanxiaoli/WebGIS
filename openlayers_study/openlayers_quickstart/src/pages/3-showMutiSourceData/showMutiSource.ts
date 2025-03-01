import { map } from "../1-loadMap/loadMap";
import GeoJSON from "ol/format/GeoJSON";
import KML from "ol/format/KML";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM, Vector } from "ol/source";
import { Fill, Stroke, Style } from "ol/style";

export default function showMutiSourceData() {
  //GeoJSON数据
  const chinaGeojson = new VectorLayer({
    source: new Vector({
      url: "https://geojson.cn/api/china/100000.json",
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: "red",
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(153, 153, 153, 0.52)",
      }),
    }),
    // style: (feature: any, resolution) => {
    //   return;
    // },
  });
  chinaGeojson.set("name", "中国地图-geojson");
  chinaGeojson.setVisible(false);

  //KML数据
  const huadongKml = new VectorLayer({
    source: new Vector({
      url: "../../../static/data/huadong.kml",
      format: new KML({
        extractStyles: true,
      }),
    }),
  });
  huadongKml.set("name", "华东地区-kml");
  huadongKml.setVisible(false);

  const osmLayer = new TileLayer({
    source: new OSM(),
  });
  osmLayer.set("name", "OSM");
  osmLayer.setVisible(false);

  //添加到地图
  map.addLayer(chinaGeojson);
  map.addLayer(huadongKml);
  // map.addLayer(osmLayer);

  document.querySelector("#export-png")?.addEventListener(
    "click",
    () => {
      console.log("as");
      map.once("postcompose", (evt) => {
        const canvas = evt.context?.canvas as HTMLCanvasElement;
        (document.querySelector("#export-png") as HTMLLinkElement).href =
          canvas?.toDataURL();
      });
      map.renderSync();
    },
    false
  );
}
