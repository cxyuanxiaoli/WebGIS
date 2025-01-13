<template>
  <div class="main">
    <div class="newslist">
      <h2>News</h2>
      <ul>
        <li v-for="item in news" :key="item.id">
          <button @click="showDetail(item)">查看详情</button>
          <!-- query参数传递 -->
          <!-- first method -->
          <!-- <RouterLink :to="`/news/detail?id=${item.id}&title=${item.title}&content=${item.content}`" active-class="active">{{ item.title }}</RouterLink> -->
          <!-- second method -->
          <!-- <RouterLink :to="{
            name: 'xijie',
            query: {
              id: item.id,
              title: item.title,
              content: item.content
            }
          }" active-class="active">{{ item.title }}</RouterLink> -->

          <!-- params参数传递 -->
          <!-- first method -->
          <!-- <RouterLink :to="`/news/detail/${item.id}/${item.title}/${item.content}`">{{ item.title }}</RouterLink> -->
          <!-- second method -->
          <RouterLink :to="{
            name: 'xijie',
            params: {
              id: item.id,
              title: item.title,
              content: item.content
            }
          }">{{ item.title }}</RouterLink>
        </li>
      </ul>
    </div>
    <div class="detail">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="News">
import { RouterView, RouterLink, useRouter } from 'vue-router';

let news = [{ id: 'sadqwdqwd01', title: 'news1', content: 'content1' },
{ id: 'sadqwdqwd02', title: 'news2', content: 'content2' },
{ id: 'sadqwdqwd03', title: 'news3', content: 'content3' }
]

interface NewsItem {
  id: string
  title: string
  content: string
}

const router = useRouter()
function showDetail(item: NewsItem) {
  router.push({
    name: 'xijie',
    params: {
      id: item.id,
      title: item.title,
      content: item.content
    }
  })
}
</script>

<style scoped>
li {
  list-style: none;
}

.main {
  display: flex;
  height: 100%;
}

.newslist {
  width: 20%;

  a {
    text-decoration: none;
    color: rgb(51, 132, 255);
  }

  .active {
    color: #002d86;
  }
}

.detail {
  margin-top: 50px;
  width: 80%;
  border: 1px solid #8b8b8b;
  border-radius: 5px;
}
</style>