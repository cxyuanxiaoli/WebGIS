import "ol/ol.css";
import "./css/controlsReset.css";
import "./css/drawsReset.css";
import { map } from "./pages/1-loadMap/loadMap";
import addControls from "./pages/2-addControls/addControls";
import drawShape from "./pages/4-drawShape/drawShape";
addControls();
drawShape();
map.setTarget("map");
