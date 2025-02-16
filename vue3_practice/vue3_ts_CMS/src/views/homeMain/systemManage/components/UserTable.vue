<template>
  <div class="user-table">
    <!-- 添加用户弹窗 -->
    <div class="title">
      <b>用户列表</b>
      <el-button type="primary" size="default" @click="handleAddUser">新增用户</el-button>
    </div>
    <Modal
      v-if="addUserDialogVisible"
      :visible="addUserDialogVisible"
      @close="updateAddDialogVisible"
      @get-list="userManaStore.getUserList"
    ></Modal>
    <!-- 用户表格 -->
    <el-table :data="userlist" border stripe style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="realname" label="姓名" width="130" />
      <el-table-column label="状态" width="75">
        <template #default="{ row }">
          <el-tag v-show="row.status" type="primary" size="large">启用</el-tag>
          <el-tag v-show="!row.status" type="danger" size="large">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="手机号" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDeleteUser(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      layout="sizes,prev,pager, next,total"
      :page-sizes="[10, 20, 30, 40, 50]"
      :current-page="offset + 1"
      v-model:page-size="pageSize"
      :total="totalCount"
      size="small"
      @current-change="(num) => (offset = num - 1)"
      @change="userManaStore.getUserList"
      hide-on-single-page
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserManaStore } from '@/store/home/systemManage/userMana'
import { storeToRefs } from 'pinia'
import Modal from './Modal.vue'
import { deleteUserRequest } from '@/request/home/systemManage/userMana'
import { ElMessage, ElMessageBox } from 'element-plus'
//获取用户管理store
const userManaStore = useUserManaStore()
//获取初始用户列表
userManaStore.getUserList()
//获取用户列表和分页信息
const { userlist, pageSize, totalCount, offset } = storeToRefs(userManaStore)

// 新增用户弹窗状态
const addUserDialogVisible = ref(false)
//显示新增用户弹窗
function handleAddUser() {
  addUserDialogVisible.value = true
}
//更新新增用户弹窗状态
function updateAddDialogVisible(val: boolean) {
  addUserDialogVisible.value = val
}
//删除用户
function handleDeleteUser(id: number) {
  ElMessageBox.confirm('确认删除用户？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteUserRequest(id).then((res) => {
        ElMessage.success(res.message)
        userManaStore.getUserList()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>

<style scoped>
.title {
  display: flex;
  font-size: large;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
