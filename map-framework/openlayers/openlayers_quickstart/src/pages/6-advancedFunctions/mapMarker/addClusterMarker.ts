import { Feature, Map } from "ol";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { Cluster } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Style, Text } from "ol/style";

export default function addClusterMarker(map: Map) {
  //存放样式
  const styleCache: { [key: number]: Style } = {};
  //创建聚合图层
  const layer = new VectorLayer({
    source: new Cluster({
      distance: 40,
      source: new VectorSource({
        features: createRandomFeatures(2000),
      }),
    }),
    style: (feature) => {
      //获取聚合的数量
      const size = feature.get("features").length;
      let style = styleCache[size];
      if (!style) {
        style = new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: size < 20 ? "green" : size > 40 ? "red" : "blue",
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: "white",
            }),
          }),
        });
        styleCache[size] = style;
      }
      return style;
    },
  });
  map.addLayer(layer);
}

//创建随机点
function createRandomFeatures(number: number): Feature[] {
  const features: Feature[] = [];
  for (let i = 0; i < number; i++) {
    const feature = new Feature({
      geometry: new Point(
        fromLonLat([Math.random() * 55 + 75, Math.random() * 30 + 20])
      ),
      id: "point" + (i + 1),
    });
    features.push(feature);
  }
  return features;
}
