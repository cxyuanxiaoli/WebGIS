import { Map } from "./MyOpenlayers.js";

/**
 * @constant panel 图层面板Dom
 */
const panel = document.querySelector(".layer-panel");

/**
 * @function refresh 刷新图层面板
 * @param {Map} map Map对象
 */
const refresh = (map) => {
  panel.innerHTML = "";
  panel.appendChild(creatLayerPanel(map));
};

/**
 * @function creatLayerPanel 创建图层面板
 * @param {Map} map
 * @returns {HTMLUListElement}
 */
const creatLayerPanel = (map) => {
  const layers = map.getLayers();
  const ul = document.createElement("ul");
  ul.innerHTML = "图层管理";
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
    ul.appendChild(li);
  });
  return ul;
};

export default {
  refresh,
};
