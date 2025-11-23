import { computed, ref } from 'vue';
import { getCenterTextData } from '@/request/dataRequest';

export default function () {
  const data = ref({
    total: 1000,
    today: 100,
  });
  const keyframeAnimation = {
    duration: 18000,
    loop: true,
    keyframes: [
      {
        percent: 0.1,
        style: {
          fill: '#ffffffa0',
          lineDashOffset: 200,
          lineDash: [200, 0],
        },
      },
      {
        // Stop for a while.
        percent: 0.2,
        style: {
          fill: '#ffffffa0',
        },
      },
      {
        percent: 1,
        style: {
          fill: '#ffffffd0',
          lineDashOffset: 200,
          lineDash: [200, 0],
        },
      },
    ],
  };
  const option = computed(() => ({
    graphic: {
      elements: [
        {
          type: 'text',
          left: '15.5%',
          top: 'center',
          style: {
            text: data.value.total,
            fontSize: 50,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#3a89ffff',
            lineWidth: 1,
          },
          keyframeAnimation,
        },
        {
          type: 'text',
          right: '17.8%',
          top: 'center',
          width: '50%',
          style: {
            text: data.value.today,
            textAlign: 'center',
            fontSize: 50,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#3a89ffff',
            lineWidth: 1,
          },
          keyframeAnimation,
        },
      ],
    },
  }));

  function updateData() {
    getCenterTextData().then((res) => {
      data.value = res.data;
    });
  }

  return {
    option,
    updateData,
  };
}
