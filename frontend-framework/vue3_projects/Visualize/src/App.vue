<script setup>
import { onMounted } from 'vue';
import Header from './components/Header.vue';
import AsyncChart from './components/charts/AsyncChart.vue';
import leftBarChart from './hooks/leftBarChart';
import rightPieChart from './hooks/rightPieChart';
import leftScatChart from './hooks/leftScatChart';
import leftLineChart from './hooks/leftLineChart';
import rightGaugeChart from './hooks/rightGaugeChart';
import rightGraphChart from './hooks/rightGraphChart';
import centerMapChart from './hooks/centerMapChart';
import centerText from './hooks/centerText';
import MyCharts from './components/charts/MyChart.vue';

onMounted(() => {
  console.log('App mounted');
});
</script>

<template>
  <div>
    <Header></Header>
    <div class="content">
      <div class="left">
        <div class="left-top">
          <async-chart :method="leftBarChart"></async-chart>
        </div>
        <div class="left-center">
          <async-chart :method="leftLineChart"></async-chart>
        </div>
        <div class="left-bottom">
          <async-chart :method="leftScatChart"></async-chart>
        </div>
      </div>
      <div class="center">
        <div class="center-top">
          <dv-border-box-8
            :dur="5"
            backgroundColor="#ffffff0a"
            class="center-top-chart"
          >
            <Suspense>
              <MyCharts :method="centerText"></MyCharts>
            </Suspense>
          </dv-border-box-8>
          <div class="center-top-title total">接口访问总量</div>
          <div class="center-top-title today">今日访问量</div>
        </div>
        <div class="center-body">
          <div class="bg1"></div>
          <div class="bg2"></div>
          <div class="map-chart">
            <dv-border-box-6>
              <Suspense>
                <MyCharts :method="centerMapChart"></MyCharts>
              </Suspense>
            </dv-border-box-6>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-top">
          <async-chart :method="rightPieChart"></async-chart>
        </div>
        <div class="right-center">
          <async-chart :method="rightGaugeChart"></async-chart>
        </div>
        <div class="right-bottom">
          <async-chart :method="rightGraphChart"></async-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  height: 90.25vh;
  display: flex;
  justify-content: space-between;
  /* background-color: #ffffff1f; */
}

.left,
.right {
  width: 27.25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    height: 32.5%;
  }
}

.center {
  width: 45%;

  .center-top {
    height: 15%;
    position: relative;
    overflow: hidden;
    .center-top-chart {
      height: 70%;
    }
    .center-top-title {
      position: absolute;
      top: 70%;
      font-size: 100%;
      color: aliceblue;
    }
    .total {
      left: 25%;
      transform: translateX(-50%);
    }
    .today {
      right: 25%;
      transform: translateX(50%);
    }
  }

  .center-body {
    height: 85%;
    position: relative;
    background-image: url('./assets/images/map.png');
    background-size: calc(80% - 25px);
    background-position: center center;
    background-repeat: no-repeat;

    .bg1,
    .bg2 {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-position: center center;
      background-repeat: no-repeat;
      opacity: 0.5;
    }
    .bg1 {
      background-image: url('./assets/images/lbx.png');
      animation: rotate1 20s linear infinite;
      background-size: calc(90%);
    }
    .bg2 {
      background-image: url('./assets/images/jt.png');
      animation: rotate2 20s linear infinite;
      background-size: calc(83%);
    }

    .map-chart {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes rotate1 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate2 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
