import { fromLonLat } from "ol/proj";
import { map } from "../1-loadMap/loadMap";
export default function addCustomBaseControls() {
  if (map) {
    document.getElementById("sca-min")?.addEventListener("click", () => {
      //缩小
      const view = map.getView();
      const currentZoom = view.getZoom() as number;
      view.setZoom(currentZoom - 1);
    });

    document.getElementById("sca-max")?.addEventListener("click", () => {
      //放大
      const view = map.getView();
      const currentZoom = view.getZoom() as number;
      view.setZoom(currentZoom + 1);
    });

    document.getElementById("pan")?.addEventListener("click", () => {
      //平移至中国
      const view = map.getView();
      const center = fromLonLat([116, 36]);
      view.setCenter(center);
    });

    document.getElementById("reset")?.addEventListener("click", () => {
      //重置为原始状态
      const view = map.getView();
      view.setCenter(fromLonLat([116, 36])); //重置中心点
      view.setZoom(5); //重置缩放级别
      view.setRotation(0); //重置旋转角度
    });
  }
}
