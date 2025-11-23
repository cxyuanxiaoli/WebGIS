import {
  Map,
  View,
  createStringXY,
  GeoJSON,
  Geolocation,
} from "./MyOpenlayers.js";
import { TileLayer, VectorLayer } from "./MyOpenlayers.js";
import { XYZ, VectorSource } from "./MyOpenlayers.js";
import {
  FullScreen,
  MousePosition,
  OverviewMap,
  ScaleLine,
  ZoomSlider,
  ZoomToExtent,
  defaultControls,
} from "./MyOpenlayers.js";
import SymbolDesign from "./tool-design/SymbolDesign.js";

/**
 * @constant map1  地图对象
 */
const map1 = new Map({
  layers: [],
  controls: defaultControls().extend([
    new FullScreen(),
    new MousePosition({
      coordinateFormat: createStringXY(4),
    }),
    new OverviewMap({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "http://t2.dituhui.com/FileService/image?map=quanguo&type=web&x={x}&y={y}&z={z}",
          }),
        }),
      ],
      collapsed: false,
    }),
    new ScaleLine(),
    new ZoomSlider(),
    new ZoomToExtent(),
  ]),
});

/**
 * @function initMap  初始化地图view和layer对象
 * @returns {Map}  Map对象
 */
const initMap = () => {
  const view = new View({
    center: [108.95, 34.54],
    zoom: 5,
    projection: "EPSG:4326",
  });
  map1.setView(view);

  const TdtLayer = new TileLayer({
    source: new XYZ({
      url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
    }),
  });
  TdtLayer.set("name", "天地图影像");
  TdtLayer.setVisible(false);
  map1.addLayer(TdtLayer);

  const SupermapLayer = new TileLayer({
    source: new XYZ({
      url: "http://t2.dituhui.com/FileService/image?map=quanguo&type=web&x={x}&y={y}&z={z}",
    }),
  });
  SupermapLayer.set("name", "超图矢量图");
  map1.addLayer(SupermapLayer);

  const chinaVectorLayer = new VectorLayer({
    source: new VectorSource({
      url: "./data/china.json",
      format: new GeoJSON(),
    }),
    style: SymbolDesign.defaultSymbol,
  });
  chinaVectorLayer.set("name", "中国矢量图");
  map1.addLayer(chinaVectorLayer);

  map1.setTarget("map1");

  new Map({
    target: "map2",
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
        }),
      }),
    ],
    view: view,
    controls: [],
  });

  return map1;
};

/**
 * @function mapLook  Map视角切换
 * @param {'rotate' | 'bounce' | 'fly' | 'no-animate'} type  切换动画类型
 * @param {[number,number]} center  目标中心点
 */
const mapLook = (type, center) => {
  const view = map1.getView();
  //旋转定位
  if (type === "rotate") {
    view.animate(
      {
        rotation: Math.PI,
        easing: (t) => Math.pow(t, 2),
      },
      {
        center: center,
        rotation: 2 * Math.PI,
        easing: (t) => 1 - Math.pow(1 - t, 2),
      }
    );
  } else if (type === "bounce") {
    //弹性伸缩定位
    view.animate({
      center: center,
      duration: 2000,
      //控制的动画持续时间函数
      easing: (t) => {
        return (
          Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) +
          1
        );
      },
    });
  } else if (type === "fly") {
    //飞行定位
    const duration = 2000;
    const mapZoom = view.getZoom();
    //平移动画
    view.animate({
      center: center,
      duration: duration,
    });
    //缩放动画
    view.animate(
      {
        zoom: mapZoom - 2,
        duration: duration / 2,
      },
      {
        zoom: mapZoom,
        duration: duration / 2,
      }
    );
  } else if (type === "no-animate") {
    //无动画
    view.setCenter(center);
  }
};

/**
 * @constant geoLocation  地图定位对象
 */
const geoLocation = new Geolocation({
  projection: "EPSG:4326",
  //追踪参数
  trackingOptions: {
    maximumAge: 10000, // 允许使用10秒内的缓存位置
    enableHighAccuracy: true,
    timeout: 60000,
  },
});
//位置获取失败时处理
geoLocation.on("error", function (error) {
  console.log("Geolocation error occurred: ", error);
});
geoLocation.on("change:position", function () {
  const position = geoLocation.getPosition();
  map1.getView().setCenter(position);
  map1.getView().setZoom(16);
});

/**
 * @function mapLocate  地图定位开关
 * @param {boolean} bool  开启或关闭定位
 */
const mapLocate = (bool) => {
  geoLocation.setTracking(bool);
};

export default {
  initMap,
  mapLook,
  mapLocate,
};
