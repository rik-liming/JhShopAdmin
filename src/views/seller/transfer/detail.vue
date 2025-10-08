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
      <div class="tw-relative">
          <h1 class="tw-text-left tw-text-2xl tw-mt-14 tw-mb-10">转账详情</h1>
      </div>

      <!-- 用户信息 -->
      <div class="tw-my-4">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">商户号：</p>
          <p class="tw-font-semibold tw-text-right">JH001</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">总资产：</p>
          <p class="tw-font-semibold tw-text-right">1650 USDT</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">转账金额：</p>
          <p class="tw-font-semibold tw-text-right tw-text-red-600">1250 USDT</p>
        </div>
      </div>

      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-my-6">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">USDT币价：</p>
          <p class="tw-font-semibold tw-text-right">JH001</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">USDT金额：</p>
          <p class="tw-font-semibold tw-text-right">1650 USDT</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">CNY金额：</p>
          <p class="tw-font-semibold tw-text-right">1250 USDT</p>
        </div>
      </div>

      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-my-6">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">对方商户号：</p>
          <p class="tw-font-semibold tw-text-right">JH001</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">充值时间：</p>
          <p class="tw-font-semibold tw-text-right">JH001</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">订单编号：</p>
          <p class="tw-font-semibold tw-text-right">1650 USDT</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">订单状态：</p>
          <p class="tw-font-semibold tw-text-right tw-text-red-600">等待平台确认</p>
        </div>
      </div>

      <!-- 按钮 -->
      <button
        class="tw-w-full tw-bg-rose-500 tw-text-white tw-font-semibold tw-rounded-full tw-py-2 tw-mt-14 hover:tw-bg-rose-600"
        @click="handleConfirm"
      >
        我已知晓
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

const handleConfirm = () => {
  alert('确认');
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

.tw-relative .tw-absolute {
  pointer-events: none; /* 防止箭头干扰 select 的点击 */
  font-size: 16px; /* 箭头的大小 */
}
</style>
