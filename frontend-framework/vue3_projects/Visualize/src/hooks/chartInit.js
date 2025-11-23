import { use, registerMap } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  PieChart,
  BarChart,
  ScatterChart,
  LineChart,
  GaugeChart,
  GraphChart,
  EffectScatterChart,
  LinesChart,
} from 'echarts/charts';
import {
  TitleComponent,
  PolarComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  GeoComponent,
  GraphicComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import china from '@/assets/json/china.json';
// import { THEME_KEY } from 'vue-echarts';
// import { provide } from 'vue';
// provide(THEME_KEY, 'dark');

export default function chartInit() {
  use([
    CanvasRenderer,
    PieChart,
    BarChart,
    ScatterChart,
    LineChart,
    GaugeChart,
    GraphChart,
    EffectScatterChart,
    LinesChart,
    TitleComponent,
    PolarComponent,
    TooltipComponent,
    ToolboxComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    GeoComponent,
    GraphicComponent,
    LabelLayout,
    UniversalTransition,
  ]);

  registerMap('china', china);
}
