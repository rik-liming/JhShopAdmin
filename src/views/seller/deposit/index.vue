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
          <p class="tw-text-sm tw-text-gray-600 tw-mb-2">市场汇率：<span class="tw-text-red-500">7.26</span></p>
        </div>
      </div>
      

      <!-- 标题 & 汇率 -->
      <h2 class="tw-text-lg tw-font-semibold">充值</h2>
      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-mb-4">
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


      <!-- 地址展示 -->
      <div class="tw-text-left tw-mb-3">
        <p class="tw-font-medium">接收地址（平台）：USDT-TRC20</p>
        <div
          class="tw-w-full tw-bg-gray-100 tw-rounded-md tw-border tw-border-gray-300 tw-px-2 tw-py-1 tw-break-all tw-text-sm tw-mt-1"
        >
          TAqVNKoVVfVKLU31s3tPBdhRZFKgJVeRH5
        </div>
      </div>

      <!-- 输入金额 -->
      <input
        type="text"
        placeholder="请输入充值金额（此处字体透明度35%）"
        class="tw-w-full tw-border tw-border-solid tw-border-gray tw-rounded-md tw-px-3 tw-py-2 tw-text-sm tw-placeholder-gray-400 tw-mb-4"
      />

      <!-- 上传截图 -->
      <div class="tw-text-left tw-mb-3">
        <p class="tw-font-medium tw-mb-3">上传充值截图（必选）</p>

        <CustomFileUpload v-model:file="imageFile" />
      </div>

      <!-- 按钮 -->
      <button
        class="tw-w-full tw-bg-rose-500 tw-text-white tw-font-semibold tw-rounded-full tw-py-2 tw-mt-4 hover:tw-bg-rose-600"
        @click="handleDeposit"
      >
        立即充值
      </button>
      <button 
        class="tw-w-full tw-text-red-500 tw-font-medium tw-py-2 tw-mt-2"
        @click="handleClose"
      >
        取消
      </button>

      <!-- 底部版权 -->
      <p class="tw-text-xs tw-text-gray-400 tw-mt-4">Copy@ JH源禾商城</p>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import CustomFileUpload from '@/components/CustomFileUpload';
import { ref } from 'vue'

const imageFile = ref(null)

const router = useRouter()

const handleClose = () => {
  router.push('/')
}

const handleDeposit = () => {
  console.log(imageFile)
  alert('deposit!');
  router.push('/deposit/detail')
}
</script>