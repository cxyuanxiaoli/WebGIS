import { computed, ref } from 'vue';
import { getRightGraphData } from '@/request/dataRequest';

export default function () {
  const data = ref({
    nodes: [
      {
        id: 'root',
        name: 'root',
        size: 10,
      },
      {
        id: 'vue',
        name: 'vue',
        size: 20,
      },
    ],
    edges: [
      {
        sourceID: 'root',
        targetID: 'vue',
      },
    ],
  });

  const type = ref('前端');

  const option = computed(() => ({
    title: {
      text: `NPM 依赖关系图-${type.value}`,
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
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          roam: 'scale',
          draggable: true,
        },
        label: {
          show: true,
          formatter: (params) => {
            if (params.data.symbolSize > 10) {
              return params.data.name;
            }
          },
        },
        data: data.value.nodes.map((node) => ({
          ...node,
          itemStyle: {
            color: node.color,
          },
        })),
        edges: data.value.edges,
        emphasis: {
          focus: 'adjacency',
          label: {
            position: 'right',
            show: true,
            formatter: (params) => {
              return params.data.name;
            },
          },
        },
        roam: true,
        roamTrigger: 'global',
        lineStyle: {
          color: '#969696ff',
          width: 0.7,
          curveness: 0.3,
          opacity: 0.7,
        },
      },
    ],
    backgroundColor: '#ffffff0f',
  }));

  getRightGraphData('front').then((res) => {
    data.value = res.data;
  });
  function updateData() {}
  setInterval(() => {
    if (type.value == '前端') {
      type.value = '后端';
      getRightGraphData('back').then((res) => {
        data.value = res.data;
      });
    } else {
      type.value = '前端';
      getRightGraphData('front').then((res) => {
        data.value = res.data;
      });
    }
  }, 1000 * 30);

  return {
    option,
    updateData,
  };
}
