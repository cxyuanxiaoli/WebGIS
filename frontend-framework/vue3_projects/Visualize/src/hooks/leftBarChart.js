import { computed, ref } from 'vue';
import { graphic } from 'echarts/core';
import { getLeftBarData } from '@/request/dataRequest';

export default function () {
  let data = ref([220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149]);
  const option = computed(() => ({
    title: {
      text: '柱状图',
      left: 'center',
      textStyle: {
        color: 'rgba(255,255,255,0.7)',
      },
      // subtext: 'Feature Sample',
    },
    tooltip: {
      trigger: 'axis',
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
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      axisLabel: {
        inside: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: true,
      },
      axisLabel: {
        color: '#999',
      },
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        type: 'bar',
        showBackground: true,
        itemStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
        data: data.value,
      },
    ],
    backgroundColor: '#ffffff0f',
  }));

  function updateData() {
    getLeftBarData().then((res) => {
      data.value = res.data;
    });
  }

  return {
    option,
    updateData,
  };
}
