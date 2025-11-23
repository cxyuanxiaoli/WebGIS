import { Map, VectorLayer, GeoJSON } from "../MyOpenlayers.js";
import DrawShape from "./DrawShape.js";
import SymbolDesign from "./SymbolDesign.js";

/**
 * @constant panel 图层面板Dom
 */
const panel = document.querySelector(".layer-panel");
let editBtns = null;
let layers = null;

/**
 * @function refresh 刷新图层面板
 * @param {Map} map Map对象
 */
const refresh = (map) => {
  panel.innerHTML = "";
  panel.appendChild(creatLayerPanel(map));
  SymbolDesign.updateLayerList();
};

/**
 * @function creatLayerPanel 创建图层面板
 * @param {Map} map  Map对象
 * @returns {HTMLUListElement}
 */
const creatLayerPanel = (map) => {
  layers = map.getLayers();
  const ul = document.createElement("ul");
  ul.innerHTML = "图层管理";
  editBtns = [];

  layers.forEach((layer) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = layer.getVisible();
    checkbox.onchange = function () {
      layer.setVisible(this.checked);
    };
    const label = document.createElement("label");
    label.innerHTML = layer.get("name");
    li.appendChild(checkbox);
    li.appendChild(label);

    //如果是矢量图层 添加编辑和输出按钮
    if (layer instanceof VectorLayer) {
      const outputBtn = document.createElement("button");
      outputBtn.innerHTML = "输出";
      outputBtn.onclick = () => {
        const str = new GeoJSON().writeFeatures(
          layer.getSource().getFeatures()
        );
        const blob = new Blob([str], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = layer.get("name") + ".json";
        link.click();
        URL.revokeObjectURL(url);
      };

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "编辑";
      editBtn.onclick = () => {
        DrawShape.toogleEditLayer(layer, map);
      };
      editBtns.push(editBtn);
      li.appendChild(outputBtn);
      li.appendChild(editBtn);
    }
    ul.appendChild(li);
  });
  return ul;
};

/**
 * @function disabledEditBtn 禁用所有编辑按钮
 * @param {boolean} bool  是否禁用
 */
const disabledEditBtn = (bool) => {
  if (!editBtns) return;
  editBtns.forEach((btn) => {
    btn.disabled = bool;
  });
};

/**
 * @function getLayers 获取所有图层
 * @returns {Array<VectorLayer>}
 */
const getLayers = () => {
  return layers;
};

export default {
  getLayers,
  refresh,
  disabledEditBtn,
};
