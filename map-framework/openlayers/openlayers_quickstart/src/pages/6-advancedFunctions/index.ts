import { map } from "../1-loadMap/loadMap";
import addClusterMarker from "./mapMarker/addClusterMarker";
import addPopupMarker from "./mapMarker/addPopupMarker";
import addTextImgMarker from "./mapMarker/addTextImgMarker";

export default function advancedFunctions() {
  // 仅保留高德地图图层
  const advancedFunctionsTitle = document.querySelector(
    "#advanced-function-title"
  );
  const removeLayers = () => {
    map.getLayers().forEach((item) => {
      if (item.get("name") !== "高德地图图层") item.setVisible(false);
    });
    advancedFunctionsTitle?.removeEventListener("click", removeLayers);
  };
  advancedFunctionsTitle?.addEventListener("click", removeLayers);

  //为子菜单绑定事件
  const afList = document.querySelectorAll("#advanced-function li");

  afList[0].addEventListener("click", () => {
    addTextImgMarker(map);
    document.querySelector(".marker-menu")?.classList.remove("custom-hide");
  });

  const addPopup = () => {
    addPopupMarker(map);
    afList[1].removeEventListener("click", addPopup);
  };
  afList[1].addEventListener("click", addPopup);

  const addCluster = () => {
    addClusterMarker(map);
    afList[2].removeEventListener("click", addCluster);
  };
  afList[2].addEventListener("click", addCluster);
}

// addpo function
