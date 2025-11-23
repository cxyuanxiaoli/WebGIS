import LayerManage from "./LayerManage.js";
import SymbolDesign from "./SymbolDesign.js";
import {
  Map,
  VectorLayer,
  VectorSource,
  Draw,
  Snap,
  createBox,
  Select,
} from "../MyOpenlayers.js";

/**
 * @typedef {Object} Store 存储对象
 * @property {VectorLayer | null} editLayer 当前编辑图层
 * @property {number} count 图层计数器
 * @property {Draw | null} draw 当前绘制控件
 * @property {Snap | null} snap 当前捕捉控件
 * @property {Select | null} select 当前选择控件
 */

/**
 * @constant {Store} Store 存储对象
 */
const Store = {
  editLayer: null,
  count: 1,
  draw: null,
  snap: null,
  select: null,
};
const editStr = "<sup style='color:#64a7ff;'><i>edit</i></sup>";

/**
 * @function addVectorLayer 添加矢量图层
 * @param {Map} map 目标Map对象
 */
const addVectorLayer = (map) => {
  const editLayer = Store.editLayer;
  if (editLayer) {
    editLayer.set("name", editLayer.get("name").split(editStr)[0]);
  }

  const layer = new VectorLayer({
    source: new VectorSource({
      features: [],
    }),
    style: SymbolDesign.defaultSymbol,
  });
  layer.set("name", `矢量图层${Store.count++}${editStr}`);
  map.addLayer(layer);
  Store.editLayer = layer;
  LayerManage.refresh(map);
};

/**
 * @function drawShape 绘制图形函数
 * @param {Map} map 添加Draw控件的地图对象
 * @param {'Point' | 'LineString' | 'Polygon' | 'Rectangle' | 'Circle'} type 绘制类型
 * @param {boolean} bool 开启/关闭绘制功能
 */
const drawShape = (map, type, bool) => {
  const draw = Store.draw;
  if (!bool) {
    if (draw) map.removeInteraction(draw);
    return;
  }
  if (!Store.editLayer) {
    alert("请先选择编辑图层！");
    return;
  }

  if (type === "Rectangle") {
    Store.draw = new Draw({
      source: Store.editLayer.getSource(),
      type: "Circle",
      geometryFunction: createBox(),
    });
  } else {
    Store.draw = new Draw({
      source: Store.editLayer.getSource(),
      type: type,
    });
  }
  map.addInteraction(Store.draw);
};

/**
 * @function changeSnap 切换捕捉功能
 * @param {Map} map 目标Map对象
 * @param {boolean} bool 开启/关闭捕捉功能
 */
const changeSnap = (map, bool) => {
  const snap = Store.snap;
  if (!bool) {
    if (snap) map.removeInteraction(snap);
    return;
  }
  Store.snap = new Snap({
    source: Store.editLayer.getSource(),
  });
  map.addInteraction(Store.snap);
};

/**
 * @function toogleEditLayer  切换编辑图层功能
 * @param {VectorLayer} layer  要编辑的图层
 * @param {Map} map  目标Map对象
 */
const toogleEditLayer = (layer, map) => {
  const editLayer = Store.editLayer;
  if (editLayer) {
    editLayer.set("name", editLayer.get("name").split(editStr)[0]);
  }
  layer.set("name", layer.get("name") + editStr);
  Store.editLayer = layer;
  LayerManage.refresh(map);
};

/**
 * @function selectFeature 选择要素功能
 * @param {Map} map  目标Map对象
 * @param {boolean} bool 开启/关闭选择功能
 */
const selectFeature = (map, bool) => {
  const select = Store.select;
  if (!bool) {
    if (select) map.removeInteraction(select);
    return;
  }
  Store.select = new Select({
    filter: (feature, layer) => {
      return layer === Store.editLayer;
    },
  });
  map.addInteraction(Store.select);
};

/**
 * @function deleteFeature 删除选择的要素
 */
const deleteFeature = () => {
  Store.editLayer
    .getSource()
    .removeFeatures(Store.select.getFeatures().getArray());
};

export default {
  drawShape,
  changeSnap,
  addVectorLayer,
  toogleEditLayer,
  selectFeature,
  deleteFeature,
};
