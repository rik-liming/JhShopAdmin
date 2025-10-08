<template>
  <div class="tw-w-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
    <div class="tw-w-[360px] tw-p-2 tw-text-center">
      <!-- 顶部图标 -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-2 tw-relative">
        <div class="tw-flex tw-flex-col tw-items-center tw-w-full">
          <div class="">
            <h2 class="tw-text-3xl tw-font-semibold">团队报表</h2>
          </div>
          <div class="tw-flex tw-gap-10 tw-mt-6 tw-mb-4">
            <img src="@/assets/person_icon.svg" alt="person" class="tw-w-12 tw-h-12 tw-mx-auto" @click="handleTableTypeChange('person')" />
            <img src="@/assets/group_icon.svg" alt="group" class="tw-w-12 tw-h-12 tw-mx-auto" @click="handleTableTypeChange('group')" />
          </div>
        </div>
        <div class="tw-absolute tw-right-0 tw-flex tw-flex-col tw-items-end">
          <button class="tw-text-red-500 tw-text-sm tw-border tw-border-solid tw-border-black tw-rounded tw-px-4 tw-py-2 tw-mb-4" @click="handleClose">关闭</button>
        </div>
      </div>

      <div class="tw-w-full tw-flex tw-gap-4 tw-mb-4">
        <!-- 开始时间选择器 -->
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD"
          class="tw-w-full"
        />
        
        ~

        <!-- 结束时间选择器 -->
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD"
          class="tw-w-full"
        />
      </div>

      <!-- 包裹表格的容器 -->
      <div 
        class="table-wrapper" 
        :class="{ 
          'animate': animate,
          'from-left': listQuery.tableType === 'person', 
          'from-right': listQuery.tableType === 'group'
        }"
      >
        <person-table
          :tableType="listQuery.tableType"
          @table-update-start="handleTableUpdateStart"
          @table-update-end="handleTableUpdateEnd"
          v-show="listQuery.tableType == 'person'"
        ></person-table>
        <group-table
          :tableType="listQuery.tableType"
          @table-update-start="handleTableUpdateStart"
          @table-update-end="handleTableUpdateEnd"
          v-show="listQuery.tableType == 'group'"
        ></group-table>
      </div>

      <!-- 按钮 -->
      <button
        class="tw-w-full tw-bg-rose-500 tw-text-white tw-font-semibold tw-rounded-full tw-py-2 tw-mt-10 hover:tw-bg-rose-600"
        @click="handleClose"
      >
        关闭
      </button>

      <!-- 底部版权 -->
      <p class="tw-text-xs tw-text-gray-400 tw-mt-4">Copy@ JH嘉禾商城</p>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { ref, reactive, watch, nextTick } from 'vue'
import PersonTable from './components/PersonTable.vue'
import GroupTable from './components/GroupTable.vue'

const router = useRouter()
const startTime = ref(null);
const endTime = ref(null);

const animate = ref(false)
const tableWrapper = ref(null)

const listQuery = reactive({
  tableType: 'person',
})

const handleClose = () => {
  router.push('/')
}

const handleWithdraw = () => {
  router.push('/withdraw/detail')
}

const handleTableTypeChange = (tableType) => {
  listQuery.tableType = tableType
}

function handleTableUpdateStart() {
  if (tableWrapper.value) {
    scrollTopCache = tableWrapper.value.scrollTop
  }
  animate.value = false;
}

async function handleTableUpdateEnd() {
  nextTick(() => {
    if (tableWrapper.value) {
      tableWrapper.value.scrollTop = scrollTopCache
    }
  })

  // 增加一定延时，以便播放动画效果
  await new Promise(resolve => setTimeout(resolve, 300));
  animate.value = true;
}

watch(() => listQuery.tableType, async () => {
  animate.value = false
  await nextTick()
  setTimeout(() => {
    animate.value = true
  }, 300)
})

</script>

<style scoped lang="scss">
.table-wrapper {
  position: relative;
  // left: -100%; /* 初始位置在屏幕外 */
  transform: translateY(-50%); /* 垂直居中 */
  color: white;
  // transition: left 1s ease-out;
  // transition: left 1s cubic-bezier(0.1, 0, 0.5, 1); /* 自定义贝塞尔曲线 */
  visibility: hidden;
}

.table-wrapper.from-left {
  left: -100%; /* 初始位置在屏幕外 */
  transition: left 1s ease-out;
}

.table-wrapper.from-right {
  left: 100%; /* 初始位置在屏幕外 */
  transition: left 1s ease-out;
}

.table-wrapper.animate {
  left: 50%; /* 结束时 div 移动到屏幕中央 */
  // transform: translateX(-50%) translateY(-50%); /* 确保居中 */
  transform: translateX(-50%); /* 确保居中 */
  visibility: visible;
}


// .table-wrapper {
//   position: relative;
//   left: -100%; /* 初始位置在屏幕外 */
//   transform: translateY(-50%); /* 垂直居中 */
//   color: white;
//   visibility: hidden;
//   transition: transform 1s ease-out; /* 使用transform来控制动画 */
// }

// .table-wrapper.from-left {
//   transform: translateX(-100%) translateY(-50%); /* 从左侧进入 */
// }

// .table-wrapper.from-right {
//   transform: translateX(100%) translateY(-50%); /* 从右侧进入 */
// }

// .table-wrapper.animate {
//   visibility: visible;
// }

</style>