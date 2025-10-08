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
      <h2 class="tw-text-lg tw-font-semibold">提现</h2>
      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-mt-8 tw-mb-8">
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


      <div class="tw-mt-4 tw-text-left">
        <div class="tw-text-lg tw-font-bold">提现</div>
        <div class="tw-text-lg tw-text-red-500 tw-mt-2 tw-mb-10 transfer-text">
          每笔转账收取手续费 2 USDT
        </div>
      </div>

      <!-- 输入金额 -->
      <div class="tw-flex tw-flex-col tw-gap-4 tw-text-left">
        <div>
          <label class="tw-font-normal tw-text-lg tw-mb-12">提现地址: USDT-TRC20</label>
          <input
            type="text"
            placeholder="请输入充值金额（此处字体透明度35%）"
            class="tw-w-full tw-border tw-border-solid tw-border-gray tw-rounded-md tw-px-3 tw-py-2 tw-text-sm tw-placeholder-gray-400 tw-mb-4"
          />
        </div>

        <input
          type="text"
          placeholder="请输入充值金额（此处字体透明度35%）"
          class="tw-w-full tw-border tw-border-solid tw-border-gray tw-rounded-md tw-px-3 tw-py-2 tw-text-sm tw-placeholder-gray-400 tw-mb-4"
        />

        <input
          type="text"
          placeholder="请输入充值金额（此处字体透明度35%）"
          class="tw-w-full tw-border tw-border-solid tw-border-gray tw-rounded-md tw-px-3 tw-py-2 tw-text-sm tw-placeholder-gray-400 tw-mb-4"
        />
      </div>

      <!-- 按钮 -->
      <button
        class="tw-w-full tw-bg-rose-500 tw-text-white tw-font-semibold tw-rounded-full tw-py-2 tw-mt-4 hover:tw-bg-rose-600"
        @click="handleWithdraw"
      >
        立即提现
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
import { ref } from 'vue'

const imageFile = ref(null)

const router = useRouter()

const handleClose = () => {
  router.push('/')
}

const handleWithdraw = () => {
  router.push('/withdraw/detail')
}
</script>

<style scoped lang="scss">
.transfer-text {
    text-decoration: underline rgb(215, 215, 215);
    text-decoration-thickness: 3px; /* 增加下划线的粗细 */
    text-underline-offset: 5px; /* 增加下划线与文字的距离 */
}
</style>