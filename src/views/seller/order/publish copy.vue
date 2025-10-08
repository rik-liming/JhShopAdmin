<template>
  <div class="tw-min-h-screen tw-bg-gradient-to-b tw-from-blue-100 tw-to-blue-200 tw-flex tw-items-center tw-justify-center">
    <div class="tw-w-[380px] tw-bg-white/70 tw-rounded-2xl tw-shadow-lg tw-p-6 tw-relative tw-text-center">

      <!-- 关闭按钮 -->
      <button class="tw-absolute tw-top-3 tw-right-3 tw-text-red-500 tw-text-sm">关闭</button>

      <!-- 图标 -->
      <div class="tw-mt-4">
        <img
          src="https://via.placeholder.com/80x80.png?text=SALE"
          alt="sale"
          class="tw-w-20 tw-h-20 tw-mx-auto"
        />
      </div>

      <!-- 标题 -->
      <p class="tw-mt-2 tw-text-lg tw-font-semibold">发布交易</p>

      <hr class="tw-my-4 tw-border-gray-300" />

      <!-- 账户信息 -->
      <div class="tw-text-sm tw-text-gray-800 tw-space-y-1 tw-text-left">
        <p>商户号：<span class="tw-font-semibold">JH001</span></p>
        <p>总资产：<span class="tw-font-semibold">1650 USDT</span></p>
        <p>可出售资产：<span class="tw-font-semibold">1250 USDT</span></p>
      </div>

      <!-- 出售数量 -->
      <div class="tw-mt-6 tw-text-left">
        <label class="tw-block tw-text-sm tw-mb-1">出售数量：</label>
        <input
          type="text"
          value="350 USDT"
          class="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-text-red-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
        />
      </div>

      <!-- 最低购买金额 -->
      <div class="tw-mt-4 tw-text-left">
        <label class="tw-block tw-text-sm tw-mb-1">最低购买金额</label>
        <select class="tw-w-full tw-border tw-rounded-md tw-px-3 tw-py-2">
          <option>0 USDT</option>
          <option>100 USDT</option>
          <option>500 USDT</option>
        </select>
      </div>

      <!-- 卖场选择 -->
      <div class="tw-mt-4 tw-text-left">
        <label class="tw-block tw-text-sm tw-mb-1">卖场选择</label>
        <select class="tw-w-full tw-border tw-rounded-md tw-px-3 tw-py-2">
          <option>支付宝</option>
          <option>微信</option>
          <option>银行卡</option>
        </select>
      </div>

      <!-- 按钮 -->
      <div class="tw-mt-8">
        <button class="tw-w-full tw-bg-red-500 tw-text-white tw-font-semibold tw-py-2 tw-rounded-full hover:tw-bg-red-600">
          发布
        </button>
        <button class="tw-mt-3 tw-text-red-500 hover:tw-underline">取消</button>
      </div>

      <!-- 底部 -->
      <div class="tw-mt-6 tw-text-xs tw-text-gray-500">
        Copy@ JH演示商
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这里可以加入 Vue 逻辑，比如绑定出售数量和选择项
</script>
