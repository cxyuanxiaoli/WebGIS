import { computed, ref } from 'vue';
// import { getRightPieData } from '@/request/dataRequest';

export default function () {
  const data = ref([]);

  let now = new Date(2025, 1, 1);
  const oneDay = 24 * 3600 * 1000;
  let value = Math.random() * 100;
  function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(value),
      ],
    };
  }
  //初始化数据
  for (let i = 0; i < 30; i++) {
    data.value.push(randomData());
  }
  //定时更新数据
  setInterval(function () {
    for (var i = 0; i < 2; i++) {
      data.value.shift();
      data.value.push(randomData());
    }
  }, 2000);

  const option = computed(() => ({
    title: {
      text: '动态折线图',
      left: 'center',
      textStyle: {
        color: 'rgba(255,255,255,0.7)',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        const date = new Date(params.name);
        return (
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          ' : ' +
          params.value[1]
        );
      },
      axisPointer: {
        animation: false,
      },
    },
    toolbox: {
      left: 0,
      feature: {
        dataView: {
          show: true,
          title: '数据视图',
          readOnly: false,
          lang: ['数据视图', '关闭', '刷新'],
        },
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
    grid: {
      left: '5%',
      top: '17%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: data.value,
      },
    ],
    backgroundColor: '#ffffff0f',
  }));

  function updateData() {}

  return {
    option,
    updateData,
  };
}
