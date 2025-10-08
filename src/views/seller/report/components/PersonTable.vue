<template>
  <div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      class="main-table"
      key="personTable"
      style="height: 500px; overflow: auto;"
      @row-click="handleRowClick"
    >
      <el-table-column label="日期" align="center">
        <template v-slot="{ row }">
          <span>{{ `20250706_0074` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户" align="center">
        <template v-slot="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" min-width="90">
        <template v-slot="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template v-slot="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 固定的底部行 -->
    <div class="sticky-bottom">
      <span class="tw-mr-4">总计：1325</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, defineEmits, nextTick } from 'vue';
import { fetchList } from '@/api/article';
import { useRouter } from 'vue-router';
import store from '@/store';

const emit = defineEmits();

const props = defineProps({
  tableType: String,
});

const userStore = store.user()

// 定义数据
const list = ref([]);
const listQuery = reactive({
  page: 1,
  limit: 100,
  tableType: props.tableType,
});

// 用于防止重复调用的标志位
let isFirstCall = true;

// 获取数据的逻辑
const getList = async () => {
  try {
    emit('table-update-start');
    listQuery.page = 1
    const response = await fetchList(listQuery);
    emit('table-update-end');
    list.value = response.data.items;
  } catch (error) {
    console.error('获取数据失败', error);
  }
};

watch(
  () => props.tableType,
  (newTableType) => {
    // 只有在 channel 变化时，才更新数据
    listQuery.tableType = newTableType;
    
    // 确保只有在 channel 改变时才调用 getList
    if (!isFirstCall && props.tableType === 'person') {
      getList();
    } else {
      isFirstCall = false; // 第一次加载后设置为 false
    }
  },
  { immediate: true } // immediate 保证在首次渲染时监听
);

// 生命周期钩子，组件加载时获取数据
onMounted(() => {
  nextTick(() => {
    // 确保 getList 在 DOM 更新后调用
    getList();
  });
});

// 跳转到指定页面
const router = useRouter();

const handleRowClick = (row) => {
  const role = userStore.user?.value?.role
  if (role === 'buyer') {
    // 根据点击的行的数据，构造目标路由地址
    const targetPage = `/order/buyer/buy?tradeId=${row.id}`; // 假设根据 row.id 构造跳转路径
    router.push(targetPage); // 跳转到 /buy 页面，带上 tradeId 参数
  }
};
</script>

<style scoped lang="scss">
.main-table {
  width: 100%;
  background-color: transparent !important;
  border: 1px solid black !important;
}

:deep(.el-table__header th) {
  border: 1px solid #7f7f7f !important;
  background-color: transparent !important;
  font-size: 16px;
  font-weight: bold;
  color: black;
}

:deep(.el-table__header tr) {
  background-color: transparent !important;
}

:deep(.el-table__body td) {
  border: 1px solid #7f7f7f !important;
}

:deep(.el-table__body tr) {
  background-color: transparent !important;
  border: 1px solid #7f7f7f !important;
}

.sticky-bottom {
  position: sticky;
  bottom: 0;
  border: 1px solid black;
  z-index: 10;
  padding: 10px;
  color: black;
  text-align: right;
}
</style>
