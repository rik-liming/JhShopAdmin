<template>
  <div class="tw-w-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
    <div class="tw-w-[360px] tw-p-2 tw-text-center">
      <!-- 顶部图标 -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-2 tw-relative">
        <div class="tw-flex tw-items-center tw-w-full">
          <img src="@/assets/logo.png" alt="logo" class="tw-w-32 tw-h-32 tw-mx-auto" />
        </div>
        <div class="tw-absolute tw-right-0 tw-flex tw-flex-col tw-items-end">
          <button class="tw-text-red-500 tw-text-sm tw-border tw-border-solid tw-border-black tw-rounded tw-px-4 tw-py-2 tw-mb-4" @click="handleClose">关闭</button>
        </div>
      </div>
      

      <!-- 标题 & 汇率 -->
      <h2 class="tw-text-lg tw-font-semibold tw-mb-10">财务变动</h2>

      <div class="tw-mb-20">
        <el-table
          :data="list"
          border
          fit
          highlight-current-row
          class="main-table"
          key="notificationTable"
          style="height: 600px; overflow: auto;"
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

      <!-- 底部版权 -->
      <p class="tw-text-xs tw-text-gray-400 tw-mt-4">Copy@ JH源禾商城</p>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { ref, onMounted, reactive, watch, defineEmits, nextTick } from 'vue';
import { fetchList } from '@/api/article';

const router = useRouter()

const handleClose = () => {
  router.push('/')
}

const handleTransfer = () => {
  router.push('/transfer/detail')
}

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
.transfer-text {
    text-decoration: underline rgb(215, 215, 215);
    text-decoration-thickness: 3px; /* 增加下划线的粗细 */
    text-underline-offset: 5px; /* 增加下划线与文字的距离 */
}

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
