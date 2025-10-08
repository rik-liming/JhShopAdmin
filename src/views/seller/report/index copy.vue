<template>
  <div class="tw-bg-gradient-to-b tw-from-blue-100 tw-to-blue-300 tw-p-6 tw-rounded-lg tw-w-96">
    <div class="tw-flex tw-justify-between tw-items-center">
      <h2 class="tw-text-2xl tw-font-semibold tw-text-blue-800">团队报表</h2>
      <button @click="close" class="tw-text-white tw-bg-red-500 tw-px-4 tw-py-2 tw-rounded-lg">
        关闭
      </button>
    </div>

    <div class="tw-mt-4">
      <div class="tw-flex tw-justify-between tw-items-center">
        <input type="text" v-model="dateRange" class="tw-p-2 tw-border tw-rounded-md" placeholder="2025-08-05 ~ 2025-08-22" />
        <div>
          <button @click="toggleView" class="tw-text-lg tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded-full">
            <span v-if="isIndividual">个人报表</span>
            <span v-else>团队报表</span>
          </button>
        </div>
      </div>

      <table class="tw-w-full tw-mt-4 tw-border-collapse tw-border tw-border-gray-300">
        <thead>
          <tr>
            <th class="tw-border tw-px-4 tw-py-2 tw-text-left">日期+订单编号</th>
            <th class="tw-border tw-px-4 tw-py-2 tw-text-left">
              <span v-if="isIndividual">商户</span>
              <span v-else>成员</span>
            </th>
            <th class="tw-border tw-px-4 tw-py-2 tw-text-center">订单状态</th>
            <th class="tw-border tw-px-4 tw-py-2 tw-text-center">金额USDT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="index">
            <td class="tw-border tw-px-4 tw-py-2">{{ item.date }}</td>
            <td class="tw-border tw-px-4 tw-py-2">{{ item.member }}</td>
            <td class="tw-border tw-px-4 tw-py-2 tw-text-center">{{ item.status }}</td>
            <td class="tw-border tw-px-4 tw-py-2 tw-text-center">{{ item.amount }}</td>
          </tr>
        </tbody>
      </table>

      <div class="tw-mt-4 tw-flex tw-justify-between">
        <span v-if="isIndividual">总计：{{ totalAmountIndividual }} USDT</span>
        <span v-else>总人数：{{ totalMembers }} 总计：{{ totalAmountTeam }} USDT</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isIndividual = ref(false); // 控制报表类型（个人 / 团队）
const dateRange = ref('2025-08-05 ~ 2025-08-22'); // 日期范围
const filteredData = ref([
  { date: '20250706_068', member: 'JH012', status: '成功', amount: 100 },
  { date: '20250706_066', member: 'JH023', status: '成功', amount: 88 },
  { date: '20250706_053', member: 'JH015', status: '成功', amount: 125 },
  { date: '20250706_048', member: 'JH095', status: '成功', amount: 95 },
  { date: '20250706_030', member: 'JH063', status: '成功', amount: 150 },
  { date: '20250706_021', member: 'JH035', status: '成功', amount: 220 },
  { date: '20250706_006', member: 'JH035', status: '成功', amount: 130 }
]);

// 计算团队报表的总人数和总金额
const totalMembers = computed(() => filteredData.value.length);
const totalAmountTeam = computed(() => {
  return filteredData.value.reduce((total, item) => total + item.amount, 0);
});

// 计算个人报表的总金额
const totalAmountIndividual = computed(() => {
  return filteredData.value
    .filter(item => item.member === 'JH001') // 仅显示 'JH001' 的记录
    .reduce((total, item) => total + item.amount, 0);
});

// 切换报表类型
const toggleView = () => {
  isIndividual.value = !isIndividual.value;
};

// 关闭按钮功能
const close = () => {
  // 这里可以添加关闭操作，例如隐藏组件
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  background: #e6f1f7;
  border-radius: 10px;
  padding: 20px;
}

.tw-text-red {
  color: #e74c3c;
}

.tw-bg-gradient-to-b {
  background: linear-gradient(to bottom, #e6f1f7, #7fb3d5);
}

.tw-text-blue-800 {
  color: #1d4b73;
}

.tw-px-4,
.tw-py-2 {
  padding: 0.5rem 1rem;
}

.tw-text-lg {
  font-size: 1.125rem;
}

.tw-w-full {
  width: 100%;
}

.tw-border-collapse {
  border-collapse: collapse;
}

.tw-border {
  border: 1px solid #ddd;
}

.tw-text-left {
  text-align: left;
}

.tw-text-center {
  text-align: center;
}

.tw-mt-4 {
  margin-top: 1rem;
}

.tw-flex {
  display: flex;
}

.tw-justify-between {
  justify-content: space-between;
}

.tw-bg-red-500 {
  background-color: #e74c3c;
}

.tw-bg-blue-500 {
  background-color: #3498db;
}

.tw-rounded-lg {
  border-radius: 0.5rem;
}
</style>
