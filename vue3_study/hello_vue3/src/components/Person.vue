  <template>
    <div class="person">
      <h2>name:{{ name }}</h2>
      <h2>age:{{ age }}</h2>
      <button @click="changeName">changeName</button>
      <button @click="changeAge">changeName</button>
      <button @click="showTel">show Tel</button>
    </div>
  </template>

  <script lang="ts">
  export default{
    name:'Person',
    data(){
      return{
        name:'zhangsan',
        age:20,
        tel:'13800138000'
      }
    },
    methods:{
      changeName(){
        this.name='lisi'
      },
      changeAge(){
        this.age+=1
      },
      showTel(){
        alert(this.tel)
      }
    }

  }
  </script>

  <style scoped>
  .person{
    background-color: skyblue;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    border-radius: 10px;
    padding: 10px;
  }
  button{
    margin: 0 5px;
  }
  </style>