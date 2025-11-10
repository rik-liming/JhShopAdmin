<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.display_transfer_id" placeholder="订单ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" clearable />
      <el-input v-model="listQuery.sender_user_id" placeholder="转账用户ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" clearable />
      <el-input v-model="listQuery.receiver_user_id" placeholder="入账用户ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" clearable />
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
      <el-table-column label="订单ID" align="center" width="170" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.display_transfer_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转账用户ID" align="center" width="100" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row.sender_user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转账邮箱" width="130px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.sender_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入账用户ID" align="center" width="100" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row.receiver_user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入账邮箱" width="130px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.receiver_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转账金额" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.amount }} USDT</span>
        </template>
      </el-table-column>
      <el-table-column label="币价（汇率）" width="110px" align="center">
        <template v-slot="{row}">
          <span>{{ row.exchange_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等值人民币" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.cny_amount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.fee }} USDT</span>
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px" fixed="right">
        <template v-slot="{row, $index}">
          <div class="tw-flex tw-justify-center tw-gap-1 md:tw-flex-row tw-flex-col tw-items-center">
            <el-button :disabled="row.status !== 0" size="small" type="success" @click="handleModifyStatus(row, 1)">
              通过
            </el-button>
            <el-button :disabled="row.status !== 0" size="small" type="danger" @click="handleModifyStatus(row, -1)" class="!tw-ml-0 !tw-mt-2 md:!tw-ml-4 md:!tw-mt-0">
              驳回
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.page_size" @pagination="handlePageChange" />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="400" align-center>
      <el-form :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
        <el-form-item label="订单ID">
          <span>{{ temp.display_transfer_id }}</span>
        </el-form-item>
        <el-form-item label="转账用户ID">
          <span>{{ formatIdDisplay(temp.sender_user_id) }}</span>
        </el-form-item>
        <el-form-item label="转账邮箱">
          <span>{{ temp.sender_user_name }}</span>
        </el-form-item>
        <el-form-item label="入账用户ID">
          <span>{{ formatIdDisplay(temp.receiver_user_id) }}</span>
        </el-form-item>
        <el-form-item label="入账邮箱">
          <span>{{ temp.receiver_user_name }}</span>
        </el-form-item>
        <el-form-item label="转账金额">
          <span>{{ temp.amount }} USDT</span>
        </el-form-item>
        <el-form-item label="币价（汇率）">
          <span>{{ temp.exchange_rate }}</span>
        </el-form-item>
        <el-form-item label="等值人民币">
          <span>{{ temp.cny_amount }} 元</span>
        </el-form-item>
        <el-form-item label="手续费">
          <span>{{ temp.fee }} USDT</span>
        </el-form-item>
        <el-form-item label="状态">
          <template v-slot="{row}">
            <el-tag :type="statusFilterMap[temp.status]">
              {{ statusMap[temp.status] }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="申请时间">
          <template v-slot="{row}">
            <span>{{ parseTime(temp.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="tw-flex tw-justify-start tw-ml-40">
          <el-button type="primary" @click="dialogFormVisible = false">
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
import * as TransferApi from '@/api/transfer';
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
  name: 'TransferPage',
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
        sender_user_id: '',
        receiver_user_id: '',
        display_transfer_id: '',
      },
      isRequesting: false,
      statusMap,
      statusFilterMap,
      dialogStatus: '',
      textMap: {
        detail: '详情',
      },
      dialogFormVisible: false,
      temp: {},
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
        const listResp = await TransferApi.fetchTransferList(adminLoginToken, this.listQuery)
        if (listResp.data.code === 10000) {
          this.list = listResp.data.data.transfers;
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
      const updateResp = await TransferApi.updateTransfer(adminLoginToken, {
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
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'detail';
      this.dialogFormVisible = true;
    },
  }
});
</script>
