<template>
  <div class="user-table">
    <div class="title">
      <b>用户列表</b>
      <el-button type="primary" size="default" @click="handleDialog()">新增用户</el-button>
    </div>
    <!-- 添加/编辑用户信息弹窗 -->
    <Modal
      v-if="dialogVisible"
      :visible="dialogVisible"
      :isAddModal="isAddDialog"
      :form="formData"
      @close="updateDialogVisible"
      @get-list="userManaStore.getUserList"
    ></Modal>
    <!-- 用户表格 -->
    <el-table :data="userlist" border stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="realname" label="姓名" width="130" />
      <el-table-column label="状态" width="75">
        <template #default="{ row }">
          <el-tag v-if="row.status" type="primary" size="large">启用</el-tag>
          <el-tag v-if="!row.status" type="danger" size="large">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="手机号" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="depart.name" label="部门" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="handleDialog(row)">编辑</el-button>
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
import { reactive, ref, toRaw } from 'vue'
import { useUserManaStore } from '@/store/home/systemManage/userMana'
import { storeToRefs } from 'pinia'
import Modal from './Modal.vue'
import { deleteUserRequest } from '@/request/home/systemManage/userMana'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { IUser } from '@/types'

//获取store
const userManaStore = useUserManaStore()

//获取用户列表和分页信息
userManaStore.getUserList()
const { userlist, pageSize, totalCount, offset } = storeToRefs(userManaStore)

// 新增用户弹窗状态及是否为添加用户弹窗
const dialogVisible = ref(false)
const isAddDialog = ref(true)

//单行数据
const formData = reactive<IUser>({
  id: 0,
  username: '',
  realname: '',
  tel: '',
  role: '',
  depart: {
    id: 0,
    name: '',
  },
  status: true,
})

//处理弹窗事件
function handleDialog(user?: IUser) {
  //编辑用户弹窗
  if (user) {
    console.log(user)
    Object.assign(formData, toRaw(user))
    isAddDialog.value = false
  } else {
    //新增用户弹窗，重置表单
    Object.assign(formData, {
      id: 0,
      username: '',
      realname: '',
      tel: '',
      role: '',
      depart: {
        id: 0,
        name: '',
      },
      status: true,
    })
    isAddDialog.value = true
  }
  //显示弹窗
  dialogVisible.value = true
}

//更新弹窗状态
function updateDialogVisible(val: boolean) {
  dialogVisible.value = val
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
