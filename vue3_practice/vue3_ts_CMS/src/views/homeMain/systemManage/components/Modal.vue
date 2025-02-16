<template>
  <div class="modal">
    <el-dialog v-model="dialogVisible" title="新增用户信息" width="35%" center append-to-body>
      <div class="dialog-body">
        <el-form :model="form" label-width="65px" size="large" :rules="rules" ref="formRef">
          <el-form-item label="用户名" label-width="" prop="username">
            <el-input v-model="form.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="姓名" label-width="" prop="realname">
            <el-input v-model="form.realname" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" label-width="" prop="tel">
            <el-input v-model="form.tel" autocomplete="off" />
          </el-form-item>
          <el-form-item label="角色" label-width="" prop="role">
            <el-select v-model="form.role" placeholder="Select" style="width: 240px">
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" label-width="" prop="depart">
            <el-select v-model="form.depart" style="width: 240px">
              <el-option label="请选择" :value="0"></el-option>
              <el-option
                v-for="item in departList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddUser"> 添加 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getRoleListRequest } from '@/request/home/systemManage/roleMana'
import { getDepartListRequest } from '@/request/home/systemManage/departMana'
import { postAddUserRequest } from '@/request/home/systemManage/userMana'
import { computed, ref, onMounted } from 'vue'
import type { IDepart, IUser } from '@/types'
import { ElForm, ElMessage } from 'element-plus'

//由父组件控制弹窗显示
const props = defineProps(['visible'])
const emits = defineEmits(['close', 'get-list'])
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emits('close', val)
  },
})
//表单数据
const formRef = ref<InstanceType<typeof ElForm>>()
const form = ref<IUser>({
  username: '',
  realname: '',
  tel: '',
  role: '',
  depart: 0,
})
//表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  depart: [{ required: true, message: '请选择部门', trigger: 'change' }],
}
//服务器返回的列表数据
const roleList = ref([])
const departList = ref<IDepart[]>([])
//请求数据
onMounted(() => {
  getRoleListRequest().then((res) => {
    roleList.value = res.data
  })
  getDepartListRequest().then((res) => {
    departList.value = res.data
  })
})

//添加用户按钮点击事件
async function handleAddUser() {
  try {
    await formRef.value?.validate()
  } catch (err: any) {
    ElMessage.error('表单验证失败' + err.message)
    return
  }
  postAddUserRequest(form.value).then((res) => {
    ElMessage.success(res.message)
    emits('get-list') //刷新列表数据
    dialogVisible.value = false
  })
}
</script>

<style scoped>
.dialog-body {
  padding: 0 30px;
}
</style>
