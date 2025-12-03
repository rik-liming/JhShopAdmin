<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.display_order_id" placeholder="订单ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" clearable />
      <el-input v-model="listQuery.buy_user_id" clearable placeholder="买家ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-input v-model="listQuery.sell_user_id" clearable placeholder="商户ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
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
      <el-table-column label="订单ID" align="center" width="170" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.display_order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家ID" align="center" width="80" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row?.buy_user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家邮箱" align="center" width="130" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.buyer?.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户ID" align="center" width="80" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row?.sell_user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户邮箱" align="center" width="130" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.seller?.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卖场" width="70px" align="center">
        <template v-slot="{row}">
          <span>{{ formatPaymentMethod(row.payment_method) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="买家账户名" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.buy_account_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家账号 / 银行卡号" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.buy_account_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家银行名称" width="250px" align="center">
        <template v-slot="{row}">
          <span>{{ row.buy_bank_name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家账号" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.buy_account_number }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="购买数量（USDT）" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="汇率" width="60px" align="center">
        <template v-slot="{row}">
          <span>{{ row.exchange_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等值人民币（元）" width="140px" align="center">
        <template v-slot="{row}">
          <span>{{ row.total_cny_price }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template v-slot="{row}">
          <span v-if="row.status !== null && row.status !== undefined" :class="getStatusClass(row.status)">{{ payStatusMap[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px" fixed="right">
        <template v-slot="{row, $index}">
          <div class="tw-flex tw-justify-center tw-gap-1 md:tw-flex-row tw-flex-col tw-items-center">
            <el-button 
              :disabled="row.status !== 4
                || !canApprove
              " 
              size="small" 
              type="success" 
              @click="handleOrderJudge(row, 5)"
            >
              争议通过
            </el-button>
            <el-button 
              :disabled="row.status !== 4
                || !canApprove
              " 
              size="small" 
              type="danger" 
              @click="handleOrderJudge(row, 6)" 
              class="!tw-ml-0 !tw-mt-2 md:!tw-ml-4 md:!tw-mt-0"
            >
              争议撤单
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.page_size" @pagination="handlePageChange" />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" :width="getAdjustWidth(380, 380, 600)" align-center>
      <el-form :model="temp" label-position="left" label-width="150px" style="width: 300px; margin:20px;">
        <el-form-item label="订单ID">
          <span>{{ temp.display_order_id }}</span>
        </el-form-item>
        <!-- <div class="tw-flex tw-flex-col md:tw-gap-10 "> -->
          <el-form-item label="买家ID">
            <span>{{ formatIdDisplay(temp?.buy_user_id) }}</span>
          </el-form-item>
          <el-form-item label="买家邮箱">
            <span>{{ temp.buyer?.email }}</span>
          </el-form-item>
          <el-form-item label="买家账户名">
            <span>{{ temp.buy_account_name }}</span>
          </el-form-item>
          <el-form-item label="买家账号" v-if="temp.payment_method !== 'bank'">
            <span>{{ temp.buy_account_number }}</span>
          </el-form-item>
          <div v-else>
            <el-form-item label="买家银行卡号">
              <span>{{ temp.buy_account_number }}</span>
            </el-form-item>
            <el-form-item label="买家银行名称">
              <span>{{ temp.buy_bank_name }}</span>
            </el-form-item>
          </div>
        <!-- </div> -->
        <!-- <div class="tw-flex tw-gap-10"> -->
          <el-form-item label="商户ID">
            <span>{{ formatIdDisplay(temp?.sell_user_id) }}</span>
          </el-form-item>
          <el-form-item label="商户邮箱">
            <span>{{ temp.seller?.email }}</span>
          </el-form-item>
          <el-form-item label="商户账户名">
            <span>{{ temp.sell_account_name }}</span>
          </el-form-item>
          <el-form-item label="商户账号" v-if="temp.payment_method !== 'bank'">
            <span>{{ temp.sell_account_number }}</span>
          </el-form-item>
          <div v-else>
            <el-form-item label="商户银行卡号">
              <span>{{ temp.sell_account_number }}</span>
            </el-form-item>
            <el-form-item label="商户银行名称">
              <span>{{ temp.sell_bank_name }}</span>
            </el-form-item>
            <el-form-item label="商户开户行名称">
              <span>{{ temp.sell_issue_bank_name }}</span>
            </el-form-item>
          </div>
        <!-- </div> -->
        <el-form-item label="卖场">
          <span>{{ formatPaymentMethod(temp.payment_method) }}</span>
        </el-form-item>
        <el-form-item label="购买数量（USDT）">
          <span>{{ temp.amount }} USDT</span>
        </el-form-item>
        <el-form-item label="汇率">
          <span>{{ temp.exchange_rate }}</span>
        </el-form-item>
        <el-form-item label="等值人民币（元）">
          <span>{{ temp.total_cny_price }} 元</span>
        </el-form-item>
        <el-form-item label="状态">
          <template v-slot="{row}">
            <span v-if="temp.status !== null && temp.status !== undefined" :class="getStatusClass(temp.status)">{{ payStatusMap[temp.status] }}</span>
          </template>
        </el-form-item>
        <el-form-item label="创建时间">
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
import * as OrderApi from '@/api/order';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { ElMessage } from 'element-plus';
import { formatIdDisplay, formatPaymentMethod, getAdjustWidth, hasActionPermission } from '@/utils/tool'

const paymentMethodOptions = [
  { key: 'alipay', display_name: '支付宝' },
  { key: 'wechat', display_name: '微信' },
  { key: 'bank', display_name: '银行卡' },
  { key: 'ecny', display_name: '数字人民币' },
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
        buy_user_id: '',
        sell_user_id: '',
        payment_method: '',
        type: 'auto',
        display_order_id: '',
      },
      isRequesting: false,
      paymentMethodOptions,
      payStatusMap,
      getStatusClass,
      temp: {},
      dialogStatus: '',
      textMap: {
        detail: '详情',
      },
      dialogFormVisible: false,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    canApprove() {
      const adminStore = store.admin()
      return hasActionPermission('/order/auto:approve', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
    },
  },
  methods: {
    parseTime,
    formatIdDisplay,
    formatPaymentMethod,
    getAdjustWidth,
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
    handleShowDetail(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'detail';
      this.dialogFormVisible = true;
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
