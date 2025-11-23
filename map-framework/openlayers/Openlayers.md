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

​		ol基于ol/control/Control基类封装了很多常用的地图功能控件，像地图导航、鹰眼、比例尺、鼠标位置等。通过map对象的`controls`参数设置或者调用`addControl()`方法添加控件。地图控件基于html元素实现，每个控件都可作为一个DOM元素显示在屏幕中的某个位置，可通过css样式自定义控件样式。ol通过`ol/control/defaults`默认加载了3个常用控件`ol/control/Zoom`、`ol/control/Rotate`、`ol/control/Attribution`

import { ZoomSlider, ZoomToExtent, MousePosition, ScaleLine, OverviewMap, FullScreen} from "ol/control";

### 导航控件

* `ol/control/ZoomSlider` 
* `ol/control/ZoomToExtent`

```ts
map.addControl(new ZoomSlider());
map.addControl(
  new ZoomToExtent({
    extent: [8430000, 2550000, 15450000, 6500000],
  })
);
```

### 鼠标位置控件

* `ol/control/MousePosition`

```ts
map.addControl(
  new MousePosition({
    coordinateFormat: createStringXY(6),    //格式
    projection: "EPSG:4326",                //投影
    className: "custom-mouse-position",     //自定义类名，用于自定义样式
  })
);
```

### 比例尺控件

* `ol/control/ScaleLine`

```ts
map.addControl(
  new ScaleLine({
    //degrees 度, imperial 英制单位, us 美制单位, metric 公制单位, or nautical 海里
    units: "metric",          //单位
  })
);
```

### 鹰眼控件

* `ol/control/OverviewMap`

```ts
map.addControl(
  new OverviewMap({
    layers: [MyLayers.chinaGeojson],       //鹰眼显示图层
    collapsed: false,                      //默认是否折叠
    // collapsible: false,                 //是否可折叠
    collapseLabel: "\u00BB",               //折叠时显示的图标
    label: "\u00AB",                       //展开时显示的图标
  })
);
```

### 全屏显示控件

* `ol/control/FullScreen`

```ts
map.addControl(new FullScreen());
```

### 自定义控件-关键代码

* `view.getZoom()`
* `view.setZoom(zoom)`
* `view.getCenter()`
* `view.setCenter(center)`
* `view.getRotation()`
* `view.setRotation(rotate)`
* `view.animate(animations)`
* `layer.get(key)`
* `layer.set(key,value)`
* `layer.getVisible()`
* `layer.setVisible(visible)`
* `map.getTargetElement()`             获取map的target元素
* `map.getLayers()`                        获取map的所有图层
* `map.render() `                         重新渲染map
* `map.getEventPixel(event)`                 获取浏览器事件相对于视口的像素位置
* `layer.on("prerender", (event:RenderEvent)=>{})`              图层的预渲染事件
* `layer.on("postrender", (event:RenderEvent)=>{}) `            图层的渲染完成事件

#### 基础控件

```ts
const view = map.getView();
const currentZoom = view.getZoom() as number;
const center = fromLonLat([116, 36]);
//缩小
view.setZoom(currentZoom - 1);
//放大
view.setZoom(currentZoom + 1);
//平移
view.setCenter(center);
//重置
view.setCenter(fromLonLat([116, 36])); //重置中心点
view.setZoom(5); //重置缩放级别
view.setRotation(0); //重置旋转角度
```

#### 图层列表

```ts
//为每个图层设置name属性
TdtImage.set("name", "天地图影像图层");
//---------------------------------------------------
const layers = map.getLayers();
const layersListElem = document.querySelector(".layer-control ul");
for (let i = 0; i < layers.getLength(); i++) {
  //获取各图层的名称和可见性
  const layer = layers.item(i);
  const layerName = layer.get("name");
  const layerVisible = layer.getVisible();
  //创建li元素
  let li = document.createElement("li");
  let label = document.createElement("label");
  label.innerText = layerName;
  //创建checkbox元素，用于控制图层的可见性
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = layerVisible;
  checkbox.name = "layers";
  //将checkbox和label添加到li元素中，并添加到ul元素中
  layersListElem?.appendChild(li);
  li.appendChild(checkbox);
  li.appendChild(label);

  //为checkbox添加change事件，用于控制图层的可见性
  checkbox.addEventListener("change", function () {
    layer.setVisible(checkbox.checked);
  });
}
```

#### 图层探测

```ts
const mapContainer = map.getTargetElement();
const topLayer = map.getLayers().item(1) as TileLayer;

let radius = 75;
const adjustRadius = (event: KeyboardEvent) => {
  if (event.key === "ArrowUp") {
    radius = Math.min(radius + 5, 150);
    map.render(); //重新渲染
    event.preventDefault();
  } else if (event.key === "ArrowDown") {
    radius = Math.max(radius - 5, 25);
    map.render();
    event.preventDefault();
  }
};
document.addEventListener("keydown", adjustRadius);

//获取鼠标位置
let mousePosition: Pixel;
const getMousePosition = (event: MouseEvent) => {
  //获取浏览器事件相对于视口的像素位置
  mousePosition = map.getEventPixel(event);
  map.render();
};
const removeMousePosition = (event: MouseEvent) => {
  mousePosition = [];
  map.render();
};
mapContainer.addEventListener("mousemove", getMousePosition);
mapContainer.addEventListener("mouseout", removeMousePosition);

//绘制圆形裁剪上层图层
const topLayerPreRender = (event: RenderEvent) => {
  // 获取绘图上下文和像素比例
  let ctx = event.context as CanvasRenderingContext2D;
  let pixelRatio = (event.frameState as FrameState).pixelRatio;
  ctx.save();
  ctx.beginPath();
  if (mousePosition) {
    ctx.arc(
      mousePosition[0] * pixelRatio,
      mousePosition[1] * pixelRatio,
      radius * pixelRatio,
      0,
      2 * Math.PI
    );
    // 设置圆形的线条宽度和颜色
    ctx.lineWidth = 5 * pixelRatio;
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
  // 剪切绘图区域，限制后续绘制操作在圆形区域内
  ctx.clip();
};

// 图层渲染后恢复绘图状态
const topLayerPostRender = (event: RenderEvent) => {
  let ctx = event.context as CanvasRenderingContext2D;
  // 恢复之前保存的绘图状态
  ctx.restore();
};
topLayer.on("prerender", topLayerPreRender); //绑定图层预渲染事件
topLayer.on("postrender", topLayerPostRender);
```

#### 动画控件

```ts
const view = map.getView();
const shenyang = fromLonLat([123.429, 41.8956]);
const beijing = fromLonLat([116.469, 39.915]);
const shanghai = fromLonLat([121.4737, 31.2304]);
const wuhan = fromLonLat([114.266, 30.5928]);
const guangzhou = fromLonLat([113.2345, 23.1626]);
```

1. 旋转定位

```ts
view.animate(
  {
    rotation: Math.PI,
    easing: easeIn,
  },
  {
    center: shenyang,
    rotation: 2 * Math.PI,
    easing: easeOut,
  }
);
```

2. 弹性伸缩定位

```ts
view.animate({
  center: beijing,
  duration: 2000,
  //控制的动画持续时间函数
  easing: (t) => {
    return (
      Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) +
      1
    );
  },
});
```

3. 反弹定位

```ts
view.animate({
  center: shanghai,
  duration: 2000,
  easing: (t) => {
    let s = 7.5625;
    let p = 2.75;
    let l;
    if (t < 1 / p) {
      l = s * t * t;
    } else {
      if (t < 2 / p) {
        t -= 1.5 / p;
        l = s * t * t + 0.75;
      } else {
        if (t < 2.5 / p) {
          t -= 2.25 / p;
          l = s * t * t + 0.9375;
        } else {
          t -= 2.625 / p;
          l = s * t * t + 0.984375;
        }
      }
    }
    return l;
  },
});
```

4. 自旋定位

```ts
const mapRotate = view.getRotation();
view.animate(
  {
    rotation: mapRotate + Math.PI,
    anchor: wuhan,
    easing: easeIn,
  },
  {
    rotation: mapRotate + 2 * Math.PI,
    anchor: wuhan,
    easing: easeOut,
  }
);
```

5. 飞行定位

```ts
const duration = 2000;
const mapZoom = map.getView().getZoom() as number;
//平移动画
view.animate({
  center: guangzhou,
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
```

#### 测量控件

需先学习`图形绘制`和`高级功能/标注功能`

1. 创建测量矢量图层

   ```ts
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
   ```

2. 创建绘制交互绘制图层，计算长度、面积属性

   ```ts
   //测量类型
   let measureType = typeSelect.value;
   //是否使用地理测量
   let isUseGeodesic = geodesicCheckbox.checked;
   //初始化绘制交互
   let draw: Draw = updateDraw(measureType, isUseGeodesic, source);
   map.addInteraction(draw);
   //根据条件更新绘制交互
   function updateDraw(type: string, useGeodesic: boolean, drawSource: VectorSource): Draw {
     let draw: Draw;
     if (type === "length") {
       draw = new Draw({
         source: drawSource,
         type: "LineString",      //绘制线段
       });
       draw.on("drawend", (evt: DrawEvent) => {
         const line = evt.feature.getGeometry() as LineString;
         const lastCoord = line.getLastCoordinate();    //获取绘制线要素的最后一点
         //计算线要素的地理坐标下长度和平面坐标下长度
         const length = (useGeodesic ? getLength(line) : line.getLength()) / 1000;
         createMarker(lastCoord, `${length.toFixed(2)} 千米`);    //创建弹窗显示结果
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
   ```

3. 创建popup弹窗显示测量结果

   ```ts
   //coord,弹窗放置的坐标   info,弹窗显示的信息
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
   ```

4. 监听事件，更新绘制交互

   ```ts
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
   ```

## 图形绘制

### 绘制几何图形

* `map.addInteraction(interaction);`
* `map.removeInteraction(interaction);`
* `layer.setSource(source)`
* `layer.getSource()`

1. 新建矢量图层设置数据源及要素样式

   ```ts
   //创建矢量图层
   const vector = new VectorLayer({
     source: new VectorSource() as any,
     //设置样式
     style: new Style({
       //填充颜色，边框颜色，宽度，点的样式
       fill: new Fill({
         color: "rgba(117, 117, 117, 0.4)",
       }),
       stroke: new Stroke({
         color: "red",
         width: 2,
       }),
       image: new Circle({
         radius: 7,
         fill: new Fill({
           color: "red",
         }),
       }),
     }),
   });
   vector.set("name", "drawn-shape");
   map.addLayer(vector);
   ```

2. 创建绘制交互对象

   * The geometry type. One of `'Point'`, `'LineString'`, `'LinearRing'`, `'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`, `'GeometryCollection'`, or `'Circle'`.

   ```ts
   //创建绘图交互
   draw = new Draw({
     source: vector.getSource(),   //绘制的要素的目标源
     type: 'Point',     //绘制的要素类型
   });
   map.addInteraction(draw);
   ```

3. 去除绘图交互对象

   ```ts
   map.removeInteraction(draw);
   ```

4. 通过下拉框实现各种几何图形的绘制

   ```html
   <select id="shape-type" disabled>
     <option value="None">无</option>
     <option value="Point">点</option>
     <option value="LineString">线</option>
     <option value="Polygon">面</option>
     <option value="Circle">圆</option>
     <option value="Square">正方形</option>
     <option value="Box">长方形</option>
   </select>
   ```

   ```ts
   //获取下拉列表元素
   const select = document.querySelector("#shape-type") as HTMLSelectElement;
   let draw: Draw;
   let source: any;
   
   select.onchange = () => {
     map.removeInteraction(draw);  //移除交互
     addInteraction();
   };
   addInteraction();
   
   function addInteraction() {
     //获取下拉列表元素值
     let type = select.value as any;
     let geometryFunction = undefined;
     if (type === "None") {
       //清除绘制内容
       source = null;
       vector.setSource(source);
       return;
     } else {
       if (!source) {
         //source为空时创建矢量源
         source = new VectorSource();
         vector.setSource(source);
       }
       //处理未定义图形
       if (type === "Square") {
         type = "Circle";
         //创建一个用于 type: 'Circle' 的 GeometryFunction，
         //该函数将生成一个具有用户指定边数和起始角的正多边形，而不是圆形。
         geometryFunction = createRegularPolygon(4);
       } else if (type === "Box") {
         type = "Circle";
         //创建一个 GeometryFunction，用于生成一个与坐标系轴对齐的矩形多边形
         //将此函数与绘制交互和 type: 'Circle' 一起使用，以返回矩形而不是圆形
         geometryFunction = createBox();
       }
     }
     //创建绘制交互
     draw = new Draw({
       source: source, //绘制的要素的目标源
       type: type, //绘制的要素类型
       geometryFunction: geometryFunction, //当几何图形的坐标更新时调用的函数
     });
     map.addInteraction(draw);
   }
   ```

### 自定义要素样式

* `layer.setStyle(style)  `        修改矢量图层要素样式

* 点的样式

  ```ts
  style: new Style({
    image: new Circle({
      radius: 5,     //点的大小
      fill: new Fill({
        color: "red",    //点的颜色
      }),
    }),
  }),
  ```

* 线的样式

  ```ts
  style: new Style({
    stroke: new Stroke({
      color: "blue",     //线的颜色
      width: 2,        //线的宽度
    }),
  }),
  ```

* 面的样式

  ```ts
  style: new Style({
    stroke: new Stroke({
      color: "#00ff00",     //边界颜色
      width: 2,             //边界宽度
    }),
    fill: new Fill({ 
      color: "rgba(255,0,0, 0.3)",    //填充颜色
    }),
  }),
  ```

* 文本样式

  ```ts
  // 自定义文字样式
  const textStyle = new Text({
    textAlign: "center",
    textBaseline: "middle",
    rotation: 0,
    font: "normal 14px Arial",
    offsetX: 0,
    offsetY: -10,
    fill: new Fill({
      color: "black",
    }),
    text: "shape",
    stroke: new Stroke({
      color: "white",
      width: 3,
    }),
    scale: 1,
  });
  ```

### 选择和修改要素

* 多种方式选择要素

  1. 鼠标单击选择要素

     ```ts
     import { never, singleClick } from "ol/events/condition";
     
     const select = new Select({
       condition: singleClick,         //触发事件类型
       style: selectStyle,             //被选中要素的样式
       //layers: [],               //可以被选择的图层
       filter: (feature, layer) => {            //过滤器，当返回true时表示可以被选中
         // return layer instanceof VectorLayer;       //只选择矢量图层
         return feature.getGeometry() instanceof Point;      //只选择点要素
       },
     });
     ```

  2. 自定义范围选择要素(框选，圈选，自定义区域选择...)

     ```ts
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
     
     //实现框选要素
     let select: Select = new Select({
       condition: never,
       style: selectStyle,
     });
     draw = new Draw({
       source: drawLayer.getSource() as VectorSource,
       type: "Circle",
       geometryFunction: createBox(),
     });
     draw.setActive(true);
     
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
     map.addInteraction(draw);
     map.addInteraction(select);
     ```

* 修改要素

  ```ts
  const modify = new Modify({
    features: select.getFeatures(),
  });
  
  map.addInteraction(modify);
  modify.setActive(true);
  ```


## OGC服务



## 高级功能

### 标注功能

#### 图文标注

* 通过使用矢量图层实现图文标注

  1. 新建矢量图层

     ```ts
     //通过矢量图层创建标注
     const beijing = fromLonLat([116.46, 39.92]);
     const feature = new Feature({
       geometry: new Point(beijing),
       name: "Beijing",
     });
     const source = new VectorSource({
       features: [feature],
     });
     const layer = new VectorLayer({
       source: source,
     });
     map.addLayer(layer);
     ```

  2. 设置矢量图层要素样式

     ```ts
     //要素样式函数
     function styleFunction(feature: Feature) {
       return new Style({
         //点要素设置为图片
         image: new Icon({
           anchor: [0.5, 60],
           anchorOrigin: "top-right",
           anchorXUnits: "fraction",
           anchorYUnits: "pixels",
           offsetOrigin: "top-right",
           opacity: 0.75,
           scale: 0.1,
           src: "../static/img/avatar.jpg",
         }),
         //文本内容为要素字段/属性
         text: new Text({
           textAlign: "center",
           textBaseline: "bottom",
           font: "normal 14px sans-serif",
           offsetY: -5,
           text: feature.get("name"),
           fill: new Fill({
             color: "#000",
           }),
           stroke: new Stroke({
             color: "#fff",
             width: 2,
           }),
         }),
       });
     }
     //设置标注样式 - 点、文本样式
     feature.setStyle(styleFunction(feature));
     ```

* 通过添加地图覆盖层实现图文标注

  1. 创建覆盖层

     ```ts
     //通过添加覆盖层创建标注
     const wuhan = fromLonLat([114.27, 30.59]);
     const marker = new Overlay({
       position: wuhan,
       positioning: "center-center",
       element: document.createElement("div"),
       stopEvent: false,
     });
     ```

  2. 设置覆盖层显示文字或图片

     ```ts
     //设置标注内容，添加样式类
     (marker.getElement() as HTMLElement).innerText = "Wuhan";
     (marker.getElement() as HTMLElement).classList.add("marker");
     map.addOverlay(marker);
     ```

* 实现鼠标点击添加标注

  ```ts
  //监听鼠标点击以添加标注
  const markFun = (e: any) => {
    let str = prompt("请输入标注内容:");
    if (!str) {
      return;
    }
    if (markerType == "vector") {
      createVectorMarker(e.coordinate, source, str);
    } else {
      createOverlayLabel(e.coordinate, map, str);
    }
  };
  map.on("click", markFun);
  
  //创建覆盖层标注
  function createOverlayLabel(coord: Coordinate, map: Map, info: string) {
    const newMarker = document.createElement("div");
    newMarker.classList.add("marker");
    const marker = new Overlay({
      position: coord,
      stopEvent: false,
      element: newMarker,
    });
    newMarker.innerText = info;
    map.addOverlay(marker);
  }
  
  //创建矢量图层标注
  function createVectorMarker(
    coord: Coordinate,
    layerSource: VectorSource,
    info: string
  ) {
    //创建一个要素
    const feature = new Feature({
      geometry: new Point(coord),
      name: info,
    });
    //设置要素样式
    feature.setStyle(styleFunction(feature));
    //添加要素到矢量源
    layerSource.addFeature(feature);
  }
  ```

#### 弹窗标注

* 实现点击点要素弹出相关信息弹窗

  1. 创建点图层

     ```ts
     //添加点图层
     const beijing = fromLonLat([116.46, 39.92]);
     const shanghai = fromLonLat([121.48, 31.22]);
     const f1 = new Feature({
       geometry: new Point(beijing),
       info: {
         title: "北京市",
         titleUrl: "",
         text: "",
         imgUrl: "",
       },
     });
     const f2 = new Feature({...});
     const layer = new VectorLayer({
       source: new VectorSource({
         features: [f1, f2],
       }),
       style: new Style({
         image: new Circle({
           radius: 5,
           fill: new Fill({
             color: "red",
           }),
         }),
       }),
     });
     map.addLayer(layer);
     ```

  2. 创建popup容器，新建Overlay，添加到地图

     ```ts
     //创建popup载体
     const container = document.createElement("div");
     container.className = "ol-popup";
     const closer = document.createElement("a");
     closer.className = "ol-popup-closer";
     closer.innerHTML = "✖";
     const content = document.createElement("div");
     container.appendChild(closer);
     container.appendChild(content);
     
     //创建popup
     const popup = new Overlay({
       element: container,
       //控制当弹出窗口显示时，地图是否自动平移以确保弹出窗口完全可见
       autoPan: {
         animation: { duration: 250 },
       },
       offset: [0, -12],
       positioning: "bottom-center",
       stopEvent: false,
     });
     map.addOverlay(popup);
     
     //添加关闭popup按钮事件
     closer.onclick = () => {
       popup.setPosition(undefined);
       closer.blur();
       return false; //阻止默认行为，阻止事件冒泡
     };
     ```

  3. 绑定地图事件

     ```ts
     //添加地图点击事件，展示要素信息
     map.on("click", (e) => {
       //检查鼠标是否点击到要素
       const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
       if (feature) {
         content.innerHTML = "";
         //向content中添加要素信息
         addFeatureInfo(feature.get("info"), content);
         //设置popup位置
         const point = feature.getGeometry() as Point;
         popup.setPosition(point.getCoordinates());
       }
     });
     //添加鼠标移动事件，当移动到要素上时，更改鼠标样式
     map.on("pointermove", (e) => {
       const pixel = map.getEventPixel(e.originalEvent);
       const hit = map.hasFeatureAtPixel(pixel);
       map.getTargetElement().style.cursor = hit ? "pointer" : "default";
     });
     ```

  4. popup内容创建函数

     ```ts
     function addFeatureInfo(featureInfo: any, content: HTMLElement) {
       const elemA = document.createElement("a");
       elemA.href = featureInfo.titleUrl;
       elemA.target = "_blank";
       elemA.innerText=featureInfo.title;
       content.appendChild(elemA);
       const elemDiv = document.createElement("div");
       content.appendChild(elemDiv);
       elemDiv.innerText=featureInfo.text;
       const elemImg = document.createElement("img");
       elemImg.src = featureInfo.imgUrl;
       elemImg.style.width = "100%";
       content.appendChild(elemImg);
     }
     ```

#### 聚类标注

```ts
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
```

### 投影转换

1. 安装proj4相关依赖

   ```cmd
   npm install proj4
   npm install @types/proj4 -D
   ```

2. 使用proj4定义坐标系

   ```ts
   // 定义球形摩尔魏特投影坐标系，对应ESRI编号为 53009
   proj4.defs(
     "ESRI:53009",
     "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs"
   );
   ```

3. 将定义注册到openlayers中，定义投影

   ```ts
   import { register } from "ol/proj/proj4";
   import { fromLonLat, Projection } from "ol/proj";
   //注册到OpenLayers
   register(proj4);
   //定义球形摩尔魏特投影坐标系
   const sphereMollweideProj = new Projection({
     code: "ESRI:53009",
     extent: [
       -9009954.605703328, -9009954.605703328, 9009954.605703328,
       9009954.605703328,
     ],
     worldExtent: [-179, -90, 179, 90],
   });
   ```

4. 使用定义坐标系

   ```ts
   transformMap = new Map({
     target: "map2",
     layers: [
       new VectorLayer({
         source: new Vector({
           url: "https://geojson.cn/api/china/100000.json",
           format: new GeoJSON(),
         }),
       }),
     ],
     view: new View({
       center: fromLonLat([116.397428, 39.90816]),
       projection: sphereMollweideProj,
       zoom: 3,
     }),
   });
   ```

### 视图联动

* 将副图的view对象指向主图的view对象

  ```ts
  const map1 = new Map({
    target: "map1",
    layers: [],
    view: new View({
      center: fromLonLat([116.397428, 39.90816]),
      zoom: 5,
      projection: "EPSG:3857",
    }),
  });
  
  const map2 = new Map({
    target: "map2",
    layers: [],
    view: map1.getView(),
  });
  ```

### 定位导航

* 创建定位导航对象

  ```ts
  import { Geolocation } from "ol";
  //创建定位导航对象
  const geoLocation = new Geolocation({
    projection: map.getView().getProjection(),
    //追踪参数
    trackingOptions: {
      maximumAge: 10000, // 允许使用10秒内的缓存位置
      enableHighAccuracy: true,
      timeout: 600000,
    },
  });
  ```

* 开启位置追踪

  ```ts
  geoLocation.setTracking(true);
  ```

* 监听事件

  ```ts
  //位置变化时更新信息
  geoLocation.on("change", () => {
    const accuracy = geoLocation.getAccuracy();      //定位精度
    const altitude = geoLocation.getAltitude();      //定位高程
    const altitudeAccuracy = geoLocation.getAltitudeAccuracy();     //高程精度
    const heading = geoLocation.getHeading();        //设备朝向
    const speed = geoLocation.getSpeed();            //速度
    const position = geoLocation.getPosition() as Coordinate;     //定位位置
  });
  
  //位置获取失败时处理
  geoLocation.on("error", function (error) {
    console.log("Geolocation error occurred: ", error);
  });
  ```

### 热点图

```ts
import Heatmap from "ol/layer/Heatmap";

const radius = document.querySelector("#radius") as HTMLInputElement;
const blur = document.querySelector("#blur") as HTMLInputElement;
//创建热点图层
const heatmap = new Heatmap({
  source: new VectorSource({
    features: createRandomFeatures(1000),
  }),
  radius: parseInt(radius.value, 10),      //热点半径
  blur: parseInt(blur.value, 10),		   //模糊尺寸
  weight: (feature: Feature) => {          //每个要素的权重
    return feature.get("weight") as number;
  },
});
map.addLayer(heatmap);
radius.onchange = () => {
  heatmap.setRadius(parseInt(radius.value, 10));   //重新设置半径
};
blur.onchange = () => {
  heatmap.setBlur(parseInt(blur.value, 10));      //设置模糊尺寸
};

//创建随机点
function createRandomFeatures(number: number): Feature[] {
  const features: Feature[] = [];
  for (let i = 0; i < number; i++) {
    const feature = new Feature({
      geometry: new Point([Math.random() * 55 + 75, Math.random() * 30 + 20]),
      weight: Math.random() * 8 + 2,     //给每个点添加权重信息
    });
    features.push(feature);
  }
  return features;
}
```

### 热区功能

1. 创建常规矢量图层和热区矢量图层，设置不同样式

   ```ts
   const map = new Map({
     target: "map",
     layers: [],
     view: new View({
       center: [116, 36],
       zoom: 5,
       projection: "EPSG:4326",
     }),
   });
   //数据层样式
   const normalStyle = new Style({
     fill: new Fill({
       color: "rgba(7, 139, 255, 0.2)",
     }),
     stroke: new Stroke({
       color: "#aa33aa",
       width: 2,
     }),
   });
   //热区层样式
   const flashStyle = new Style({
     fill: new Fill({
       color: "rgba(255, 25, 0, 0.5)",
     }),
     stroke: new Stroke({
       color: "#ff0000",
       width: 2,
     }),
   });
   //数据层
   const vectorLayer = new VectorLayer({
     source: new VectorSource({
       url: "https://geojson.cn/api/china/100000.json",
       format: new GeoJSON(),
     }),
     style: normalStyle,
     opacity: 0.5,
   });
   map.addLayer(vectorLayer);
   //热区层
   const hotAreaLayer = new VectorLayer({
     source: new VectorSource({}),
     style: flashStyle,
     opacity: 1,
   });
   map.addLayer(hotAreaLayer);
   hotAreaLayer.setVisible(false);   //隐藏热区层
   ```

2. 创建popup弹窗

   ```ts
   //创建popup弹窗
   const popupDiv = document.createElement("div");
   popupDiv.innerHTML = "";
   popupDiv.className = "popup";   //通过类设置样式
   const popup = new Overlay({
     element: popupDiv,
     positioning: "bottom-center",
     stopEvent: false,
   });
   map.addOverlay(popup);
   ```

3. 添加地图事件，实现鼠标悬浮元素高亮显示并使用popup展示其相关信息

   ```ts
   //前一个热区要素
   let preFeature: Feature | null = null;
   //当前热区要素是否和前一个热区要素相同
   let flag: boolean = false;
   map.on("pointermove", pointerMoveHandler);
   function pointerMoveHandler(event: MapBrowserEvent<any>) {
     const pixel = event.pixel;   // map.getEventPixel(event.originalEvent);
     const hit = map.hasFeatureAtPixel(pixel);
     map.getTargetElement().style.cursor = hit ? "pointer" : "";
     //当前没有指向要素
     if (!hit) {
       preFeature = null;
       popup.setPosition(undefined);
       hotAreaLayer.setVisible(false);
       return;
     }
     //获取当前鼠标位置的要素
     const feature = map.forEachFeatureAtPixel(
       pixel,
       (feature) => feature
     ) as Feature;
   
     if (preFeature === feature) {
       flag = true;
     } else {
       flag = false;
       preFeature = feature;
     }
     //当前要素和前一个要素不同
     if (!flag) {
       hotAreaLayer.getSource()?.clear();
       hotAreaLayer.getSource()?.addFeature(feature);
       hotAreaLayer.setVisible(true);
       (popup.getElement() as HTMLElement).innerText = `${feature.get("name")}\n${feature.get("GDP_2015")}\n${feature.get("GDP_2016")}\n${feature.get("GDP_2017")}`;
     }
     popup.setPosition(event.coordinate);
   }
   ```

### 统计图

1. 安装echarts

   ```cmd
   npm i echarts
   ```

2. 创建popup弹窗

   ```ts
   //popup弹窗
   const popupContainter = document.createElement("div");
   popupContainter.className = "popup";
   const chartContainer = document.createElement("div");
   chartContainer.id = "chartContainer";
   popupContainter.appendChild(chartContainer);
   const popup = new Overlay({
     element: popupContainter,
     positioning: "bottom-center",
     stopEvent: false,
   });
   map.addOverlay(popup);
   ```

3. 创建图表

   ```ts
   //创建图表
   const myChart = echarts.init(
     document.querySelector(`#chartContainer`) as HTMLElement
   );
   function createChart(data: number[], title: string) {
     const option: echarts.EChartOption = {
       xAxis: {
         type: "category",
         data: ["1994", "1997", "1998", "1999", "2000"],
       },
       yAxis: {
         type: "value",
       },
       series: [
         {
           data,
           type: "line",
         },
       ],
       title: {
         text: title + " GDP",
         left: "center",
       },
     };
     myChart.setOption(option);
   }
   ```

### 军事标绘













