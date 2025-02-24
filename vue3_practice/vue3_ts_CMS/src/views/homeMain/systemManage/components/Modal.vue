<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isAddModal ? '添加用户' : '编辑用户'"
    width="35%"
    center
    append-to-body
  >
    <div class="dialog-body">
      <el-form :model="form" label-width="65px" size="large" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off" :disabled="!isAddModal" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="!isAddModal" label="状态" prop="status">
          <el-select v-model="form.status" style="width: 240px">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="form.tel" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="Select" style="width: 240px">
            <el-option v-for="(item, index) in roleList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="depart">
          <el-select v-model="form.depart.id" style="width: 240px">
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
        <el-button v-if="isAddModal" type="primary" @click="handleAddUser"> 添加 </el-button>
        <el-button v-if="!isAddModal" type="primary" @click="handleAddUser"> 编辑 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getRoleListRequest } from '@/request/home/systemManage/roleMana'
import { getDepartListRequest } from '@/request/home/systemManage/departMana'
import { postAddUserRequest, putEditUserRequest } from '@/request/home/systemManage/userMana'
import { computed, ref, onMounted } from 'vue'
import type { IDepart, IUser } from '@/types'
import { ElForm, ElMessage } from 'element-plus'

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

const emits = defineEmits(['close', 'get-list'])
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emits('close', val)
  },
})

/**
 * @param visible 弹窗是否可见
 * @param isAddModal 是否为新增用户弹窗
 * @param form 表单数据
 */
const props = withDefaults(
  defineProps<{ visible: boolean; isAddModal?: boolean; form?: IUser }>(),
  {
    form: () => ({
      id: 0,
      username: '',
      realname: '',
      tel: '',
      role: '',
      status: true,
      depart: {
        id: 0,
        name: '',
      },
    }),
  },
)
const form = ref(props.form)

//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
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

//确认按钮点击事件
async function handleAddUser() {
  //表单验证
  try {
    await formRef.value?.validate()
  } catch (err: any) {
    ElMessage.error('表单验证失败' + err.message)
    return
  }
  //添加用户信息
  if (props.isAddModal) {
    postAddUserRequest(form.value).then((res) => {
      ElMessage.success(res.message)
      emits('get-list') //刷新列表数据
      dialogVisible.value = false
    })
  } else {
    //编辑用户信息
    putEditUserRequest(form.value.id as number, form.value).then((res) => {
      ElMessage.success(res.message)
      emits('get-list') //刷新列表数据
      dialogVisible.value = false
    })
  }
}
</script>

<style scoped>
.dialog-body {
  padding: 0 30px;
}
</style>
