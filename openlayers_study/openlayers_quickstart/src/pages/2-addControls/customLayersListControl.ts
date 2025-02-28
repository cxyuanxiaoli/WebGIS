import { map } from "../1-loadMap/loadMap";

export default function customLayersListControl() {
  const layers = map.getLayers();
  const layersListElem = document.querySelector(
    ".layer-control ul"
  ) as HTMLElement;
  for (let i = 0; i < layers.getLength(); i++) {
    //获取各图层的名称和可见性
    const layer = layers.item(i);
    const layerName = layer.get("name");
    const layerVisible = layer.getVisible();
    //创建li元素
    let li = document.createElement("li");
    let label = document.createElement("label");
    label.innerText = layerName;
    //创建checkbox元素，用于控制图层的可见性
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = layerVisible;
    checkbox.name = "layers";
    //将checkbox和label添加到li元素中，并添加到ul元素中
    layersListElem?.appendChild(li);
    li.appendChild(checkbox);
    li.appendChild(label);

    //为checkbox添加change事件，用于控制图层的可见性
    checkbox.addEventListener("change", function () {
      layer.setVisible(checkbox.checked);
    });
  }
  // map.once("change:layergroup", () => {
  //   //去除所有的li元素
  //   while (layersListElem.firstChild) {
  //     layersListElem.removeChild(layersListElem.firstChild);
  //   }
  //   console.log("layergroup changed");

  //   customLayersListControl();
  // });
}
