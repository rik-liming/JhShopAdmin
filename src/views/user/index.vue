<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="名字" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
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
      <el-table-column label="ID" prop="id" align="center" width="100" >
        <template v-slot="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" width="110px" align="center">
        <template v-slot="{row}">
          <span>{{ row.real_time ? row.real_time : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册邮箱" width="250px" align="center">
        <template v-slot="{row}">
          <span>{{ row.email ? row.email : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.role ? roleTypeMap[row.role] : '-' }}</span>
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px">
        <template v-slot="{row, $index}">
          <el-button :disabled="row.status == 1" size="small" type="success" @click="handleModifyStatus(row, 1)">
            启用
          </el-button>
          <el-button :disabled="row.status == 0" size="small" type="danger" @click="handleModifyStatus(row, 0)">
            禁用
          </el-button>
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.pagesize" @pagination="handlePageChange" />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" prop="id">
          <el-input v-model="temp.id" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="temp.user_name" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="temp.real_name" />
        </el-form-item>
        <el-form-item label="注册邮箱" prop="email">
          <el-input v-model="temp.email" disabled />
        </el-form-item>
        <el-form-item label="角色" prop="role" v-if="temp.role !== 'platform'">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in canSelectRoleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间" prop="created_at">
          <el-date-picker v-model="temp.created_at" type="datetime" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select" disabled>
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue';
import { Search, Edit } from '@element-plus/icons-vue';
import * as AdminApi from '@/api/admin';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { ElMessage } from 'element-plus';

const roleTypeOptions = [
  { key: 'platform', display_name: '平台总代理' },
  { key: 'agent', display_name: '代理' },
  { key: 'seller', display_name: '商家' },
  { key: 'buyer', display_name: '买家' },
  { key: 'autoBuyer', display_name: '自动化买家' },
];
const canSelectRoleTypeOptions = [
  { key: 'agent', display_name: '代理' },
  { key: 'seller', display_name: '商家' },
  { key: 'buyer', display_name: '买家' },
  { key: 'autoBuyer', display_name: '自动化买家' },
];
const roleTypeMap = {
  'platform': '平台总代理',
  'agent': '代理',
  'seller': '商家',
  'buyer': '买家',
  'autoBuyer': '自动化买家',
  'default': '默认角色',
}
const statusOptions = [
  { key: 0, display_name: '禁用' },
  { key: 1, display_name: '正常' },
];
const statusMap = {
  '0': '已禁用',
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pagesize: 20,
        keyword: '',
        role: '',
      },
      isRequesting: false,
      roleTypeOptions,
      roleTypeMap,
      canSelectRoleTypeOptions,
      statusOptions,
      statusMap,
      statusFilterMap,
      temp: {
        id: undefined,
        user_name: '',
        real_name: '',
        email: '',
        role: '',
        status: 1,
        created_at: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    async getList() {
      this.listLoading = true;
      const adminLoginToken = store.admin().adminLoginToken
      try {
        const listResp = await AdminApi.fetchUserList(adminLoginToken, this.listQuery)
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
      const updateResp = await AdminApi.updateUser(adminLoginToken, {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        user_name: '',
        real_name: '',
        email: '',
        role: '',
        status: 1,
        created_at: undefined
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
      //     this.temp.author = 'vue-element-admin';
      //     createArticle(this.temp).then(() => {
      //       this.list.unshift(this.temp);
      //       this.dialogFormVisible = false;
      //       ElNotification({
      //         title: 'Success',
      //         message: 'Created Successfully',
      //         type: 'success',
      //         duration: 2000
      //       });
      //     });
      //   }
      // });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    async updateData() {
      const isValid = await this.$refs['dataForm'].validate()
      if (isValid) {
        const adminLoginToken = store.admin().adminLoginToken
        const tempData = Object.assign({}, this.temp);
        const updateResp = await AdminApi.updateUser(adminLoginToken, tempData)
        if (updateResp.data.code === 10000) {
          const index = this.list.findIndex(v => v.id === this.temp.id);
          this.list.splice(index, 1, this.temp);
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
    handleDelete(row, index) {
      ElNotification({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      });
      this.list.splice(index, 1);
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j]);
        } else {
          return v[j];
        }
      }));
    },
  }
});
</script>
