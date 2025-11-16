<template>
  <div class="dashboard-editor-container">

    <!-- 传入 statData 数据 -->
    <panel-group :statData="statData" @handleSetLineChartData="handleSetLineChartData" />

    <!-- 折线图部分 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="displayChartData" />
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import * as StatApi from '@/api/stat'
import store from '@/store';

const adminStore = store.admin()

const statData = ref({
  order_summary: {
    completed: {
      count: 44,
      amount: 1475.0,
      chart: [100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0]
    },
    hanged: {
      count: 100,
      amount: 45448.0,
      chart: [400, 78, 161, 99, 105, 160, 165, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0]
    }
  },
  recharge_summary: {
    completed: {
      count: 88,
      amount: 815.0,
      chart: [20, 100, 151, 114, 105, 160, 165, 0, 0, 0, 0, 0, 100, 120, 161, 134, 105, 160, 165, 0, 0, 0, 0, 0]
    },
  }
})

// 折线图显示的数据（默认全 0）
const displayChartData = ref(
  Array(24).fill(0)
)

// ==========================
// 方法定义
// ==========================

// 切换折线图数据
const handleSetLineChartData = (type) => {
  switch (type) {
    case 'order_completed':
      displayChartData.value = statData.value.order_summary['completed']?.chart || Array(24).fill(0)
      break;
    case 'order_hanged':
      displayChartData.value = statData.value.order_summary['hanged']?.chart || Array(24).fill(0)
      break;
    case 'recharge_completed':
      displayChartData.value = statData.value.recharge_summary['completed']?.chart || Array(24).fill(0)
      break;
  }
}

// 异步获取统计数据
const fetchStatData = async () => {
  try {
    const statResp = await StatApi.getDashboardSummary(adminStore?.adminLoginToken)
    if (statResp.data.code === 10000) {
      statData.value = statResp.data.data

      // 默认显示第一个状态的图表
      handleSetLineChartData('order_completed')
    }
  } catch (err) {
    console.error('获取统计数据失败:', err)
  }
}

// 页面加载时请求数据
onMounted(() => {
  fetchStatData()
})
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
