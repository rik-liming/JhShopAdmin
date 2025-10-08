<template>
    <el-table
        :data="list"
        border
        fit
        highlight-current-row
        class="main-table"
        key="financeTable"
        style="height: 600px; overflow: auto;"
        @row-click="handleRowClick"
    >
        <el-table-column label="财务变动" width="'40%'" align="center">
            <template v-slot="{row}">
            <span>{{ row.author }}</span>
            </template>
        </el-table-column>
        <el-table-column label="金额" width="'20%'" align="center">
            <template v-slot="{row}">
            <span>{{ row.author }}</span>
            </template>
        </el-table-column>
        <el-table-column label="类型" width="'20%'" align="center">
            <template v-slot="{row}">
            <span>{{ row.author }}</span>
            </template>
        </el-table-column>
        <el-table-column label="余额" width="'20%'" align="center">
            <template v-slot="{row}">
            <span>{{ row.author }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { ref, onMounted, reactive, watch, defineEmits, nextTick } from 'vue';
import { fetchList } from '@/api/article';
import { useRouter } from 'vue-router';

const emit = defineEmits();

const props = defineProps({
  channel: String,
  tableType: String,
});

// 定义数据
const list = ref([]);
const listQuery = reactive({
  page: 1,
  limit: 20,
  channel: props.channel,
  title: undefined,
  tableType: 'finance',
  sort: '+id'
});

// 用于防止重复调用的标志位
let isFirstCall = true;

// 获取数据的逻辑
const getList = async () => {
  try {
    emit('table-update-start');
    if (listQuery.channel == 'ali_pay') {
        listQuery.page = 1
    } else if (listQuery.channel == 'bank_pay') {
        listQuery.page = 2
    } else if (listQuery.channel == 'wechat_pay') {
        listQuery.page = 3
    }
    const response = await fetchList(listQuery);
    emit('table-update-end');
    list.value = response.data.items;
  } catch (error) {
    console.error('获取数据失败', error);
  }
};

// 监听 channel 变化，获取数据
watch(
  () => props.channel,
  (newChannel) => {
    // 只有在 channel 变化时，才更新数据
    listQuery.channel = newChannel;
    
    // 确保只有在 channel 改变时才调用 getList
    if (!isFirstCall && props.tableType === 'finance') {
      getList();
    } else {
      isFirstCall = false; // 第一次加载后设置为 false
    }
  },
  { immediate: true } // immediate 保证在首次渲染时监听
);

watch(
  () => props.tableType,
  (newTableType) => {
    // 只有在 channel 变化时，才更新数据
    listQuery.tableType = newTableType;
    
    // 确保只有在 channel 改变时才调用 getList
    if (!isFirstCall && props.tableType === 'finance') {
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

const router = useRouter();
const handleRowClick = (row) => {
  // 根据点击的行的数据，构造目标路由地址
  const targetPage = `/deposit/detail?transactionId=${row.id}`;
  router.push(targetPage);
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
</style>
