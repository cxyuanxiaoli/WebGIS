<template>
  <div class='slot'>
    <h3>父组件</h3>
    <!-- 默认插槽 -->
    <div class="content1">
      <SlotDefault title="热门游戏列表">
        <ul v-for="game in games" :key="game.id">
          <li>{{ game.name }}</li>
        </ul>
      </SlotDefault>
      <SlotDefault title="今日美食城市">
        <img :src="imgUrl" alt="">
      </SlotDefault>
      <SlotDefault title="今日影视推荐">
        <video :src="videoUrl" controls></video>
      </SlotDefault>

    </div>
    <!-- 具名插槽 -->
    <div class="content2">
      <SlotName>
        <template v-slot:header>
          <h4>具名插槽</h4>
        </template>
        <template #content>
          <p>具名插槽内容</p>
        </template>
      </SlotName>
      <SlotName>
        <template v-slot:header>
          <h4>具名插槽</h4>
        </template>
      </SlotName>
    </div>
    <!-- 作用域插槽 -->
    <div class="content3">
      <Slotscope>
        <template v-slot="params">
          <ul>
            <li v-for="(day, index) in params.days" :key="index">{{ day }}</li>
          </ul>
        </template>
      </Slotscope>
      <Slotscope>
        <template v-slot="{ days }">
          <ol>
            <li v-for="(day, index) in days" :key="index">{{ day }}</li>
          </ol>
        </template>
      </Slotscope>
      <Slotscope>
        <template #default="{ days }">
          <h6 v-for="(day, index) in days" :key="index">{{ day }}></h6>
        </template>
      </Slotscope>
    </div>
  </div>
</template>

<script lang='ts' setup>
import SlotDefault from '@/components/SlotDefault.vue';
import SlotName from '@/components/SlotName.vue';
import Slotscope from '@/components/Slotscope.vue';

const games = [{
  id: 1, name: '王者荣耀'
}, {
  id: 2, name: '绝地求生'
}, {
  id: 3, name: '英雄联盟'
}, {
  id: 4, name: 'DOTA2'
}]
const imgUrl = 'https://z1.ax1x.com/2023/11/19/piNxLo4.jpg'
const videoUrl = 'http://flv4mp4.people.com.cn/videofile7/pvmsvideo/2021/12/16/QiangGuoLunTan-ZhouJing_bb603bf08843f480355ee52737b6a27c_ms_hd.mp4'

</script>

<style scoped>
.slot {
  margin: 30px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  background-color: #a7a7a7;
}

.content1 {
  display: flex;
  justify-content: space-around;
}

img,
video {
  width: 100%;
}

.content2,
.content3 {
  display: flex;
  justify-content: space-around;
}
</style>