import { computed, ref } from 'vue';
import { getRightPieData } from '@/request/dataRequest';

export default function () {
  let data = ref([
    { value: 40, name: '1区' },
    { value: 33, name: '2区' },
    { value: 28, name: '3区' },
    { value: 22, name: '4区' },
    { value: 20, name: '5区' },
    { value: 15, name: '6区' },
  ]);
  const option = computed(() => ({
    title: {
      text: '南丁格尔玫瑰图',
      left: 'center',
      textStyle: {
        color: 'rgba(255,255,255,0.7)',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      left: 'center',
      top: 'bottom',
      data: data.value.map((item) => item.name),
      textStyle: {
        color: 'rgba(136, 136, 136, 0.78)',
      },
    },
    toolbox: {
      orient: 'vertical',
      top: 30,
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
    series: [
      {
        name: '玫瑰图',
        type: 'pie',
        radius: [30, 90],
        center: ['50%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        data: data.value,
      },
    ],
    backgroundColor: '#ffffff0f',
  }));

  function updateData() {
    getRightPieData().then((res) => {
      data.value = res.data;
    });
  }

  return {
    option,
    updateData,
  };
}
