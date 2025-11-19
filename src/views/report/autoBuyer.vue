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
      <el-table-column label="日期" width="180px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.report_date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家ID" align="center" width="150px" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row?.user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家邮箱" width="200px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.user_email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="300px" align="center">
        <template v-slot="{row}">
          <el-tag type="success">
            {{ `成功` }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日成交笔数" width="320px" align="center">
        <template v-slot="{row}">
          <span>{{ row.order_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日成交总额（USDT）" width="320px" align="center">
        <template v-slot="{row}">
          <span>{{ row.total_amount }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="400" align-center>
      <el-form :model="temp" label-position="left" label-width="150px" style="width: 300px; margin-left:50px;">
        <el-form-item label="日期">
          <template v-slot="{row}">
            <span>{{ parseTime(temp.report_date, '{y}-{m}-{d}') }}</span>
          </template>
        </el-form-item>
        <el-form-item label="买家ID">
          <span>{{ formatIdDisplay(temp.user_id) }}</span>
        </el-form-item>
        <el-form-item label="买家邮箱">
          <span>{{ temp.user_email }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <template v-slot="{row}">
            <el-tag type="success">
              {{ '成功' }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="日成交笔数">
          <span>{{ temp.order_count }}</span>
        </el-form-item>
        <el-form-item label="日成交总额（USDT）">
          <span>{{ temp.total_amount }}</span>
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
  name: 'AutoBuyerReport',
  directives: { waves },
  data() {
    return {
      iconSearch: markRaw(Search),
      iconEdit: markRaw(Edit),
      iconCalendar: markRaw(Calendar),
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        startTime: dayjs().format('YYYY-MM-DD'),
        endTime: dayjs().format('YYYY-MM-DD'),
        type: 'autoBuyer',
      },
      minTableRowCount: 15,
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
    this.init()
  },
  methods: {
    parseTime,
    formatIdDisplay,
    formatPaymentMethod,
    async init() {
      await this.generateTodayReport();
      this.getList();
    },
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
    },
    handleShowDetail(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'detail';
      this.dialogFormVisible = true;
    },
  }
});
</script>
