import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import { TileWMS, XYZ } from "ol/source";
import { transform, useGeographic } from "ol/proj";
import View from "ol/View";
import { ImageTile } from "ol";
import ImageLayer from "ol/layer/Image";
useGeographic();
var map = new Map({
  //地图容器div的id
  target: "map",
  //地图容器中加载的图层
  layers: [
    // new TileLayer({
    //   source: new TileWMS({
    //     url: "http://localhost:8070/geoserver/webgis-test/wms?service=WMS&version=1.1.0&request=GetMap&layers=webgis-test%3Astates&bbox=-124.73142200000001%2C24.955967%2C-66.969849%2C49.371735&width=768&height=330&srs=EPSG%3A4326&styles=&format=application/openlayers",
    //     params: {},
    //   }),
    // }),
    new TileLayer({
      source: new TileWMS({
        url: "http://localhost:8070/geoserver/webgis-test/wms?service=WMS&version=1.1.0&request=GetMap&layers=webgis-test%3Arodes&bbox=106.0%2C29.0%2C108.0%2C31.0&width=768&height=768&srs=CRS%3A84&styles=&format=application/openlayers",
        params: {},
      }),
    }),
  ],
  //加载瓦片图层数据

  //地图视图设置
  view: new View({
    //地图初始中心点
    center: [106.5495, 29.5697],
    //地图初始显示级别
    zoom: 10,
  }),
});
