import { Style, Circle, Fill, Stroke } from "../MyOpenlayers.js";
import { VectorLayer } from "../MyOpenlayers.js";
import LayerManage from "./LayerManage.js";

/**
 * @constant defaultSymbol 要素默认样式
 */
const defaultSymbol = new Style({
  image: new Circle({
    radius: 5,
    fill: new Fill({
      color: "#ff0000",
    }),
  }),
  stroke: new Stroke({
    width: 2,
    color: "#0055ff",
  }),
  fill: new Fill({
    color: "rgba(255, 255, 255, 0.6)",
  }),
});

/**
 * @function applySymbol 应用样式到图层
 * @param {*} layer  目标图层
 */
const applySymbol = (layer) => {
  if (!layer) return;
  const style = getDomValue();
  layer.setStyle(style);
};

/**
 * @function setDomValue  设置样式面板的值
 * @param {*} layer  源图层
 */
const setDomValue = (layer) => {
  if (!layer) return;
  const style = layer.getStyle();
  const pointStyle = style.getImage();
  const lineStyle = style.getStroke();
  const fillStyle = style.getFill();
  const [rgb, opacity] = rgbaToHex(fillStyle.getColor());
  document.querySelector("#symbol-point-size").value = pointStyle.getRadius();
  document.querySelector("#symbol-point-color").value = pointStyle
    .getFill()
    .getColor();
  document.querySelector("#symbol-line-color").value = lineStyle.getColor();
  document.querySelector("#symbol-line-width").value = lineStyle.getWidth();
  document.querySelector("#symbol-fill-color").value = rgb;
  document.querySelector("#symbol-fill-opacity").value = opacity;
};

/**
 * @function getDomValue 获取样式面板的值
 * @returns {Style}
 */
const getDomValue = () => {
  const opacity = document.querySelector("#symbol-fill-opacity").value;
  const fillColor = document.querySelector("#symbol-fill-color").value;
  return new Style({
    image: new Circle({
      radius: document.querySelector("#symbol-point-size").value,
      fill: new Fill({
        color: document.querySelector("#symbol-point-color").value,
      }),
    }),
    stroke: new Stroke({
      width: document.querySelector("#symbol-line-width").value,
      color: document.querySelector("#symbol-line-color").value,
    }),
    fill: new Fill({
      color: hexToRgba(fillColor, opacity),
    }),
  });
};

/**
 * @function rgbaToHex  转换 rgba 值到 hex 值
 * @param {'rgba(r,g,b,a)'} rgba
 * @returns {['#RRGGBB', opacity]}
 */
const rgbaToHex = (rgba) => {
  // 使用正则表达式匹配 rgba 值
  const rgbaRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/;
  const match = rgba.match(rgbaRegex);
  if (!match) {
    throw new Error("Invalid rgba string format");
  }

  // 提取 RGB 和透明度
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const opacity = match[4] !== undefined ? parseFloat(match[4]) : 1;
  // 将每个颜色分量转换为两位的十六进制字符串
  const toHex = (component) => {
    const hex = component.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  // 组合成完整的十六进制字符串
  return [`#${toHex(r)}${toHex(g)}${toHex(b)}`, opacity];
};

/**
 * @function hexToRgba  转换 hex 值到 rgba 值
 * @param {'#RRGGBB'} hex  十六进制颜色值
 * @param {number} opacity   透明度
 * @returns {'rgba(r,g,b,a)'}
 */
const hexToRgba = (hex, opacity) => {
  // 去掉可能存在的井号 (#)
  hex = hex.replace(/^#/, "");
  // 处理不同长度的十六进制字符串
  if (hex.length === 3) {
    // 处理简写形式的十六进制 (例如 #FFF)
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  // 解析 RGB 值
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * @function updateLayerList  更新图层下拉列表
 */
const updateLayerList = () => {
  const layers = LayerManage.getLayers();
  const symbolToolLayers = document.querySelector("#symbol-tool-layer");
  symbolToolLayers.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.innerHTML = "图层";
  symbolToolLayers.appendChild(option);
  layers.forEach((layer) => {
    if (layer instanceof VectorLayer) {
      const option = document.createElement("option");
      option.value = layer.get("name");
      option.innerHTML = layer.get("name");
      symbolToolLayers.appendChild(option);
    }
  });
};

export default {
  defaultSymbol,
  updateLayerList,
  setDomValue,
  applySymbol,
};
