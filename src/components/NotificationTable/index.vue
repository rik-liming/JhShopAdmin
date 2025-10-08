<template>
  <div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      class="main-table"
      key="notificationTable"
      style="height: 500px; overflow: auto;"
    >
      <el-table-column label="日期" align="center">
        <template v-slot="{ row }">
          <span>{{ `20250706_0074` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template v-slot="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="90">
        <template v-slot="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, defineEmits, nextTick } from 'vue';
import { fetchList } from '@/api/article';

// 定义数据
const list = ref([]);
const listQuery = reactive({
  page: 1,
  limit: 100,
});

// 获取数据的逻辑
const getList = async () => {
  try {
    listQuery.page = 1
    const response = await fetchList(listQuery);
    list.value = response.data.items;
  } catch (error) {
    console.error('获取数据失败', error);
  }
};

// 生命周期钩子，组件加载时获取数据
onMounted(() => {
  nextTick(() => {
    // 确保 getList 在 DOM 更新后调用
    getList();
  });
});
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
</style>
