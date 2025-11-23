import { computed, ref } from 'vue';
// import { getRightPieData } from '@/request/dataRequest';

export default function () {
  let data = ref([
    {
      value: 0.7,
      name: '等级',
    },
  ]);
  const option = computed(() => ({
    title: {
      text: '仪表盘',
      left: 'center',
      textStyle: {
        color: 'rgba(255,255,255,0.7)',
      },
    },
    toolbox: {
      // show: true,
      orient: 'vertical',
      // left: 0,
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
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '90%'],
        radius: '120%',
        min: 0,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.25, '#FF6E76'],
              [0.5, '#FDDD60'],
              [0.75, '#58D9F9'],
              [1, '#7CFFB2'],
            ],
          },
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '8%',
          width: 10,
          offsetCenter: [0, '-55%'],
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          length: 10,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5,
          },
        },
        progress: {
          show: true,
          itemStyle: {
            color: '#ffffff5d',
          },
        },
        axisLabel: {
          color: '#57aeffff',
          fontSize: 20,
          distance: -50,
          rotate: 'tangential',
          formatter: function (value) {
            if (value === 0.875) {
              return '等级 A';
            } else if (value === 0.625) {
              return '等级 B';
            } else if (value === 0.375) {
              return '等级 C';
            } else if (value === 0.125) {
              return '等级 D';
            }
            return '';
          },
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 20,
          fontWeight: 'bolder',
          color: '#0084ffff',
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value * 100) + '';
          },
          color: 'inherit',
        },
        data: data.value,
      },
    ],
    backgroundColor: '#ffffff0f',
  }));

  function updateData() {
    data.value = [
      {
        value: Math.random(),
        name: '等级',
      },
    ];
  }

  return {
    option,
    updateData,
  };
}
