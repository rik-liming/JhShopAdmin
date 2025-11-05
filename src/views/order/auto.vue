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
      <el-table-column label="订单号" align="center" width="200" >
        <template v-slot="{row}">
          <span>{{ row?.display_order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家ID" align="center" width="100" >
        <template v-slot="{row}">
          <span>{{ formatIdDisplay(row?.buy_user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户ID" align="center" width="150" >
        <template v-slot="{row}">
          <span>{{ formatIdDisplay(row?.sell_user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卖场" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ formatPaymentMethod(row.payment_method) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买数量（USDT）" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="汇率" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.exchange_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等值人民币（元）" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.total_cny_price }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" class-name="status-col" width="150" align="center">
        <template v-slot="{row}">
          <span v-if="row.status !== null && row.status !== undefined" :class="getStatusClass(row.status)">{{ payStatusMap[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px">
        <template v-slot="{row, $index}">
          <el-button :disabled="row.status !== 4" size="small" type="success" @click="handleOrderJudge(row, 5)">
            争议通过
          </el-button>
          <el-button :disabled="row.status !== 4" size="small" type="danger" @click="handleOrderJudge(row, 6)">
            争议撤单
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
import * as OrderApi from '@/api/order';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { ElMessage } from 'element-plus';
import { formatIdDisplay, formatPaymentMethod } from '@/utils/tool'

const paymentMethodOptions = [
  { key: 'alipay', display_name: '支付宝' },
  { key: 'wechat', display_name: '微信' },
  { key: 'bank', display_name: '银行卡' },
];

const payStatusMap = {
  0: '待买家付款',
  1: '待商户确认',
  2: '已完成',
  3: '超时取消',
  4: '争议',
  5: '争议（已通过）',
  6: '争议（已撤单）',
}

const getStatusClass = (status) => {
  if (status !== null && status !== undefined) {
    switch (status) {
      case 0:
        return 'waitBuyerPay';
      case 1:
        return 'buyerConfirm';
      case 2:
        return 'sellerConfirm';
      case 3:
        return 'expired';
      case 4:
        return 'argue';
      case 5:
        return 'argueComplete';
      case 6:
        return 'argueCancel';
      default:
        return '';
    }
  }
  return '';
}

export default defineComponent({
  name: 'AutoOrder',
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
        type: 'auto',
      },
      isRequesting: false,
      paymentMethodOptions,
      payStatusMap,
      getStatusClass,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    formatIdDisplay,
    formatPaymentMethod,
    async getList() {
      this.listLoading = true;
      const adminLoginToken = store.admin().adminLoginToken
      try {
        const listResp = await OrderApi.getOrderByPage(adminLoginToken, this.listQuery)
        if (listResp.data.code === 10000) {
          this.list = listResp.data.data.orders;
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
    async handleOrderJudge(row, status) {
      const adminLoginToken = store.admin().adminLoginToken
      const updateResp = await OrderApi.orderJudge(adminLoginToken, {
        orderId: row.id,
        status,
      })
      if (updateResp.data.code === 10000) {
        row.status = status;
        const index = this.list.findIndex(v => v.id === row.id);
        this.list.splice(index, 1, row);
        ElNotification({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
      }
    },
  }
});
</script>

<style scoped lang="scss">

:deep(.el-table__body tr .waitBuyerPay) {
  color: #eab308;
}

:deep(.el-table__body tr .buyerConfirm) {
  color: #3b82f6;
}

:deep(.el-table__body tr .sellerConfirm) {
  color: #22c55e;
}

:deep(.el-table__body tr .expired) {
  color: #333333;
}

:deep(.el-table__body tr .argue) {
  color: #ef4444;
}

:deep(.el-table__body tr .argueComplete) {
  color: #22c55e;
}

:deep(.el-table__body tr .argueCancel) {
  color: #333333;
}

</style>
