<template>
  <div class="app-container">
    <!-- 筛选区域 -->
    <div class="filter-container">
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
      <el-button 
        class="filter-item" 
        type="success" 
        :icon="iconPlus" 
        @click="handleCreateRole"
        :disabled="!canAddRole"
      >
        添加角色
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
      <el-table-column label="角色" width="200" align="center">
        <template #default="{ row }">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.role }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色名" width="150" align="center">
        <template #default="{ row }">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" width="450" align="center">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权限" width="100" align="center" v-if="canModifyPrivilege">
        <template #default="{ row }">
          <span v-if="row.role === 'superAdmin' || row.role === adminStore?.admin?.value?.role">-</span>
          <span v-else class="link-type" @click="handleShowTree(row)">{{ `权限管理` }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusFilterMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template #default="{ row }">
          <div class="tw-flex tw-justify-center tw-gap-1 md:tw-flex-row tw-flex-col tw-items-center">
            <el-button
              :disabled="
                row.status == 1 
                || row.role === adminStore.admin?.value?.role
                || row.role === 'superAdmin'
                || !canBanRole
              "
              size="small"
              type="success"
              @click="handleModifyStatus(row, 1)"
            >
              启用
            </el-button>
            <el-button
              :disabled="
                row.status == 0
                || row.role === adminStore.admin?.value?.role
                || row.role === 'superAdmin'
                || !canBanRole
              "
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
        <el-form-item label="角色">
          <span>{{ temp.role }}</span>
        </el-form-item>
        <el-form-item label="角色名">
          <span>{{ temp.name }}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{ temp.remark }}</span>
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
        <el-form-item label="角色">
          <el-input v-model="preCreateRole.role" placeholder="请输入角色" />
        </el-form-item>
        <el-form-item label="角色名">
          <el-input v-model="preCreateRole.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            type="textarea"
            :rows="2"
            v-model="preCreateRole.remark"
            placeholder="请输入备注，帮助记忆"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="tw-flex tw-justify-start tw-ml-28 tw-gap-8">
          <el-button @click="createDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createRole">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 权限树弹窗 -->
    <el-dialog :title="textMap[treeDialogStatus] + ' - ' + currentRole.name" v-model="treeDialogFormVisible" :width="getAdjustWidth(400, 400, 460)" align-center>
      <div class="tw-h-[300px] tw-overflow-y-auto">
        <tree 
          :privilegeTree="privilegeTree" 
          ref="privilegeTreeRef"
          :role="currentRole.role" 
          :treeKey="Math.random()"
          :checkedRules="checkedRules"
        />
      </div>
      <template #footer>
        <div class="tw-flex tw-justify-start tw-ml-40 tw-gap-8">
          <el-button @click="treeDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="savePrivilegeTree">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw, computed } from 'vue'
import { Search, Edit, Plus } from '@element-plus/icons-vue'
import * as RoleApi from '@/api/role'
import * as PrivilegeApi from '@/api/privilege'
import store from '@/store'
import { ElMessage, ElNotification } from 'element-plus'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { formatIdDisplay, getAdjustWidth, hasActionPermission } from '@/utils/tool'
import Tree from './components/Tree.vue'

// 状态映射
const statusMap = { '0': '已封禁', '1': '正常' }
const statusFilterMap = { '0': 'danger', '1': 'success' }
const textMap = { 
  detail: '详情', 
  create: '创建',
  tree: '权限树',
}

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

const preCreateRole = reactive<any>({})
const createDialogStatus = ref('')
const createDialogFormVisible = ref(false)

const privilegeTree = ref<any[]>([])
const privilegeTreeRef = ref(null)
const currentRole = reactive<any>({})
const treeDialogStatus = ref('')
const treeDialogFormVisible = ref(false)
const checkedRules = ref<number[]>([])

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
    const listResp = await RoleApi.getRoleByPage(adminLoginToken, listQuery)
    if (listResp.data.code === 10000) {
      list.value = listResp.data.data.roles
      total.value = listResp.data.data.total
    } else {
      ElMessage.error(listResp.data.msg)
    }
  } finally {
    listLoading.value = false
  }
}

// 获取权限列表
const getPrivilegesTree = async () => {
  const treeResp = await PrivilegeApi.getPrivilegesTree(adminStore.adminLoginToken)

  if (treeResp.data.code === 10000) {
    privilegeTree.value = treeResp.data.data.tree
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
  const updateResp = await RoleApi.updateOtherRole(adminLoginToken, { role: row.role, status })
  if (updateResp.data.code === 10000) {
    row.status = status
    const index = list.value.findIndex((v) => v.id === row.id)
    list.value.splice(index, 1, row)
    ElMessage.success({ message: '更新成功', duration: 2000 })
  }
}

// 创建角色
const handleCreateRole = () => {
  Object.assign(preCreateRole, {})
  createDialogStatus.value = 'create'
  createDialogFormVisible.value = true
}

const createRole = async () => {
  if (!preCreateRole.role || !preCreateRole.name) return ElMessage.error('请输入角色和角色名！')

  if (!/^[a-zA-Z]+$/.test(preCreateRole.role)) {
    ElMessage.error('角色只能包含英文字母')
    return
  }

  const adminLoginToken = adminStore.adminLoginToken
  const resp = await RoleApi.createRole(adminLoginToken, preCreateRole)
  if (resp.data.code === 10000) {
    ElNotification.success({ title: 'Success', message: '创建成功', duration: 2000 })
    window.location.reload()
  } else {
    ElMessage.error(resp.data.msg)
  }
}

const handleShowTree = async(row) => {

  Object.assign(currentRole, row)

  const roleRulesResp = await RoleApi.getRoleRules(adminStore.adminLoginToken, currentRole.role)
  if (roleRulesResp.data.code === 10000) {
    checkedRules.value = roleRulesResp.data.data.rules

    treeDialogStatus.value = 'tree'
    treeDialogFormVisible.value = true
  }
}

/**
 * 更新权限
 */
const savePrivilegeTree = async() => {

  try {
    const selected = privilegeTreeRef.value.getSelectedRules?.() ?? []
    const updateResp = await RoleApi.updateRoleRules(adminStore.adminLoginToken, { 
      ruleIds: selected,
      role: currentRole.role,
    })
    if (updateResp.data.code === 10000) {
      ElMessage.success('更新成功')
      treeDialogFormVisible.value = false
    } else {
      ElMessage.error(updateResp.data.msg)
    } 
  } catch (error) {
    ElMessage.error('更新失败')
  }
  
}

// 初始化
onMounted(() => {
  getAdminRoleList()
  getPrivilegesTree()
  getList()
})

const canAddRole = computed(() => {
  return hasActionPermission('/permission/role:add', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
})

const canModifyPrivilege = computed(() => {
  return hasActionPermission('/permission/role:privilegeManage', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
})

const canBanRole = computed(() => {
  return hasActionPermission('/permission/role:ban', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
})

</script>
