import { map } from "../1-loadMap/loadMap";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import { LineString, Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import { getLength, getArea } from "ol/sphere";
import { Overlay } from "ol";

export default function customMeasureControl() {
  const source = new VectorSource();
  const layer = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: "rgba(117, 117, 117, 0.2)",
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
      }),
    }),
  });
  layer.set("name", "测量图层");
  map.addLayer(layer);

  const geodesicCheckbox = document.querySelector(
    "#geodesic"
  ) as HTMLInputElement;
  const typeSelect = document.querySelector(
    "#measure-type"
  ) as HTMLSelectElement;
  const closeMeasure = document.querySelector(
    "#close-measure"
  ) as HTMLButtonElement;
  //测量类型
  let measureType = typeSelect.value;
  //是否使用地理测量
  let isUseGeodesic = geodesicCheckbox.checked;

  let draw: Draw = updateDraw(measureType, isUseGeodesic, source);
  map.addInteraction(draw);

  //测量切换事件
  typeSelect.onchange = (e) => {
    measureType = typeSelect.value;
    map.removeInteraction(draw);
    draw = updateDraw(measureType, isUseGeodesic, source);
    map.addInteraction(draw);
  };
  geodesicCheckbox.onchange = (e) => {
    isUseGeodesic = geodesicCheckbox.checked;
    map.removeInteraction(draw);
    draw = updateDraw(measureType, isUseGeodesic, source);
    map.addInteraction(draw);
  };
  closeMeasure.onclick = () => {
    draw.setActive(!draw.getActive());
  };
}

function updateDraw(
  type: string,
  useGeodesic: boolean,
  drawSource: VectorSource
): Draw {
  let draw: Draw;
  if (type === "length") {
    draw = new Draw({
      source: drawSource,
      type: "LineString",
    });
    draw.on("drawend", (evt: DrawEvent) => {
      const line = evt.feature.getGeometry() as LineString;
      const lastCoord = line.getLastCoordinate();
      const length = (useGeodesic ? getLength(line) : line.getLength()) / 1000;
      createMarker(lastCoord, `${length.toFixed(2)} 千米`);
    });
  } else {
    draw = new Draw({
      source: drawSource,
      type: "Polygon",
    });
    draw.on("drawend", (evt: DrawEvent) => {
      const polygon = evt.feature.getGeometry() as Polygon;
      const centerCoord = polygon.getInteriorPoint().getCoordinates();
      const area =
        (useGeodesic ? getArea(polygon) : polygon.getArea()) / 1000000;
      createMarker(centerCoord, `${area.toFixed(2)} 平方千米`);
    });
  }
  return draw;
}

function createMarker(coord: Coordinate, info: string) {
  const container = document.createElement("div");
  container.className = "measure-popup";
  container.innerText = info;
  const marker = new Overlay({
    element: container,
    offset: [0, -25],
    position: coord,
    positioning: "center-center",
    stopEvent: false,
  });
  map.addOverlay(marker);
}
