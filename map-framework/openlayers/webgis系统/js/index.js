import MapStructure from "./MapStructure.js";
import DomHandler from "./DomHandler.js";
import LayerManage from "./tool-design/LayerManage.js";

const map = MapStructure.initMap();
LayerManage.refresh(map);
DomHandler(map);
