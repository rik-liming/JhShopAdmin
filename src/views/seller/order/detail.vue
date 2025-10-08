<template>
  <div class="tw-w-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
    <div class="tw-w-[360px] tw-p-2 tw-text-center">
      <!-- 顶部图标 -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-10 tw-relative">
        <h1 class="tw-text-left tw-text-2xl">订单详情</h1>
        <div class="tw-absolute tw-right-0 tw-flex tw-flex-col tw-items-end">
          <button class="tw-text-red-500 tw-text-sm tw-border tw-border-solid tw-border-black tw-rounded tw-px-4 tw-py-2 tw-mb-4" @click="handleClose">关闭</button>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="tw-my-4">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">商家姓名：</p>
          <p class="tw-font-semibold tw-text-right">曾智</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">收款方式：</p>
          <p class="tw-font-semibold tw-text-right">支付宝</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">收款账号：</p>
          <p class="tw-font-semibold tw-text-right">3235522@163.com</p>
        </div>
      </div>

      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-my-4">
        <div class="tw-flex tw-justify-between tw-space-x-4 tw-items-center">
          <p class="tw-text-left">收款码：</p>
          <img src="@/assets/sample_payment.png" alt="payment" class="tw-w-32 tw-h-40 tw-mx-auto" />
        </div>
      </div>

      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-my-4">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">买家姓名：</p>
          <p class="tw-font-semibold tw-text-right">郭子仪</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">付款方式</p>
          <p class="tw-font-semibold tw-text-right">支付宝</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">付款账户：</p>
          <p class="tw-font-semibold tw-text-right">52355@qq.com</p>
        </div>
      </div>

      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-my-4">
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
          <p class="tw-font-semibold tw-text-right">等待平台确认</p>
        </div>
      </div>

      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-my-4">
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
          <p class="tw-font-semibold tw-text-right tw-text-red-600">等待买家付款</p>
        </div>
      </div>

      <!-- 按钮 -->
      <button
        class="tw-w-full tw-bg-rose-500 tw-text-white tw-font-semibold tw-rounded-full tw-py-2 tw-mt-6 hover:tw-bg-rose-600"
        @click="handleConfirm"
      >
        确认收款
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

const handleConfirm = () => {
  alert('确认');
  router.push('/')
}
</script>

<style scoped lang="scss">
</style>
