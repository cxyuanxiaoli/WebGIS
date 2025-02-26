import "ol/ol.css";
import "./css/controlsReset.css";
import { map } from "./pages/1-loadMap/loadMap";
import addControls from "./pages/2-addControls/addControls";
addControls();
map.setTarget("map");
