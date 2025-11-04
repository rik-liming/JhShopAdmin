<template>
  <div class="app-container">
    <div class="filter-container tw-flex !tw-items-center">
      <el-date-picker
        v-model="listQuery.startTime"
        type="date"
        placeholder="选择开始时间"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        class="tw-w-full tw-mr-2"
      />
      ~
      <el-date-picker
        v-model="listQuery.endTime"
        type="date"
        placeholder="选择结束时间"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        class="tw-w-full tw-mx-2"
      />
      <el-button class="filter-item tw-mt-2" type="primary" :icon="iconSearch" @click="handleFilter">
        <span v-waves>搜索</span>
      </el-button>
      <el-button class="filter-item tw-mt-2" type="primary" :icon="iconCalendar" @click="handleCheckToday">
        <span v-waves>查看当日</span>
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; height: 580px; overflow: auto;"
    >
      <el-table-column label="日期" width="250px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.report_date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理ID" align="center" width="250px" >
        <template v-slot="{row}">
          <span>{{ formatIdDisplay(row?.user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="250px" align="center">
        <template v-slot="{row}">
          <span>成功</span>
        </template>
      </el-table-column>
      <el-table-column label="日成交笔数" width="250px" align="center">
        <template v-slot="{row}">
          <span>{{ row.order_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日成交总额" width="250px" align="center">
        <template v-slot="{row}">
          <span>{{ row.total_amount }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue';
import { Search, Edit, Calendar } from '@element-plus/icons-vue';
import * as ReportApi from '@/api/report';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import { ElMessage } from 'element-plus';
import { formatIdDisplay, formatPaymentMethod } from '@/utils/tool'
import dayjs from 'dayjs';

const paymentMethodOptions = [
  { key: 'alipay', display_name: '支付宝' },
  { key: 'wechat', display_name: '微信' },
  { key: 'bank', display_name: '银行卡' },
];
const statusMap = {
  '0': '已下线',
  '1': '正常',
}
const statusFilterMap = {
  '0': 'danger',
  '1': 'success',
};

export default defineComponent({
  name: 'AgentReport',
  directives: { waves },
  data() {
    return {
      iconSearch: markRaw(Search),
      iconEdit: markRaw(Edit),
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        startTime: (new Date().toISOString().split('T')[0]),
        endTime: (new Date().toISOString().split('T')[0]),
        type: 'autoBuyer',
      },
      minTableRowCount: 15,
      isRequesting: false,
      paymentMethodOptions,
      statusMap,
      statusFilterMap,
    };
  },
  created() {
    this.generateTodayReport();
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
        const listResp = await ReportApi.getReportList(adminLoginToken, this.listQuery)
        if (listResp.data.code === 10000) {
          this.list = listResp.data.data.reports;
        } else {
          ElMessage.error(listResp.data.msg)
        } 
      } catch (error) {
        console.log(error)
      } finally {
        this.listLoading = false
      }
    },
    async generateTodayReport() {
      const adminLoginToken = store.admin().adminLoginToken
      try {
        await ReportApi.generateTodayReport(adminLoginToken)
      } catch (error) {
        console.log(error)
      } finally {
      }
    },
    async handlePageChange() {
      if (this.isRequesting) return; // 如果正在请求，则不重复请求

      this.isRequesting = true; // 开始请求
      await this.getList();
      this.isRequesting = false; // 请求完成
    },
    handleFilter() {
      this.getList();
    },
    handleCheckToday() {
      const todayStr = dayjs().format('YYYY-MM-DD');
      this.listQuery.startTime = todayStr;
      this.listQuery.endTime = todayStr;

      this.getList();
    }
  }
});
</script>
