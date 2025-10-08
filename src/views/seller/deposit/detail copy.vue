<template>
  <div class="tw-bg-gradient-to-b tw-from-sky-100 tw-to-sky-200 tw-rounded-2xl tw-w-[380px] tw-mx-auto tw-shadow-lg tw-overflow-hidden">
    <!-- 关闭按钮 -->
    <div class="tw-flex tw-justify-end tw-p-3">
      <button class="tw-text-red-500 tw-border tw-border-red-500 tw-text-sm tw-rounded tw-px-2">关闭</button>
    </div>

    <!-- 图标 -->
    <div class="tw-flex tw-justify-center tw-mb-3">
      <img src="@/assets/logo.png" alt="logo" class="tw-w-20 tw-h-20 tw-rounded-full" />
    </div>

    <!-- 标题 -->
    <h2 class="tw-text-center tw-font-bold tw-text-lg tw-mb-4">充值详情</h2>

    <!-- 信息块 -->
    <div class="tw-px-6 tw-space-y-2">
      <div class="tw-flex tw-justify-between">
        <span>商户号：</span>
        <span class="tw-font-medium">JH001</span>
      </div>
      <div class="tw-flex tw-justify-between">
        <span>总资产：</span>
        <span class="tw-font-medium">1650 USDT</span>
      </div>
      <div class="tw-flex tw-justify-between">
        <span>充值金额：</span>
        <span class="tw-text-red-500 tw-font-bold">126 USDT</span>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="tw-my-4 tw-border-t tw-border-gray-300"></div>

    <!-- 金额信息 -->
    <div class="tw-px-6 tw-space-y-2">
      <div class="tw-flex tw-justify-between">
        <span>USDT币价：</span>
        <span>7.16 元</span>
      </div>
      <div class="tw-flex tw-justify-between">
        <span>USDT金额：</span>
        <span>$ 126</span>
      </div>
      <div class="tw-flex tw-justify-between">
        <span>CNY金额：</span>
        <span>902.16 元</span>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="tw-my-4 tw-border-t tw-border-gray-300"></div>

    <!-- 底部信息 -->
    <div class="tw-px-6 tw-space-y-2 tw-text-sm">
      <div class="tw-flex tw-justify-between">
        <span>充值时间：</span>
        <span>2025-07-16 18:30:15</span>
      </div>
      <div class="tw-flex tw-justify-between">
        <span>订单编号：</span>
        <span>202507161830150003</span>
      </div>
      <div class="tw-flex tw-justify-between">
        <span>订单状态：</span>
        <span class="tw-text-red-500">等待平台确认</span>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="tw-flex tw-justify-center tw-mt-6 tw-mb-4">
      <button class="tw-bg-pink-500 tw-text-white tw-px-8 tw-py-2 tw-rounded-full tw-text-lg hover:tw-bg-pink-600">
        我已知道
      </button>
    </div>

    <!-- 底部版权 -->
    <div class="tw-text-center tw-text-xs tw-text-gray-400 tw-pb-2">
      Copy@ JH演示商城
    </div>
  </div>
</template>

<script setup>
// 这里可以接收 props 或者从 API 获取数据
</script>
