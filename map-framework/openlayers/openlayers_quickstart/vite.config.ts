import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html", // 默认入口
        heatMapPage: "./src/pages/6-advancedFunctions/heatMap/index.html",
        hotAreaPage: "./src/pages/6-advancedFunctions/hotAreas/index.html",
        mapLocationPage:
          "./src/pages/6-advancedFunctions/mapLocation/index.html",
        projTransformPage:
          "./src/pages/6-advancedFunctions/projectionTransform/index.html",
        statisticChartPage:
          "./src/pages/6-advancedFunctions/statisticalChart/index.html",
        viewLinkPage: "./src/pages/6-advancedFunctions/viewLink/index.html", // 其他HTML文件
      },
    },
  },
});
