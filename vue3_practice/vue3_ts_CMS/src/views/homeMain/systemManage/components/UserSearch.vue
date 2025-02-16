<template>
  <div class="user-search">
    <el-form label-width="80px" size="large" :model="searchUser">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="用户名">
            <el-input v-model="searchUser.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input v-model="searchUser.realname" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号">
            <el-input v-model="searchUser.tel" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchUser.status" placeholder="全部">
              <el-option :value="''" label="全部"></el-option>
              <el-option :value="true" label="启用"> </el-option>
              <el-option :value="false" label="禁用"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchUser.createTimeRange"
              type="daterange"
              unlink-panels
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-button type="default" @click="resetSearch">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="searchSubmit">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useUserManaStore } from '@/store/home/systemManage/userMana'
import { storeToRefs } from 'pinia'

//获取用户管理store
const userManaStore = useUserManaStore()
const { searchUser } = storeToRefs(userManaStore)
//查询用户列表
function searchSubmit() {
  userManaStore.getUserList()
}
//重置搜索条件
function resetSearch() {
  userManaStore.resetSearch()
}
</script>

<style scoped></style>
