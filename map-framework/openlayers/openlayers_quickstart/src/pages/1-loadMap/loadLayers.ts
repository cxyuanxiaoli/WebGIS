import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

// 天地图影像图层
const TdtImage = new TileLayer({
  source: new XYZ({
    url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
  }),
});
TdtImage.set("name", "天地图影像图层");
TdtImage.setVisible(false);

// 高德地图图层
const GaodeMap = new TileLayer({
  source: new XYZ({
    url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  }),
});
GaodeMap.set("name", "高德地图图层");
GaodeMap.setOpacity(0.8);

export default { TdtImage, GaodeMap };
