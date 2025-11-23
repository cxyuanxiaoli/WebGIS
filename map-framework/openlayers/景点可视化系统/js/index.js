import MapConstruct from "./module/MapConstruct.js";
import SearchBar from "./module/SearchBar.js";
import LayerManage from "./module/LayerManage.js";

document.querySelector("#btn-link-view").onclick = () => {
  document.querySelector("#map").classList.toggle("link-view");
  document.querySelector("#right-map").classList.toggle("link-view");
};

document.querySelector("#btn-layer-panel").onclick = () => {
  document.querySelector(".layer-panel").classList.toggle("hide");
};

const map = MapConstruct.init();
SearchBar.init(map);
LayerManage.refresh(map);
