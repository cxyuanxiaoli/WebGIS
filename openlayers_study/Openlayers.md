# Openlayers

## 基本类

### ol/Map

OpenLayers 的核心组件是地图 ( ol/Map)。它被渲染到一个target容器。所有地图属性都可以在构建时进行配置，也可以使用 setter 方法进行配置.

Map实例有三个基本属性，即target(目标容器)、layers(图层)、view(视图)。

```js
import "ol/ol.css";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { useGeographic } from "ol/proj";
import XYZ from "ol/source/XYZ";

useGeographic();
const map = new Map({
  // target: "map",
  layers: [
    new TileLayer({
      source: new XYZ({
        url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=48fe9ac3d5008cd0d8ead2ad83eb14ad",
      }),
    }),
  ],
  view: new View({
    center: [116, 36],
    zoom: 8,
  }),
});
```

### ol/View

控制地图显示的中心位置、缩放等级、投影方式等。

```js
map.setView(new View({
  center: [0, 0],  //中心位置  
  zoom: 2     //缩放等级
}));
```

可用的缩放等级取决于maxZoom(默认为28)、zoomFactor(默认为2)和maxResolution(默认值的计算方式使投影的有效范围适合256x256像素的瓦片)

Starting at zoom level 0 with a resolution of maxResolution units per pixel, subsequent zoom levels are calculated by dividing the previous zoom level’s resolution by zoomFactor, until zoom level maxZoom is reached.

默认 是Web Mercator的 EPSG:3857 坐标系（伪墨卡托投影，也被称为球体墨卡托）。

### ol/Layer

图层。在openlayers中针对不同业务有着多种多样的图层类提供，而ol.layer相当于一个管理者，有效处理地图数据来源的多样性和复杂性问题。

## 常用控件

ol基于ol/control/Control基类封装了很多常用的地图功能控件，像地图导航、鹰眼、比例尺、鼠标位置等。通过map对象的controls参数设置或者调用addControl方法添加控件。地图控件基于html元素实现，每个控件都可作为一个DOM元素显示在屏幕中的某个位置，可通过css样式自定义控件样式。

ol通过ol/control/defaults默认加载了3个常用控件ol/control/Zoom、ol/control/Rotate、ol/control/Attribution

### 导航控件

* ol/control/Zoom   地图缩放控件
* ol/control/ZoomSlider   缩放滑块
* ol/control/ZoomToExtent    按钮式缩放到特定范围

