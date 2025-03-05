import Map from "ol/Map";
import { Feature, Overlay } from "ol";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Style } from "ol/style";

export default function addPopupMarker(map: Map) {
  //添加点图层
  const beijing = fromLonLat([116.46, 39.92]);
  const shanghai = fromLonLat([121.48, 31.22]);
  const f1 = new Feature({
    geometry: new Point(beijing),
    info: {
      title: "北京市",
      titleUrl:
        "https://baike.baidu.com/item/%e5%8c%97%e4%ba%ac%e5%b8%82/126069",
      text:
        "北京，简称京，是中华人民共和国的首都，也是全国政治、经济、" +
        "文化、科技、教育、卫生、交通、农业、金融、航空、国防军事等领域的中心城市。",
      imgUrl: "https://img.shetu66.com/2023/05/15/1684144616881709.png",
    },
  });
  const f2 = new Feature({
    geometry: new Point(shanghai),
    info: {
      title: "上海市",
      titleUrl:
        "https://baike.baidu.com/item/%E4%B8%8A%E6%B5%B7%E5%B8%82/127743",
      text:
        "上海市，简称“沪”，是中华人民共和国直辖市，位于中国东部，地处长江入海口，境域北界长江，" +
        "东濒东海，南临杭州湾，西接江苏省和浙江省，总面积6340.5平方千米，下辖16个区。",
      imgUrl: "https://www.shanghai.gov.cn/assets2020/img/yshj-2.jpg",
    },
  });
  const layer = new VectorLayer({
    source: new VectorSource({
      features: [f1, f2],
    }),
    style: new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: "red",
        }),
      }),
    }),
  });
  map.addLayer(layer);

  //创建popup载体
  const container = document.createElement("div");
  container.className = "ol-popup";
  const closer = document.createElement("a");
  closer.className = "ol-popup-closer";
  closer.innerHTML = "✖";
  const content = document.createElement("div");
  container.appendChild(closer);
  container.appendChild(content);

  //创建popup
  const popup = new Overlay({
    element: container,
    //控制当弹出窗口显示时，地图是否自动平移以确保弹出窗口完全可见
    autoPan: {
      animation: { duration: 250 },
    },
    offset: [0, -12],
    positioning: "bottom-center",
    stopEvent: false,
  });
  map.addOverlay(popup);

  //添加关闭popup按钮事件
  closer.onclick = () => {
    popup.setPosition(undefined);
    closer.blur();
    return false; //阻止默认行为，阻止事件冒泡
  };

  //添加地图点击事件，展示要素信息
  map.on("click", (e) => {
    const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
    if (feature) {
      content.innerHTML = "";
      //向content中添加要素信息
      addFeatureInfo(feature.get("info"), content);
      //设置popup位置
      const point = feature.getGeometry() as Point;
      popup.setPosition(point.getCoordinates());
    }
  });
  //添加鼠标移动事件，当移动到要素上时，更改鼠标样式
  map.on("pointermove", (e) => {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? "pointer" : "default";
  });
}

function addFeatureInfo(featureInfo: any, content: HTMLElement) {
  const elemA = document.createElement("a");
  elemA.href = featureInfo.titleUrl;
  elemA.target = "_blank";
  setInnerText(elemA, featureInfo.title);
  elemA.innerText = featureInfo.title;
  content.appendChild(elemA);
  const elemDiv = document.createElement("div");
  content.appendChild(elemDiv);
  setInnerText(elemDiv, featureInfo.text);
  const elemImg = document.createElement("img");
  elemImg.src = featureInfo.imgUrl;
  elemImg.style.width = "100%";
  content.appendChild(elemImg);
}

function setInnerText(elem: HTMLElement, text: string) {
  if (typeof elem.textContent === "string") {
    elem.textContent = text;
  } else {
    elem.innerText = text;
  }
}
