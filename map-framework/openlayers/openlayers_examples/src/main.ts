import "ol/ol.css";
import "./css/style.css";
import Map from "ol/Map";

const nameMap = [
  {
    name: "Accessible Map",
    label: "快速入门",
    url: "./pages/Accessible_Map.ts",
  },
  {
    name: "TileLayer Debug",
    label: "瓦片图层调试",
    url: "./pages/TileLayer_Debug.ts",
  },
];
renderList();
let map: Map | null = null;
switchMap(nameMap[0].url);

function renderList() {
  const listDiv = document.querySelector(".list");
  if (!listDiv) return;
  const ul = document.createElement("ul");
  nameMap.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item.label;
    li.onclick = () => switchMap(item.url);
    ul.appendChild(li);
  });
  listDiv.appendChild(ul);
}

function switchMap(url: string) {
  if (map) {
    map.setTarget(undefined);
    map.dispose();
  }
  import(/* @vite-ignore */ url).then((module) => {
    map = module.default() as Map;
    map.setTarget(document.getElementById("map") || undefined);
  });
}
