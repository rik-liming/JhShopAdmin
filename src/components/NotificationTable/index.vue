<template>
    <el-table
        :data="list"
        border
        fit
        highlight-current-row
        class="main-table"
        :key="props.tableKey"
        style="height: 500px; overflow: auto;"
        @row-click="handleRowClick"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
    >
        <el-table-column label="记录编号" :width="getAdjustWidth(120)" align="center">
          <template v-slot="{row}">
            <span 
              v-if="row.business_id"
              :class="row?.status === 'read' ? 'tw-opacity-30' : ''"
            >
              {{ row.business_id }}
            </span>
            <span v-else class="opacity-30">-</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" :width="getAdjustWidth(90)" align="center">
          <template v-slot="{row}">
            <span 
              v-if="row.business_type"
              :class="row?.status === 'read' ? 'tw-opacity-30' : ''"
            >
              {{ businessTypeMap[row.business_type] }}
            </span>
            <span v-else class="opacity-30">-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" :width="getAdjustWidth(100)" align="center">
          <template v-slot="{row}">
            <span 
              v-if="row.business_id"
              :class="row?.status === 'read' ? 'tw-opacity-30' : ''"
            >
              {{ statusMap[row?.status] }}
            </span>
            <!-- <span v-if="row.status">{{ statusMap[row.status] }}</span> -->
            <!-- <span v-else class="opacity-30">-</span> -->
          </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { ref, onMounted, reactive, watch, defineEmits, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/store';
import * as MessageApi from '@/api/message'
import { getAdjustWidth } from '@/utils/tool'
import emitter from '@/event/eventBus';

const emit = defineEmits();

const adminStore = store.admin()
const appStore = store.app()

const businessTypeMap = {
  register: '注册',
  recharge: '申请充值',
  transfer: '申请转账',
  withdraw: '申请提现',
  order_argue: '订单争议',
  auto_order_argue: '自动化订单争议',
}

const statusMap = {
  read: '已读',
  unread: '未读',
  update: '未读（有状态更新）',
}

const props = defineProps({
  tableKey: Number,
});

// 定义数据
const list = ref([]);
const listQuery = reactive({
  page: 1,
  limit: 100,
});

const minTableRowCount = ref(15)
const isRefreshing = ref(false)
const touchStartY = ref(0) // 触摸开始位置
const touchMoveY = ref(0) // 触摸移动位置
const threshold = ref(50) // 下拉刷新阈值

// 获取数据的逻辑
const getList = async () => {
  try {
    emit('table-update-start');

    setTimeout(() => {
      emit('table-update-end');
    }, 100);
    
    const response = await MessageApi.getMessageList(adminStore.adminLoginToken)
    if (response.data.code === 10000) {
      const messages = response.data.data.messages;

      // 判断是否少于 15 条数据
      if (messages.length < minTableRowCount.value) {
        // 填充空数据到 15 条
        list.value = [
          ...messages, // 将接口返回的数据放在前面
          // ...Array(minTableRowCount.value - messages.length).fill({}) // 填充空数据
          ...Array.from({ length: minTableRowCount.value - messages.length }, () => ({ fakeId: Math.random() })) // 生成唯一的 fakeId
        ];
      } else {
        list.value = messages
      }
    }
  } catch (error) {
    console.error('获取数据失败', error);
    list.value = Array.from({ length: minTableRowCount.value }, () => ({ fakeId: Math.random() })) // 生成唯一的 fakeId
  }
};

// 生命周期钩子，组件加载时获取数据
onMounted(() => {
  nextTick(() => {
    // 确保 getList 在 DOM 更新后调用
    getList();
  });
});

const router = useRouter();
const handleRowClick = async(row) => {

  // 标记已读
  await MessageApi.markAsRead(adminStore.adminLoginToken, row.id)
  emitter.emit('message:read', {'admin_id': adminStore.admin?.value?.id });

  let targetPage = ''
  switch(row.business_type) {
    case 'register':
      targetPage = `/user`
      break;
    case 'recharge':
      targetPage = `/transaction/recharge`
      break;
    case 'transfer':
      targetPage = `/transaction/transfer`
      break;
    case 'withdraw':
      targetPage = `/transaction/withdraw`
      break;
    case 'order_argue':
      targetPage = `/order/normal`
      break;
    case 'auto_order_argue':
      targetPage = `/order/auto`
      break;
  }

  if (targetPage.length > 0) {
    const randomParam = Math.random()
    router.push(`${targetPage}?_t=${randomParam}`);
  }
};

const onTouchStart = (event) => {
  // 记录触摸开始的位置
  touchStartY.value = event.changedTouches[0].clientY;
}

const onTouchMove = (event) => {
  // 获取触摸移动的 Y 轴位置
  touchMoveY.value = event.changedTouches[0].clientY;

  // 如果下拉距离超过阈值，显示刷新提示
  if (touchMoveY.value - touchStartY.value > threshold.value) {
    isRefreshing.value = true;
  }
}

const onTouchEnd = () => {
  // 判断是否触发刷新
  if (touchMoveY.value - touchStartY.value > threshold.value) {
    triggerRefresh();
  } else {
    isRefreshing.value = false;
  }
}

// 触发刷新
const triggerRefresh = () => {
  isRefreshing.value = true; // 显示刷新状态
  getList()
}

watch(
  () => props.tableKey,
  (newTableKey) => {
    getList();
  },
  { immediate: true } // immediate 保证在首次渲染时监听
);

</script>

<style scoped lang="scss">
.main-table {
  width: 100%;
  background-color: transparent !important;
  border: 1px solid rgba(0,0,0,0.4) !important;
}

:deep(.el-table__header th) {
  border: 1px solid rgba(127,127,127,0.4) !important;
  background-color: transparent !important;
  font-size: 14px;
  font-weight: 600;
  color: black;
  font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC';
}

:deep(.el-table__header tr) {
  background-color: transparent !important;
}

:deep(.el-table__body td) {
  border: 1px solid rgba(127,127,127,0.2) !important;
  font-size: 13px;
  font-weight: normal;
  color: #333333;
  font-family: 'Arial Normal', 'Arial';
}

:deep(.el-table__body tr) {
  background-color: transparent !important;
  border: 1px solid rgba(127,127,127,0.4) !important;
}
</style>
