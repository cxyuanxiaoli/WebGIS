import { never, singleClick } from "ol/events/condition";
import { map } from "../1-loadMap/loadMap";
import { Draw, Modify, Select } from "ol/interaction";
import { Circle, Fill, Stroke, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { createBox } from "ol/interaction/Draw";
import { Point } from "ol/geom";

export default function modifyShape() {
  const selectElem = document.querySelector(
    "#select-type"
  ) as HTMLSelectElement;
  //获取选择类型
  let selectType = selectElem.value;
  //绘制交互
  let draw: Draw;
  //临时绘制层
  const drawLayer = new VectorLayer({
    source: new VectorSource(),
  });
  drawLayer.getSource()?.on("addfeature", () => {
    drawLayer.getSource()?.clear(); //绘制图形结束后清空绘制层
  });
  map.addLayer(drawLayer);

  //更新选择类型
  selectElem.onchange = () => {
    selectType = selectElem.value;
    map.removeInteraction(select);
    map.removeInteraction(draw);
    select = createSelect(selectType);
    map.addInteraction(draw);
    map.addInteraction(select);
  };
  (document.querySelector("#close-select") as HTMLButtonElement).onclick =
    () => {
      if (selectType === "singleclick-select") {
        selectElem.disabled = !selectElem.disabled;
        select.setActive(!select.getActive());
      } else {
        select.setActive(!select.getActive());
        draw.setActive(!draw.getActive());
        selectElem.disabled = !selectElem.disabled;
      }
    };

  //选择交互-根据选择类型创建
  let select: Select = createSelect(selectType);
  map.addInteraction(select);

  //修改交互
  const modify = new Modify({
    features: select.getFeatures(),
  });
  map.addInteraction(modify);
  modify.setActive(true);
  document.querySelector("#close-edit")?.addEventListener("click", () => {
    modify.setActive(!modify.getActive());
  });

  function createSelect(type: string) {
    const selectStyle = new Style({
      fill: new Fill({
        color: "rgba(94, 188, 255, 0.62)",
      }),
      stroke: new Stroke({
        color: "blue",
        width: 2,
      }),
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: "skyblue",
        }),
      }),
    });
    //选择交互
    let select: Select = new Select({
      condition: never,
      style: selectStyle,
    });
    if (type === "singleclick-select") {
      select = new Select({
        condition: singleClick,
        style: selectStyle,
        // layers: [],
        // filter: (feature, layer) => {
        //   // return layer instanceof VectorLayer;
        //   return feature.getGeometry() instanceof Point;
        // },
      });
      draw = new Draw({
        source: drawLayer.getSource() as VectorSource,
        type: "Point",
      });
      draw.setActive(false);
    } else if (type === "box-select") {
      draw = new Draw({
        source: drawLayer.getSource() as VectorSource,
        type: "Circle",
        geometryFunction: createBox(),
      });
      draw.setActive(true);
    } else if (type === "polygon-select") {
      draw = new Draw({
        source: drawLayer.getSource() as VectorSource,
        type: "Polygon",
      });
      draw.setActive(true);
    } else if (type === "circle-select") {
      draw = new Draw({
        source: drawLayer.getSource() as VectorSource,
        type: "Circle",
      });
      draw.setActive(true);
    }

    draw.on("drawstart", () => {
      select.getFeatures().clear();
    });
    draw.on("drawend", (e) => {
      //获取绘制图形范围
      const extent = e.feature.getGeometry()?.getExtent() as number[];
      //选取所有矢量图层中与绘制图形范围相交的要素放到选择交互的要素集合中
      map.getLayers().forEach((layer) => {
        if (layer instanceof VectorLayer) {
          (layer as VectorLayer)
            .getSource()
            ?.forEachFeatureIntersectingExtent(extent, (feature) => {
              select.getFeatures().push(feature);
            });
        }
      });
    });
    return select;
  }
}
