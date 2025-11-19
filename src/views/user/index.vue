<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" clearable placeholder="ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-input v-model="listQuery.email" clearable placeholder="邮箱" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-select v-model="listQuery.role" placeholder="角色" clearable class="filter-item" style="width: 130px; margin-right: 8px;">
        <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" :icon="iconSearch" @click="handleFilter">
        <span v-waves>搜索</span>
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="200" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册邮箱" width="200px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.email ? row.email : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="150px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowRole(row)">{{ row.role ? roleTypeMap[row.role] : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.invite_code ? row.invite_code : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上下级" width="90px" align="center" v-if="canScanInviterRelation">
        <template v-slot="{row}">
          <span v-if="row.role == 'agent'" class="link-type" @click="fetchInviteRelation(row)">{{ `查看下级` }}</span>
          <span>-</span>
        </template>
      </el-table-column>
      <el-table-column label="资产" width="90px" align="center" v-if="canScanAccount">
        <template v-slot="{row}">
          <span 
            v-if="row.role === 'agent' || row.role === 'seller'" 
            class="link-type" 
            @click="fetchAccountInfo(row)">{{ `查看资产` }}
          </span>
          <span>-</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="90px" align="center" v-if="canModifyPassword">
        <template v-slot="{row}">
          <span 
            class="link-type" 
            @click="fetchPasswordInfo(row)">{{ `修改密码` }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusFilterMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册日期" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px" fixed="right">
        <template v-slot="{row, $index}">
          <div class="tw-flex tw-justify-center tw-gap-1 md:tw-flex-row tw-flex-col tw-items-center">
            <el-button :disabled="row.status == 1 || !canBanUser" size="small" type="success" @click="handleModifyStatus(row, 1)">
              启用
            </el-button>
            <el-button :disabled="row.status == 0 || !canBanUser" size="small" type="danger" @click="handleModifyStatus(row, 0)" class="!tw-ml-0 !tw-mt-2 md:!tw-ml-4 md:!tw-mt-0">
              封禁
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.page_size" @pagination="handlePageChange" />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="400">
      <el-form :model="currentUser" label-position="left" label-width="120px" style="width: 300px; margin-left:50px;" :label-style="{ fontWeight: 'bold' }">
        <el-form-item>
          <template #label>
            <span class="tw-font-bold">ID:</span>
          </template>
          <span>{{ formatIdDisplay(currentUser.id) }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold">注册邮箱:</span>
          </template>
          <span>{{ currentUser.email }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold">角色:</span>
          </template>
          <span>{{ roleTypeMap[currentUser.role] }}</span>
        </el-form-item>
        <el-form-item v-if="currentUser.invite_code">
          <template #label>
            <span class="tw-font-bold">邀请码:</span>
          </template>
          <span>{{ currentUser.invite_code }}</span>
        </el-form-item>
        <el-form-item v-if="currentUser.role === 'autoBuyer'">
          <template #label>
            <span class="tw-font-bold">远程下单链接:</span>
          </template>
          <el-tooltip placement="top">
            <template #content>
              {{ getRemoteBuyLink(currentUser.id) }}
            </template>
            <div class="tw-flex tw-items-center">
              <span>{{ `下单链接...` }}</span>
              <el-icon class="cursor-pointer tw-ml-6" @click="copyRemoteBuyLink(currentUser.id)">
                <component :is="iconCopy" />
              </el-icon>
            </div>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold">状态:</span>
          </template>
          <el-tag :type="statusFilterMap[currentUser.status]">
            {{ statusMap[currentUser.status] }}
          </el-tag>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold">注册时间:</span>
          </template>
          <span>{{ parseTime(currentUser.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog :title="`${formatIdDisplay(currentUser.id)} - 下级情况`" v-model="inviteRelationVisible" :width="getAdjustWidth(420, 0, 500)" align-center>
      <el-table
        :data="inviteUsers"
        border
        fit
        highlight-current-row
        style="width: 100%; height: 300px; overflow: auto;"
      >
        <el-table-column label="ID" prop="id" align="center" width="80" >
          <template v-slot="{row}">
            <span>{{ formatIdDisplay(row.id) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册邮箱" width="130px" align="center">
          <template v-slot="{row}">
            <span>{{ row.email ? row.email : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" width="100" align="center">
          <template v-slot="{row}">
            <el-tag :type="statusFilterMap[row.status]">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" width="150px" align="center">
          <template v-slot="{row}">
            <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="资产情况" v-model="accountVisible" width="400" align-center>
      <el-form label-position="left" style="width: 300px; margin-left:50px;">
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">ID:</span>
          </template>
          <span>{{ formatIdDisplay(currentAccount.user_id) }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">总资产:</span>
          </template>
          <span>{{ currentAccount.total_balance }}</span><span class="tw-ml-4 tw-font-sm">USDT</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">可用资产:</span>
          </template>
          <span>{{ currentAccount.available_balance }}</span><span class="tw-ml-4 tw-font-sm">USDT</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">变动值:</span>
          </template>
          <el-input 
            v-model="delta_amount" 
            placeholder="变动数值，负数代表减少资产" 
            :disabled="!canModifyAccount"
          />
        </el-form-item>
        <el-form-item class="tw-ml-16">
          <el-button @click="accountVisible = false">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="updateAccount()"
            :disabled="!canModifyAccount"
          >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="用户密码" v-model="passwordVisible" :width="getAdjustWidth(400, 380, 430)" align-center>
      <el-form label-position="left" style="width: 300px; margin-left:50px;">
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">ID:</span>
          </template>
          <span>{{ formatIdDisplay(currentPasswordObj.user_id) }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">登录密码:</span>
          </template>
          <el-input type="password" v-model="currentPasswordObj.login_password" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">支付密码:</span>
          </template>
          <el-input type="password" v-model="currentPasswordObj.payment_password" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">谷歌验证:</span>
          </template>
          <el-input type="password" v-model="currentPasswordObj.two_factor_secret" />
        </el-form-item>
        <el-form-item label-width="0">
          <span class="tw-w-full tw-text-red-500">注意，密码输入值留空，代表清空该密码</span>
        </el-form-item>
        <el-form-item class="tw-ml-20">
          <el-button @click="passwordVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="updatePasswordInfo()">
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="角色详情" v-model="changeRoleVisible" width="400" align-center>
      <el-form label-position="left" label-width="70px" style="width: 300px; margin-left:50px;">
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">ID:</span>
          </template>
          <span>{{ formatIdDisplay(currentUser.id) }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tw-font-bold tw-w-[70px]">角色:</span>
          </template>
          <el-select 
            v-model="currentUser.role" 
            class="filter-item" 
            placeholder="请选择角色"
            v-if="canGrantSpecialRole && canGrantNormalRole"
          >
            <el-option v-for="item in canSelectAllRoleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-select 
            v-model="currentUser.role" 
            class="filter-item" 
            placeholder="请选择角色"
            v-else-if="canGrantSpecialRole"
          >
            <el-option v-for="item in canSelectSpecialRoleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-select 
            v-model="currentUser.role" 
            class="filter-item" 
            placeholder="请选择角色"
            v-else-if="canGrantNormalRole"
          >
            <el-option v-for="item in canSelectNormalRoleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-select 
            v-model="currentUser.role" 
            class="filter-item" 
            placeholder="请选择角色"
            v-else
            disabled
          >
            <el-option v-for="item in canSelectAllRoleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="changeRoleVisible = false">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="updateRole()"
            :disabled="!canGrantSpecialRole && !canGrantNormalRole"
          >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue';
import { Search, Edit, CopyDocument } from '@element-plus/icons-vue';
import * as UserApi from '@/api/user';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { ElMessage } from 'element-plus';
import { formatIdDisplay, getAdjustWidth, hasActionPermission } from '@/utils/tool'

const roleTypeOptions = [
  { key: 'platform', display_name: '平台总代理' },
  { key: 'agent', display_name: '代理' },
  { key: 'seller', display_name: '商户' },
  { key: 'buyer', display_name: '买家' },
  { key: 'autoBuyer', display_name: '自动化买家' },
];
const canSelectNormalRoleTypeOptions = [
  { key: 'seller', display_name: '商户' },
  { key: 'buyer', display_name: '买家' },
];
const canSelectSpecialRoleTypeOptions = [
  { key: 'agent', display_name: '代理' },
  { key: 'autoBuyer', display_name: '自动化买家' },
];
const canSelectAllRoleTypeOptions = [
  { key: 'agent', display_name: '代理' },
  { key: 'seller', display_name: '商户' },
  { key: 'buyer', display_name: '买家' },
  { key: 'autoBuyer', display_name: '自动化买家' },
];
const roleTypeMap = {
  'platform': '平台总代理',
  'agent': '代理',
  'seller': '商户',
  'buyer': '买家',
  'autoBuyer': '自动化买家',
  'default': '默认角色',
}
const statusOptions = [
  { key: 0, display_name: '禁用' },
  { key: 1, display_name: '正常' },
];
const statusMap = {
  '0': '已封禁',
  '1': '正常',
}
const statusFilterMap = {
  '0': 'danger',
  '1': 'success',
};

export default defineComponent({
  name: 'UserPage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      iconSearch: markRaw(Search),
      iconEdit: markRaw(Edit),
      iconCopy: markRaw(CopyDocument),
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20,
        id: '',
        email: '',
        role: '',
      },
      isRequesting: false,
      roleTypeOptions,
      roleTypeMap,
      canSelectNormalRoleTypeOptions,
      canSelectSpecialRoleTypeOptions,
      canSelectAllRoleTypeOptions,
      statusOptions,
      statusMap,
      statusFilterMap,
      currentUser: {},
      dialogFormVisible: false,
      inviteRelationVisible: false,
      accountVisible: false,
      passwordVisible: false,
      changeRoleVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '详情',
      },
      rules: {
      },
      inviteUsers: null,
      currentAccount: {},
      delta_amount: '',
      currentPasswordObj: {}
    };
  },
  created() {
    this.getList();
  },
  computed: {
    canGrantNormalRole() {
      const adminStore = store.admin()
      return hasActionPermission('/user/index:grantNormalRole', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
    canGrantSpecialRole() {
      const adminStore = store.admin()
      return hasActionPermission('/user/index:grantSpecialRole', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
    canScanInviterRelation() {
      const adminStore = store.admin()
      return hasActionPermission('/user/index:scanInviterRelation', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
    canScanAccount() {
      const adminStore = store.admin()
      return hasActionPermission('/user/index:scanAccount', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
    canModifyAccount() {
      const adminStore = store.admin()
      return hasActionPermission('/user/index:modifyAccount', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
    canModifyPassword() {
      const adminStore = store.admin()
      return hasActionPermission('/user/index:modifyPassword', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
    canBanUser() {
      const adminStore = store.admin()
      return hasActionPermission('/user/index:ban', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
  },
  methods: {
    parseTime,
    formatIdDisplay,
    getAdjustWidth,
    hasActionPermission,
    async getList() {
      this.listLoading = true;
      const adminLoginToken = store.admin().adminLoginToken
      try {
        const listResp = await UserApi.fetchUserList(adminLoginToken, this.listQuery)
        if (listResp.data.code === 10000) {
          this.list = listResp.data.data.users;
          this.total = listResp.data.data.total;
        } else {
          ElMessage.error(listResp.data.msg)
        } 
      } catch (error) {
        console.log(error)
      } finally {
        this.listLoading = false
      }
    },
    async handlePageChange() {
      if (this.isRequesting) return; // 如果正在请求，则不重复请求

      this.isRequesting = true; // 开始请求
      await this.getList();
      this.isRequesting = false; // 请求完成
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    async handleModifyStatus(row, status) {
      const adminLoginToken = store.admin().adminLoginToken
      const updateResp = await UserApi.updateUser(adminLoginToken, {
        id: row.id,
        status,
      })
      if (updateResp.data.code === 10000) {
        row.status = status;
        const index = this.list.findIndex(v => v.id === row.id);
        this.list.splice(index, 1, row);
        ElNotification({
          title: 'Success',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      }
    },
    handleShowDetail(row) {
      this.currentUser = Object.assign({}, row); // copy obj
      this.dialogStatus = 'detail';
      this.dialogFormVisible = true;
    },
    async updateData() {
      const isValid = await this.$refs['dataForm'].validate()
      if (isValid) {
        const adminLoginToken = store.admin().adminLoginToken
        const tempData = Object.assign({}, this.currentUser);
        const updateResp = await UserApi.updateUser(adminLoginToken, tempData)
        if (updateResp.data.code === 10000) {
          const index = this.list.findIndex(v => v.id === this.currentUser.id);
          this.list.splice(index, 1, this.currentUser);
          this.dialogFormVisible = false;
          ElNotification({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
        }
      }
    },
    async fetchInviteRelation(row) {
      this.currentUser = Object.assign({}, row); // copy obj
      this.inviteRelationVisible = true
      const adminLoginToken = store.admin().adminLoginToken
      const relationResp = await UserApi.getInviteRelation(adminLoginToken, row.id)
      if (relationResp.data.code === 10000) {
        const users = relationResp.data.data.users
        this.inviteUsers = users.filter(user => user.id !== row.id);
      }
    },
    async fetchAccountInfo(row) {
      this.currentUser = Object.assign({}, row); // copy obj
      this.accountVisible = true
      const adminLoginToken = store.admin().adminLoginToken
      const accountResp = await UserApi.getAccountInfo(adminLoginToken, row.id)
      if (accountResp.data.code === 10000) {
        this.currentAccount = accountResp.data.data.account
      }
    },
    async updateAccount() {
      const adminLoginToken = store.admin().adminLoginToken
      const updateAccountResp = await UserApi.updateAccountInfo(adminLoginToken, {
        user_id: this.currentAccount.user_id,
        delta_amount: this.delta_amount
      })

      if (updateAccountResp.data.code === 10000) {
        ElMessage.success("更新成功！")
        this.currentAccount = updateAccountResp.data.data.account
      } else {
        ElMessage.error("更新失败，请检查数值！")
      }
    },
    async fetchPasswordInfo(row) {
      this.currentUser = Object.assign({}, row); // copy obj
      const adminLoginToken = store.admin().adminLoginToken
      const passwordResp = await UserApi.getPasswordInfo(adminLoginToken, row.id)
      if (passwordResp.data.code === 10000) {
        this.currentPasswordObj = passwordResp.data.data
        this.passwordVisible = true
      }
    },
    async updatePasswordInfo() {
      const adminLoginToken = store.admin().adminLoginToken
      const updatePasswordResp = await UserApi.updatePasswordInfo(adminLoginToken, {
        user_id: this.currentPasswordObj.user_id,
        login_password: this.currentPasswordObj.login_password,
        two_factor_secret: this.currentPasswordObj.two_factor_secret,
        payment_password: this.currentPasswordObj.payment_password,
      })

      if (updatePasswordResp.data.code === 10000) {
        ElMessage.success("更新成功！")
        this.passwordVisible = false
      } else {
        ElMessage.error(updatePasswordResp.data.msg)
      }
    },
    getRemoteBuyLink(autoBuyerId) {
      return `${import.meta.env.VITE_SHOP_ENDPOINT}/#/remote/buy?autoBuyerId=${autoBuyerId}`
    },
    async copyRemoteBuyLink(autoBuyerId) {
      const remoteBuyLink = this.getRemoteBuyLink(autoBuyerId);

      if (remoteBuyLink) {
        try {
          // 使用 Clipboard API 复制文本到剪贴板
          await navigator.clipboard.writeText(remoteBuyLink);
          ElMessage.success('链接已复制！');
        } catch (err) {
          ElMessage.error('复制失败，请手动复制！');
        }
      }
    },
    handleShowRole(row) {
      this.currentUser = Object.assign({}, row); // copy obj
      this.changeRoleVisible = true
    },
    async updateRole() {
      const adminLoginToken = store.admin().adminLoginToken
      const updateRoleResp = await UserApi.updateRole(adminLoginToken, {
        user_id: this.currentUser.id,
        role: this.currentUser.role
      })

      if (updateRoleResp.data.code === 10000) {
        this.changeRoleVisible = false

        const index = this.list.findIndex(v => v.id === this.currentUser.id);
        this.list.splice(index, 1, this.currentUser);
        ElNotification({
          title: 'Success',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      } else {
        ElMessage.error("更新失败，请检查数值！")
      }
    }
  }
});
</script>
