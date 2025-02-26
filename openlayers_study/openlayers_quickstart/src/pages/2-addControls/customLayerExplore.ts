import { map } from "../1-loadMap/loadMap";
export default function addCustomLayerExplore() {
  console.log("addCustomLayerExplore");
  let radius = 75;

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      radius = Math.min(radius + 5, 150);
      map.render();
      console.log("up");

      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      radius = Math.max(radius - 5, 25);
      map.render();
      event.preventDefault();
      console.log("down");
      console.log(map.getLayers());
    }
  });

  let mousePosition: any = null;
  document.querySelector("#map")?.addEventListener("mousemove", (event) => {
    mousePosition = map.getEventPixel(event as UIEvent);
    map.render();
  });
  document.querySelector("#map")?.addEventListener("mouseout", (event) => {
    mousePosition = null;
    map.render();
  });

  const bottomLayer = map.getLayers().item(0);
  const topLayer: any = map.getLayers().item(1);

  topLayer.on("precompose", (event: any) => {
    let ctx = event.context;
    let pixelRatio = event.frameState.pixelRatio;
    console.log(pixelRatio);

    ctx.save();
    ctx.beginPath();
    if (mousePosition) {
      ctx.arc(
        mousePosition[0] * pixelRatio,
        mousePosition[1] * pixelRatio,
        radius * pixelRatio,
        0,
        2 * Math.PI
      );
      ctx.lineWidth = 5 * pixelRatio;
      ctx.strokeStyle = "red";
      ctx.stroke();
    }
    ctx.clip();
  });

  topLayer.on("postcompose", (event: any) => {
    let ctx = event.context;
    ctx.restore();
  });
}
