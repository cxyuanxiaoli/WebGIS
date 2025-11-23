import { Map } from "./MyOpenlayers.js";
import MapStructure from "./MapStructure.js";
import DrawShape from "./tool-design/DrawShape.js";
import LayerManage from "./tool-design/LayerManage.js";
import SymbolDesign from "./tool-design/SymbolDesign.js";

/**
 * @function DomHandler 处理所有的页面Dom事件绑定
 * @param {Map} map  Map对象
 */
export default function DomHandler(map) {
  //#region 基本事件绑定
  //视图链接
  document.querySelector("#link-view").onclick = () => {
    document.querySelector("#map1").classList.toggle("full-map");
    document.querySelector("#map2").classList.toggle("no-map");
  };

  //工具条显示与隐藏
  document.querySelectorAll(".tools-bar>.tool").forEach((element) => {
    element.onclick = () => {
      document
        .querySelector(`.tools-container>.tool.${element.id}`)
        .classList.toggle("display");
    };
  });

  //图层显示与隐藏
  document.querySelector("#layer-toggle").onclick = () => {
    document.querySelector(".layer-panel").classList.toggle("hide");
  };
  //#endregion

  //#region 地图浏览
  const selectedLookType = document.querySelector("#map-look-type");
  const selectedProvince = document.querySelector("#map-look-province");
  const selectedCity = document.querySelector("#map-look-city");
  const inputX = document.querySelector("#map-look-jd");
  const inputY = document.querySelector("#map-look-wd");

  //浏览类型切换 - 省市区/经纬度
  selectedLookType.onchange = () => {
    selectedProvince.classList.toggle("hide");
    selectedCity.classList.toggle("hide");
    inputX.classList.toggle("hide");
    inputY.classList.toggle("hide");
  };

  //初始化省级列表
  let xzqCode = null;
  fetch("../data/XZQcode.json")
    .then((res) => res.json())
    .then((data) => {
      xzqCode = data;
      for (const item in data) {
        selectedProvince.appendChild(createOption(item, item));
      }
    });

  //选择省份后，动态加载城市级列表
  selectedProvince.onchange = () => {
    if (!xzqCode) return;
    const province = selectedProvince.value;
    selectedCity.innerHTML = "";
    selectedCity.appendChild(createOption("", "请选择"));
    const specialCitys = [
      "北京市",
      "天津市",
      "上海市",
      "重庆市",
      "香港特别行政区",
      "澳门特别行政区",
    ];
    if (specialCitys.includes(province)) {
      selectedCity.appendChild(createOption(province, province));
      return;
    }
    const city = xzqCode[province];
    for (let item in city) {
      if (item === "code") continue;
      selectedCity.appendChild(createOption(item, item));
    }
  };

  //确定按钮点击事件
  document.querySelector("#map-look-confirm").onclick = () => {
    let center = null;
    if (selectedLookType.value === "xzq") {
      if (!selectedProvince.value || !selectedCity.value) return;
      if (!xzqCode[selectedProvince.value][selectedCity.value]) {
        center = xzqCode[selectedProvince.value]["center"];
      } else {
        center = xzqCode[selectedProvince.value][selectedCity.value]["center"];
      }
    } else if (selectedLookType.value === "jwd") {
      if (!inputX.value || !inputY.value) return;
      center = [inputX.value, inputY.value];
      if (Math.abs(center[0]) > 180 || Math.abs(center[1]) > 90) {
        center = [0, 0];
      }
    }
    const type = document.querySelector("#map-look-move-type").value;
    MapStructure.mapLook(type, center);
  };
  //#endregion

  //#region 绘制图形
  const btnAddLayer = document.querySelector("#draw-tool-add");
  const btnStartDraw = document.querySelector("#draw-tool-start");
  const selectedDrawType = document.querySelector("#draw-tool-type");
  const checkedDrawSnap = document.querySelector("#draw-tool-snap");
  const btnSelectFeature = document.querySelector("#draw-tool-select");
  const btnDeleteFeature = document.querySelector("#draw-tool-delete");

  //添加图层按钮点击事件
  btnAddLayer.onclick = () => {
    DrawShape.addVectorLayer(map);
  };

  //开始绘制按钮点击事件
  btnStartDraw.onclick = function () {
    this.classList.toggle("selected");
    const bool = this.classList.contains("selected");
    btnAddLayer.disabled = bool;
    selectedDrawType.disabled = bool;
    checkedDrawSnap.disabled = !bool;
    LayerManage.disabledEditBtn(bool);
    if (bool && btnSelectFeature.classList.contains("selected")) {
      btnSelectFeature.classList.remove("selected");
      btnDeleteFeature.disabled = true;
      DrawShape.selectFeature(map, false);
    }
    const type = selectedDrawType.value;
    DrawShape.drawShape(map, type, bool);
    DrawShape.changeSnap(map, checkedDrawSnap.checked);
  };

  //是否开启捕捉
  checkedDrawSnap.onchange = function () {
    DrawShape.changeSnap(map, this.checked);
  };

  //选择图形按钮点击事件
  btnSelectFeature.onclick = () => {
    if (btnStartDraw.classList.contains("selected")) {
      return;
    }
    btnSelectFeature.classList.toggle("selected");
    const bool = btnSelectFeature.classList.contains("selected");
    LayerManage.disabledEditBtn(bool);
    btnDeleteFeature.disabled = !bool;
    DrawShape.selectFeature(map, bool);
  };

  btnDeleteFeature.onclick = () => {
    DrawShape.deleteFeature();
  };
  //#endregion

  //#region 符号设计
  const selectedSymbolLayer = document.querySelector("#symbol-tool-layer");
  const btnSymbolConfirm = document.querySelector("#symbol-tool-confirm");
  const findLayer = () => {
    return LayerManage.getLayers()
      .getArray()
      .find((layer) => {
        return layer.get("name") === selectedSymbolLayer.value;
      });
  };
  //图层选择事件
  selectedSymbolLayer.onchange = () => {
    SymbolDesign.setDomValue(findLayer());
  };

  //应用样式按钮点击事件
  btnSymbolConfirm.onclick = () => {
    SymbolDesign.applySymbol(findLayer());
  };
  //#endregion

  //#region 定位服务
  const btnLocate = document.querySelector("#locate-tool");
  //定位按钮点击事件
  btnLocate.onclick = () => {
    btnLocate.classList.toggle("locate-selected");
    const bool = btnLocate.classList.contains("locate-selected");
    MapStructure.mapLocate(bool);
  };
  //#endregion
}

/**
 * @function createOption 创建option元素
 * @param {string} value option的value属性
 * @param {string} text  option的text内容
 * @returns {HTMLOptionElement}
 */
function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.innerHTML = text;
  return option;
}
