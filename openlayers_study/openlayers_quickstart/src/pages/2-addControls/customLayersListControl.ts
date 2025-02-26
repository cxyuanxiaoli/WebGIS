import BaseLayer from "ol/layer/Base";
import { map } from "../1-loadMap/loadMap";

export default function customLayersListControl() {
  const layer: BaseLayer[] = [];
  const layerName: string[] = [];
  const layerVisible: boolean[] = [];
  const layers = map.getLayers();
  const layersListElem = document.querySelector(".layer-control ul");
  for (let i = 0; i < layers.getLength(); i++) {
    //获取各图层的名称和可见性
    layer[i] = layers.item(i);
    layerName[i] = layer[i].get("name");
    layerVisible[i] = layer[i].getVisible();

    //创建li元素
    let li = document.createElement("li");
    let label = document.createElement("label");
    label.innerText = layerName[i];
    //创建checkbox元素，用于控制图层的可见性
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = layerVisible[i];
    checkbox.name = "layers";
    //将checkbox和label添加到li元素中，并添加到ul元素中
    layersListElem?.appendChild(li);
    li.appendChild(checkbox);
    li.appendChild(label);

    //为checkbox添加change事件，用于控制图层的可见性
    checkbox.addEventListener("change", function () {
      layer[i].setVisible(checkbox.checked);
    });
  }
}
