<template>
  <div class="tw-w-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
    <div class="tw-w-[360px] tw-p-2 tw-text-center">
      <!-- 顶部图标 -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-2 tw-relative">
        <div class="tw-flex tw-items-center tw-w-full">
          <img src="@/assets/sale_icon.png" alt="logo" class="tw-w-32 tw-h-32 tw-mx-auto" />
        </div>
        <div class="tw-absolute tw-right-0 tw-flex tw-flex-col tw-items-end tw-z-20">
          <button 
            class="tw-text-red-500 tw-text-sm tw-border tw-border-solid tw-border-black tw-rounded tw-px-4 tw-py-2 tw-mb-4" 
            @click="handleClose"
          >
            关闭
          </button>
        </div>
      </div>

      <!-- 标题 & 汇率 -->
      <h2 class="tw-text-lg tw-font-semibold">发布交易</h2>
      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-mb-6 tw-mt-8">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">商户号：</p>
          <p class="tw-font-semibold tw-text-right">JH001</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">总资产：</p>
          <p class="tw-font-semibold tw-text-right">1650 USDT</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">可用资产：</p>
          <p class="tw-font-semibold tw-text-right">1250 USDT</p>
        </div>
      </div>

      <!-- 出售数量 -->
      <div class="tw-mt-6 tw-text-left">
        <label class="tw-block tw-text-lg tw-mb-1">出售数量（USDT）：</label>
        <input
          type="number"
          value="350"
          class="tw-w-full tw-border tw-border-gray tw-border-solid tw-rounded-md tw-px-3 tw-py-2 tw-text-red-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
        />
      </div>

      <!-- 最低购买金额 -->
      <div class="tw-mt-4 tw-text-left">
        <label class="tw-block tw-text-lg tw-mb-1">最低购买金额</label>
        <div class="tw-relative">
          <!-- 包裹 select 的 div -->
          <select class="tw-w-1/2 tw-border tw-rounded-md tw-px-3 tw-py-2 tw-pl-3">
            <option class="">0 USDT</option>
            <option class="">100 USDT</option>
            <option class="">500 USDT</option>
          </select>
          <!-- 自定义箭头 -->
          <div class="tw-absolute tw-left-1/3 tw-top-2 tw-transform tw--translate-y-1/2 tw-text-black select-arrow">
            ▼
          </div>
        </div>
      </div>

      <!-- 卖场选择 -->
      <div class="tw-mt-4 tw-text-left">
        <label class="tw-block tw-text-sm tw-mb-1">卖场选择</label>
        <div class="tw-relative">
            <select class="tw-w-1/2 tw-border tw-rounded-md tw-px-3 tw-py-2">
            <option>支付宝</option>
            <option>微信</option>
            <option>银行卡</option>
            </select>
            <!-- 自定义箭头 -->
            <div class="tw-absolute tw-left-1/3 tw-top-2 tw-transform tw--translate-y-1/2 tw-text-black select-arrow">
            ▼
            </div>
        </div>
      </div>

      <!-- 按钮 -->
      <button
        class="tw-w-full tw-bg-rose-500 tw-text-white tw-font-semibold tw-rounded-full tw-py-2 tw-mt-14 hover:tw-bg-rose-600"
        @click="handlePublish"
      >
        发布
      </button>
      <button 
        class="tw-w-full tw-text-red-500 tw-font-medium tw-py-2 tw-mt-2"
        @click="handleClose"
      >
        取消
      </button>

      <!-- 底部版权 -->
      <p class="tw-text-xs tw-text-gray-400 tw-mt-4">Copy@ JH嘉禾商城</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const handleClose = () => {
  router.push('/')
}

const handlePublish = () => {
  alert('publish');
  router.push('/')
}
</script>

<style scoped lang="scss">
/* select 去除浏览器默认的箭头 */
select {
  appearance: none; /* 去除默认箭头 */
  -webkit-appearance: none; /* Safari 和 Chrome */
  -moz-appearance: none; /* Firefox */
}

/* 自定义的下拉箭头 */
.tw-relative select {
  padding-right: 30px; /* 给右侧留出空间，显示箭头 */
}

.select-arrow {
  pointer-events: none; /* 防止箭头干扰 select 的点击 */
  font-size: 16px; /* 箭头的大小 */
}
</style>
