<template>
  <div class="dashboard-editor-container">

    <panel-group :summary="summary" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="displayChartData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup';
import LineChart from './components/LineChart';
import { defineComponent, onMounted  } from 'vue';
import * as StatApi from '@/api/stat'

const summary = {
  'completed': {
    'count': 44,
    'amount': 1475.00,
    'chart': [100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0]
  },
  'ongoing': {
    'count': 39,
    'amount': 458.00,
    'chart': [200, 222, 188, 134, 105, 160, 165, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0]
  },
  'hanged': {
    'count': 100,
    'amount': 45448.00,
    'chart': [400, 78, 161, 99, 105, 160, 165, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0]
  },
}

const lineChartData = {
  completedOrder: {
    orderData: [100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0],
  },
  ongoingOrder: {
    orderData: [200, 192, 120, 144, 160, 130, 140, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0],
  },
  hangedOrder: {
    orderData: [80, 100, 121, 104, 105, 90, 100, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0, 0],
  },
};

export default defineComponent({
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
  },
  data() {
    return {
      displayChartData: [
          '0', '0', '0', '0', '0', '0',
          '0', '0', '0', '0', '0', '0',
          '0', '0', '0', '0', '0', '0',
          '0', '0', '0', '0', '0', '0',
      ],
      summary: summary
    };
  },
  methods: {
    handleSetLineChartData(type) {
      this.displayChartData = summary[type].chart;
    },
    async fetchStatData() {
      const statResp = await StatApi.getDashboardSummary()
      lineChartData.completedOrder
    }
  },
  mounted() {
    this.fetchStatData(); // 页面加载时请求数据
  }
});
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
