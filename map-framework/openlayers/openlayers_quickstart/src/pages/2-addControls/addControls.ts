import { map } from "../1-loadMap/loadMap";
import {
  ZoomSlider,
  ZoomToExtent,
  MousePosition,
  ScaleLine,
  OverviewMap,
  FullScreen,
} from "ol/control";
import customBaseControls from "./customBaseControls";
import customLayersListControl from "./customLayersListControl";
import { createStringXY } from "ol/coordinate";
import addCustomLayerExplore from "./customLayerExplore";
import addCustomAnimationControl from "./customAnimateControl";
import addCustomMeasureControl from "./customMeasureControl";
import VectorLayer from "ol/layer/Vector";
import Vector from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

export default function addControls() {
  const addControlsLis = document.querySelectorAll("#map-controls li");
  //添加导航控件
  const addZoomSlider = (event: Event) => {
    map.addControl(new ZoomSlider());
    map.addControl(
      new ZoomToExtent({
        extent: [8430000, 2550000, 15450000, 6500000],
      })
    );
    document
      .querySelector("#map .ol-zoom-out")
      ?.classList.add("ol-zoom-out-custom");
    event.target?.removeEventListener("click", addZoomSlider);
  };
  //添加自定义基础控件
  const addCustomBaseBtn = (event: Event) => {
    document.querySelector(".custom-btn")?.classList.remove("custom-hide");
    customBaseControls();
    event.target?.removeEventListener("click", addCustomBaseBtn);
  };
  //添加自定义图层列表控件
  const addLayerControl = (event: Event) => {
    document.querySelector(".layer-control")?.classList.remove("custom-hide");
    customLayersListControl();
    event.target?.removeEventListener("click", addLayerControl);
  };
  //添加鼠标位置控件
  const addMousePosition = (event: Event) => {
    map.addControl(
      new MousePosition({
        coordinateFormat: createStringXY(6),
        projection: "EPSG:4326",
        className: "custom-mouse-position",
      })
    );
    event.target?.removeEventListener("click", addMousePosition);
  };
  //添加比例尺控件
  const addScaleLine = (event: Event) => {
    map.addControl(
      new ScaleLine({
        //degrees 度, imperial 英制单位, us 美制单位, metric 公制单位, or nautical 海里
        units: "metric",
      })
    );
    event.target?.removeEventListener("click", addScaleLine);
  };
  //添加鹰眼控件
  const addOverviewMap = (event: Event) => {
    map.addControl(
      new OverviewMap({
        layers: [
          new VectorLayer({
            source: new Vector({
              url: "https://geojson.cn/api/china/100000.json",
              format: new GeoJSON(),
            }),
          }),
        ],
        collapsed: false,
        // collapsible: false,
        collapseLabel: "\u00BB",
        label: "\u00AB",
      })
    );
    event.target?.removeEventListener("click", addOverviewMap);
  };
  //添加全屏显示控件
  const addFullScreen = (event: Event) => {
    map.addControl(new FullScreen());
    event.target?.removeEventListener("click", addFullScreen);
  };
  //添加图层探测
  const addLayerExplorer = (event: Event) => {
    addCustomLayerExplore();
    event.target?.removeEventListener("click", addLayerExplorer);
  };
  //添加动画控件
  const addAnimationControl = (event: Event) => {
    addCustomAnimationControl();
    document.querySelector(".animate-control")?.classList.remove("custom-hide");
    event.target?.removeEventListener("click", addAnimationControl);
  };
  //添加测量控件
  const addMeasureControl = (event: Event) => {
    addCustomMeasureControl();
    document.querySelector(".measure-menu")?.classList.remove("custom-hide");
    event.target?.removeEventListener("click", addMeasureControl);
  };

  const methods = [
    addZoomSlider,
    addCustomBaseBtn,
    addLayerControl,
    addMousePosition,
    addScaleLine,
    addOverviewMap,
    addFullScreen,
    addLayerExplorer,
    addAnimationControl,
    addMeasureControl,
  ];

  //绑定事件
  for (let i = 0; i < methods.length; i++) {
    addControlsLis[i].addEventListener("click", methods[i]);
  }
}
