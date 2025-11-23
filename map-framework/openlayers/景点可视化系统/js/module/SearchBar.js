import { MapBrowserEvent } from "./MyOpenlayers.js";
import { Map } from "./MyOpenlayers.js";

/**
 * @constant {Array} suggestions 存储搜索建议
 */
const suggestions = [];

/**
 * @async 异步获取搜索建议
 */
fetch("../../data/4A景点.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      suggestions.push({
        name: item["景区名称"],
        center: [item["经度"], item["纬度"]],
      });
    });
  });

/**
 * @function init 初始化搜索栏
 * @param {Map} map
 */
const init = (map) => {
  const input = document.querySelector(".search-input");
  const suggestionsList = document.querySelector(".suggestions");
  const clearButton = document.querySelector("#clear-btn");
  const searchButton = document.querySelector("#search-btn");

  input.oninput = () => {
    const value = input.value.trim();
    suggestionsList.innerHTML = "";
    if (value) {
      const filteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.name.includes(value)
      );
      filteredSuggestions.forEach((suggestion) => {
        const li = document.createElement("li");
        li.textContent = suggestion.name;
        li.onclick = () => {
          input.value = suggestion.name;
          suggestionsList.innerHTML = "";
        };
        suggestionsList.appendChild(li);
      });
    }
  };

  // 清除按钮点击事件
  clearButton.onclick = () => {
    input.value = "";
  };

  // 搜索按钮点击事件
  searchButton.onclick = () => {
    const value = input.value;
    const item = suggestions.find((item) => item.name === value);
    if (item) {
      const center = item.center;
      input.value = "";
      map.getView().animate({
        center: center,
        during: 1000,
      });
      const rect = map.getTargetElement().getBoundingClientRect();
      setTimeout(() => {
        // 触发单击事件
        const pixel = map.getPixelFromCoordinate(center);
        map.dispatchEvent(
          new MapBrowserEvent(
            "singleclick",
            map,
            new MouseEvent("click", {
              clientX: rect.left + pixel[0],
              clientY: rect.top + pixel[1],
            })
          )
        );
      }, 1100);
    }
  };
};

export default {
  init,
};
