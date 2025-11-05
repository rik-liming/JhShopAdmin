<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.user_id" placeholder="用户ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
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
      <el-table-column label="订单ID" align="center" width="200" >
        <template v-slot="{row}">
          <span>{{ row.display_withdraw_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" width="120" >
        <template v-slot="{row}">
          <span>{{ formatIdDisplay(row.user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册邮箱" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现金额" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.amount }} USDT</span>
        </template>
      </el-table-column>
      <el-table-column label="币价（汇率）" width="110px" align="center">
        <template v-slot="{row}">
          <span>{{ row.exchange_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等值人民币" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.cny_amount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.fee }} USDT</span>
        </template>
      </el-table-column>
      <el-table-column label="提现地址" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.withdraw_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusFilterMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px">
        <template v-slot="{row, $index}">
          <el-button :disabled="row.status !== 0" size="small" type="success" @click="handleModifyStatus(row, 1)">
            通过
          </el-button>
          <el-button :disabled="row.status !== 0" size="small" type="danger" @click="handleModifyStatus(row, -1)">
            驳回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.page_size" @pagination="handlePageChange" />

  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue';
import { Search, Edit } from '@element-plus/icons-vue';
import * as WithdrawApi from '@/api/withdraw';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { ElMessage } from 'element-plus';
import { formatIdDisplay } from '@/utils/tool'

const statusMap = {
  '0': '待审核',
  '1': '已通过',
  '-1': '已驳回',
}
const statusFilterMap = {
  '0': 'warning',
  '1': 'success',
  '-1': 'danger',
};

export default defineComponent({
  name: 'WithdrawPage',
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
        page_size: 20,
        user_id: '',
      },
      isRequesting: false,
      statusMap,
      statusFilterMap,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    formatIdDisplay,
    async getList() {
      this.listLoading = true;
      const adminLoginToken = store.admin().adminLoginToken
      try {
        const listResp = await WithdrawApi.fetchWithdrawList(adminLoginToken, this.listQuery)
        if (listResp.data.code === 10000) {
          this.list = listResp.data.data.withdraws;
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
      const updateResp = await WithdrawApi.updateWithdraw(adminLoginToken, {
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
  }
});
</script>
