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







