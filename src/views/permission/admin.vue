<template>
  <div class="app-container">
    <!-- 筛选区域 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.user_name"
        clearable
        placeholder="登录名"
        style="width: 200px; margin-right: 4px;"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.role"
        placeholder="角色"
        clearable
        class="filter-item"
        style="width: 130px; margin-right: 8px;"
      >
        <el-option
          v-for="item in roleTypeOptions"
          :key="item.role"
          :label="`${item.name}(${item.role})`"
          :value="item.role"
        />
      </el-select>
      <el-button class="filter-item" type="primary" :icon="iconSearch" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" :icon="iconPlus" @click="handleCreateAdmin">
        添加管理员
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="登录名" width="300" align="center">
        <template #default="{ row }">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色" width="300" align="center">
        <template #default="{ row }">
          <span>{{ row.role ? roleTypeMap[row.role] : '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="250" align="center">
        <template #default="{ row }">
          <el-tag :type="statusFilterMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="300" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template #default="{ row }">
          <div class="tw-flex tw-justify-center tw-gap-1 md:tw-flex-row tw-flex-col tw-items-center">
            <el-button
              :disabled="row.status == 1 || row.user_name === adminStore.admin?.value?.userName"
              size="small"
              type="success"
              @click="handleModifyStatus(row, 1)"
            >
              启用
            </el-button>
            <el-button
              :disabled="row.status == 0 || row.user_name === adminStore.admin?.value?.userName"
              size="small"
              type="danger"
              class="!tw-ml-0 !tw-mt-2 md:!tw-ml-4 md:!tw-mt-0"
              @click="handleModifyStatus(row, 0)"
            >
              封禁
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.page_size"
      @pagination="handlePageChange"
    />

    <!-- 详情弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="400">
      <el-form label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
        <el-form-item label="登录名">
          <span>{{ temp.user_name }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <span>{{ roleTypeMap[temp.role] }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="statusFilterMap[temp.status]">
            {{ statusMap[temp.status] }}
          </el-tag>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ parseTime(temp.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="tw-flex tw-justify-start tw-ml-40">
          <el-button type="primary" @click="dialogFormVisible = false">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 创建弹窗 -->
    <el-dialog :title="textMap[createDialogStatus]" v-model="createDialogFormVisible" width="400" align-center>
      <el-form label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
        <el-form-item label="登录名">
          <el-input v-model="preCreateAdmin.user_name" placeholder="请输入管理员登录名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="preCreateAdmin.password" placeholder="请输入管理员密码" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="preCreateAdmin.confirm_password" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="preCreateAdmin.role" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in roleTypeOptions" :key="item.role" :label="item.name" :value="item.role" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="tw-flex tw-justify-start tw-ml-28 tw-gap-8">
          <el-button @click="createDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createAdmin">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from 'vue'
import { Search, Edit, Plus } from '@element-plus/icons-vue'
import * as RoleApi from '@/api/role'
import * as AdminApi from '@/api/admin'
import store from '@/store'
import { ElMessage, ElNotification } from 'element-plus'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { formatIdDisplay } from '@/utils/tool'

// 状态映射
const statusMap = { '0': '已封禁', '1': '正常' }
const statusFilterMap = { '0': 'danger', '1': 'success' }
const textMap = { detail: '详情', create: '创建' }

const iconSearch = markRaw(Search)
const iconEdit = markRaw(Edit)
const iconPlus = markRaw(Plus)
const adminStore = store.admin()

// 数据
const tableKey = ref(0)
const list = ref<any[]>([])
const total = ref(0)
const listLoading = ref(true)
const isRequesting = ref(false)

const listQuery = reactive({
  page: 1,
  page_size: 20,
  user_name: '',
  role: ''
})

const roleTypeOptions = ref<any[]>([])
const roleTypeMap = ref<Record<string, string>>({})
const temp = ref<any>({})
const dialogStatus = ref('')
const dialogFormVisible = ref(false)

const preCreateAdmin = reactive<any>({})
const createDialogStatus = ref('')
const createDialogFormVisible = ref(false)

// 获取角色列表
const getAdminRoleList = async () => {
  const adminLoginToken = adminStore.adminLoginToken
  const listResp = await RoleApi.getRoleList(adminLoginToken)
  if (listResp.data.code === 10000) {
    const roles = listResp.data.data.roles
    roleTypeOptions.value = roles
    roleTypeMap.value = roles.reduce((acc: any, item: any) => {
      acc[item.role] = item.name
      return acc
    }, {})
  }
}

// 获取管理员列表
const getList = async () => {
  listLoading.value = true
  const adminLoginToken = adminStore.adminLoginToken
  try {
    const listResp = await AdminApi.fetchAdminList(adminLoginToken, listQuery)
    if (listResp.data.code === 10000) {
      list.value = listResp.data.data.admins
      total.value = listResp.data.data.total
    } else {
      ElMessage.error(listResp.data.msg)
    }
  } finally {
    listLoading.value = false
  }
}

// 翻页
const handlePageChange = async () => {
  if (isRequesting.value) return
  isRequesting.value = true
  await getList()
  isRequesting.value = false
}

// 过滤
const handleFilter = () => {
  listQuery.page = 1
  getList()
}

// 查看详情
const handleShowDetail = (row: any) => {
  temp.value = { ...row }
  dialogStatus.value = 'detail'
  dialogFormVisible.value = true
}

// 修改状态
const handleModifyStatus = async (row: any, status: number) => {
  const adminLoginToken = adminStore.adminLoginToken
  const updateResp = await AdminApi.updateOtherAdminInfo(adminLoginToken, { admin_id: row.id, status })
  if (updateResp.data.code === 10000) {
    row.status = status
    const index = list.value.findIndex((v) => v.id === row.id)
    list.value.splice(index, 1, row)
    ElNotification.success({ title: 'Success', message: '更新成功', duration: 2000 })
  }
}

// 创建管理员
const handleCreateAdmin = () => {
  Object.assign(preCreateAdmin, {})
  createDialogStatus.value = 'create'
  createDialogFormVisible.value = true
}

const createAdmin = async () => {
  if (preCreateAdmin.password !== preCreateAdmin.confirm_password) return ElMessage.error('两次输入的密码不一致！')
  if (preCreateAdmin.password.length < 6) return ElMessage.error('密码至少6位！')
  if (!preCreateAdmin.role) return ElMessage.error('请选择角色！')

  const adminLoginToken = adminStore.adminLoginToken
  const resp = await AdminApi.createAdmin(adminLoginToken, preCreateAdmin)
  if (resp.data.code === 10000) {
    ElNotification.success({ title: 'Success', message: '创建成功', duration: 2000 })
    window.location.reload()
  } else {
    ElMessage.error(resp.data.msg)
  }
}

// 初始化
onMounted(() => {
  getAdminRoleList()
  getList()
})
</script>
