import { fromLonLat } from "ol/proj";
import { map } from "../1-loadMap/loadMap";
import { easeIn, easeOut } from "ol/easing";

export default function addCustomAnimationControl() {
  const view = map.getView();

  const shenyang = fromLonLat([123.429, 41.8956]);
  const beijing = fromLonLat([116.469, 39.915]);
  const shanghai = fromLonLat([121.4737, 31.2304]);
  const wuhan = fromLonLat([114.266, 30.5928]);
  const guangzhou = fromLonLat([113.2345, 23.1626]);
  //旋转定位
  document.querySelector("#spin")?.addEventListener("click", () => {
    view.animate(
      {
        rotation: Math.PI,
        easing: easeIn,
      },
      {
        center: shenyang,
        rotation: 2 * Math.PI,
        easing: easeOut,
      }
    );
  });
  //弹性伸缩定位
  document.querySelector("#elastic")?.addEventListener("click", () => {
    view.animate({
      center: beijing,
      duration: 2000,
      //控制的动画持续时间函数
      easing: (t) => {
        return (
          Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) +
          1
        );
      },
    });
  });
  //反弹定位
  document.querySelector("#bounce")?.addEventListener("click", () => {
    view.animate({
      center: shanghai,
      duration: 2000,
      easing: (t) => {
        let s = 7.5625;
        let p = 2.75;
        let l;
        if (t < 1 / p) {
          l = s * t * t;
        } else {
          if (t < 2 / p) {
            t -= 1.5 / p;
            l = s * t * t + 0.75;
          } else {
            if (t < 2.5 / p) {
              t -= 2.25 / p;
              l = s * t * t + 0.9375;
            } else {
              t -= 2.625 / p;
              l = s * t * t + 0.984375;
            }
          }
        }
        return l;
      },
    });
  });
  //自旋定位
  document.querySelector("#rotate")?.addEventListener("click", () => {
    const mapRotate = view.getRotation();
    view.animate(
      {
        rotation: mapRotate + Math.PI,
        anchor: wuhan,
        easing: easeIn,
      },
      {
        rotation: mapRotate + 2 * Math.PI,
        anchor: wuhan,
        easing: easeOut,
      }
    );
  });
  //飞行定位
  document.querySelector("#fiy")?.addEventListener("click", () => {
    const duration = 2000;
    const mapZoom = map.getView().getZoom() as number;
    //平移动画
    view.animate({
      center: guangzhou,
      duration: duration,
    });
    //缩放动画
    view.animate(
      {
        zoom: mapZoom - 2,
        duration: duration / 2,
      },
      {
        zoom: mapZoom,
        duration: duration / 2,
      }
    );
  });
}
