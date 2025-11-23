import { Overlay } from "./MyOpenlayers.js";

/**
 * @constant {HTMLDivElement} popupContainer 弹窗容器
 */
const popupContainer = document.createElement("div");
popupContainer.className = "popup";
const popup = new Overlay({
  element: popupContainer,
  autoPan: true,
  positioning: "bottom-center",
  offset: [0, -15],
});

/**
 * @function setMap 设置弹窗显示的地图
 * @param {Map} map
 */
const setMap = (map) => {
  map.addOverlay(popup);
};

/**
 * @function fillContent 填充弹窗内容
 * @param {string} title   弹窗标题
 * @param {object} tableObj  属性信息对象
 * @param {string} img   图片路径
 * @returns {Overlay}
 */
const fillContent = (title, tableObj, img = null) => {
  popupContainer.innerHTML = "";
  const h3 = document.createElement("h3");
  h3.textContent = title;
  popupContainer.appendChild(h3);
  const table = document.createElement("table");
  for (let key in tableObj) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = key;
    const td = document.createElement("td");
    td.innerHTML = tableObj[key];
    tr.appendChild(th);
    tr.appendChild(td);
    table.appendChild(tr);
  }
  popupContainer.appendChild(table);
  if (img) {
    const imgDiv = document.createElement("div");
    imgDiv.style.textAlign = "center";
    const imgTag = document.createElement("img");
    imgTag.src = img;
    imgDiv.appendChild(imgTag);
    popupContainer.appendChild(imgDiv);
  }
  return popup;
};

/**
 * @function hide 隐藏弹窗
 */
const hide = () => {
  popup.setPosition(undefined);
};

export default {
  setMap,
  fillContent,
  hide,
};
