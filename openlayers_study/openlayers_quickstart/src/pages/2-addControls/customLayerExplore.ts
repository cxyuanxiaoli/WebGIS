import { map } from "../1-loadMap/loadMap";
import TileLayer from "ol/layer/Tile";
export default function addCustomLayerExplore() {
  //关闭图层探索函数
  let closeLayerExplore: any = null;
  //为图层探索按钮添加点击事件
  document.querySelectorAll(".layer-explore input").forEach((elem) => {
    elem.addEventListener("change", (event: any) => {
      const value = event.target.value;
      if (value === "1") {
        //开启图层探索
        closeLayerExplore = layerExplore();
      } else if (value === "0") {
        //关闭图层探索
        closeLayerExplore();
      }
    });
  });
  //显示图层探索按钮
  document.querySelector(".layer-explore")?.classList.remove("custom-hide");
  //默认开启图层探索，主动触发change事件
  (document.querySelector("#layexon") as HTMLInputElement).dispatchEvent(
    new Event("change")
  );
}

//图层探索功能函数，返回关闭函数
function layerExplore() {
  const mapContainer = map.getTargetElement();
  const topLayer = map.getLayers().item(1) as TileLayer;

  let radius = 75;
  const adjustRadius = (event: any) => {
    if (event.key === "ArrowUp") {
      radius = Math.min(radius + 5, 150);
      map.render(); //重新渲染
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      radius = Math.max(radius - 5, 25);
      map.render();
      event.preventDefault();
    }
  };
  document.addEventListener("keydown", adjustRadius);

  //获取鼠标位置
  let mousePosition: any = null;
  const getMousePosition = (event: any) => {
    mousePosition = map.getEventPixel(event as UIEvent);
    map.render();
  };
  const removeMousePosition = (event: any) => {
    mousePosition = null;
    map.render();
  };
  mapContainer.addEventListener("mousemove", getMousePosition);
  mapContainer.addEventListener("mouseout", removeMousePosition);

  //绘制圆形裁剪上层图层
  const topLayerPreRender = (event: any) => {
    // 获取绘图上下文和像素比例
    let ctx = event.context;
    let pixelRatio = event.frameState.pixelRatio;
    // 保存当前绘图状态
    ctx.save();
    // 开始绘制路径
    ctx.beginPath();
    // 如果鼠标位置存在，绘制一个圆形
    if (mousePosition) {
      ctx.arc(
        mousePosition[0] * pixelRatio,
        mousePosition[1] * pixelRatio,
        radius * pixelRatio,
        0,
        2 * Math.PI
      );
      // 设置圆形的线条宽度和颜色
      ctx.lineWidth = 5 * pixelRatio;
      ctx.strokeStyle = "red";
      // 绘制圆形
      ctx.stroke();
    }
    // 剪切绘图区域，限制后续绘制操作在圆形区域内
    ctx.clip();
  };

  // 图层渲染后恢复绘图状态
  const topLayerPostRender = (event: any) => {
    // 获取绘图上下文
    let ctx = event.context;
    // 恢复之前保存的绘图状态
    ctx.restore();
  };
  topLayer.on("prerender", topLayerPreRender); //绑定图层预渲染事件
  topLayer.on("postrender", topLayerPostRender);

  return function () {
    document.removeEventListener("keydown", adjustRadius);
    mapContainer.removeEventListener("mousemove", getMousePosition);
    mapContainer.removeEventListener("mouseout", removeMousePosition);
    topLayer.un("prerender", topLayerPreRender);
    topLayer.un("postrender", topLayerPostRender);
    map.render();
  };
}
