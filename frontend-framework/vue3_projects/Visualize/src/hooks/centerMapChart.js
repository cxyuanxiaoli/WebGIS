import { computed, ref } from 'vue';
import { getCenterMapData } from '@/request/dataRequest';

export default function () {
  const data = ref({
    lines: [
      {
        from: '西安',
        to: '北京',
        coords: [
          [109.1162, 34.2004],
          [116.4551, 40.2539],
        ],
      },
      {
        from: '西安',
        to: '上海',
        coords: [
          [109.1162, 34.2004],
          [121.4648, 31.2891],
        ],
      },
    ],
    cities: [
      {
        name: '西安',
        value: [109.1162, 34.2004],
      },
      {
        name: '北京',
        value: [116.4551, 40.2539],
      },
      {
        name: '上海',
        value: [121.4648, 31.2891],
      },
    ],
  });

  const planePath =
    'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

  const color = ['#ff351fff', '#ff9501ff', '#7c2fffff', '#ff2ba3ff']; //航线的颜色

  const option = computed(() => ({
    title: {
      text: '航线图',
      textStyle: {
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: 1000,
        fontSize: 24,
      },
      left: 'center',
      top: 10,
    },
    toolbox: {
      left: 10,
      bottom: 10,
      feature: {
        restore: {
          show: true,
          title: '还原',
        },
        saveAsImage: {
          show: true,
          title: '保存为图片',
        },
      },
    },
    geo: {
      map: 'china',
      roam: 'zoom',
      zoom: 1.2,
      scaleLimit: {
        min: 0.6,
        max: 5,
      },
      label: {
        show: false,
        textBorderColor: '#fff',
        textBorderWidth: 2,
      },
      itemStyle: {
        areaColor: '#529affff',
        // color: '#fff',
        borderColor: '#fff',
      },
      emphasis: {
        disabled: false,
        focus: 'none',
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: '#71aaffff',
          // color: '#fff',
        },
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params, ticket, callback) {
        if (params.seriesType == 'effectScatter') {
          return '线路：' + params.data.name;
        } else if (params.seriesType == 'lines') {
          return params.data.from + '>' + params.data.to;
        } else {
          return params.name;
        }
      },
    },
    legend: {
      bottom: 15,
      itemGap: 30,
      left: 'center',
      // data: ['西安 Top3', '西宁 Top3', '银川 Top3'],
      textStyle: {
        color: '#aaaaaaff',
      },
      selectedMode: 'multiple',
    },
    series: [
      {
        name: '航线',
        type: 'lines',
        zlevel: 1,
        animation: false,
        effect: {
          show: true,
          // period: 6,
          constantSpeed: 30,
          symbol: 'none',
          trailLength: 0,
          // color: 'red', //arrow箭头的颜色
          symbol: planePath,
          symbolSize: 20,
        },
        lineStyle: {
          color: color[Math.floor(Math.random() * color.length)],
          width: 2,
          curveness: 0.1,
        },
        data: data.value.lines,
      },
      {
        name: '城市',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'fill',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{b}',
          color: '#c0ffc0ff',
          fontSize: 15,
        },
        symbolSize: 11,
        itemStyle: {
          color: '#6fff89ff',
        },
        data: data.value.cities,
      },
    ],
  }));

  getCenterMapData().then((res) => {
    data.value = res.data;
  });

  setInterval(() => {
    getCenterMapData().then((res) => {
      data.value = res.data;
    });
  }, 1000 * 60 * 1);

  return {
    option,
    updateData: () => {},
  };
}
