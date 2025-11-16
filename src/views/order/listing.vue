<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.user_id" clearable placeholder="用户ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-select v-model="listQuery.payment_method" placeholder="卖场" clearable class="filter-item" style="width: 130px; margin-right: 8px;">
        <el-option v-for="item in paymentMethodOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
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
      <el-table-column label="用户ID" prop="user_id" align="center" width="150" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row?.user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册邮箱" width="200px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.user?.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出售数量" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.amount }} USDT</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.remain_amount }} USDT</span>
        </template>
      </el-table-column>
      <el-table-column label="最低购买金额" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.min_sale_amount }} USDT</span>
        </template>
      </el-table-column>
      <el-table-column label="卖场" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ formatPaymentMethod(row.payment_method) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusFilterMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px" fixed="right">
        <template v-slot="{row, $index}">
          <el-button 
            :disabled="![0, 2].includes(row.status)
              || !canApprove  
            " 
            size="small" 
            type="success" 
            @click="handleModifyStatus(row, 1)"
          >
            上架
          </el-button>
          <el-button 
            :disabled="![1].includes(row.status)
              || !canApprove
            " 
            size="small" 
            type="warning" 
            @click="handleModifyStatus(row, 0)" 
            class="!tw-ml-0 !tw-mt-2 md:!tw-ml-4 md:!tw-mt-0"
          >
            下架
          </el-button>
          <el-button 
            :disabled="![1].includes(row.status)
              || !canApprove
            " 
            size="small" 
            type="danger" 
            @click="handleModifyStatus(row, 2)" 
            class="!tw-ml-0 !tw-mt-2 md:!tw-ml-4 md:!tw-mt-0"
          >
            禁售
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.page_size" @pagination="handlePageChange" />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="400" align-center>
      <el-form :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
        <el-form-item label="用户ID">
          <span>{{ formatIdDisplay(temp.user_id) }}</span>
        </el-form-item>
        <el-form-item label="注册邮箱">
          <span>{{ temp.user?.email }}</span>
        </el-form-item>
        <el-form-item label="出售数量">
          <span>{{ temp.amount }} USDT</span>
        </el-form-item>
        <el-form-item label="剩余数量">
          <span>{{ temp.remain_amount }} USDT</span>
        </el-form-item>
        <el-form-item label="最低购买金额">
          <span>{{ temp.min_sale_amount }} USDT</span>
        </el-form-item>
        <el-form-item label="卖场">
          <span>{{ formatPaymentMethod(temp.payment_method) }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <template v-slot="{row}">
            <el-tag :type="statusFilterMap[temp.status]">
              {{ statusMap[temp.status] }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="生成时间">
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
import * as OrderListingApi from '@/api/order_listing';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { ElMessage } from 'element-plus';
import { formatIdDisplay, formatPaymentMethod, hasActionPermission } from '@/utils/tool'

const paymentMethodOptions = [
  { key: 'alipay', display_name: '支付宝' },
  { key: 'wechat', display_name: '微信' },
  { key: 'bank', display_name: '银行卡' },
];
const statusMap = {
  '0': '已下架',
  '1': '在售',
  '2': '禁售',
  '3': '锁库存下架',
  '4': '售罄',
  '5': '已撤单',
}
const statusFilterMap = {
  '0': 'warning',
  '1': 'success',
  '2': 'danger',
  '3': 'default',
  '4': 'primary',
  '5': 'info',
};

export default defineComponent({
  name: 'OrderListing',
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
        payment_method: '',
      },
      isRequesting: false,
      paymentMethodOptions,
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
  computed: {
    canApprove() {
      const adminStore = store.admin()
      return hasActionPermission('/order/listing:approve', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
  },
  methods: {
    parseTime,
    formatIdDisplay,
    formatPaymentMethod,
    async getList() {
      this.listLoading = true;
      const adminLoginToken = store.admin().adminLoginToken
      try {
        const listResp = await OrderListingApi.getOrderListingByPage(adminLoginToken, this.listQuery)
        if (listResp.data.code === 10000) {
          this.list = listResp.data.data.orderListings;
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
      const updateResp = await OrderListingApi.updateOrderListing(adminLoginToken, {
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
