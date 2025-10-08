<template>
  <div class="tw-relative tw-py-10 tw-bg-gradient-to-b tw-from-blue-100 tw-to-blue-200 min-h-[calc(100vh-70px)]">
    <div class="tw-max-w-md tw-mx-auto tw-bg-white/60 tw-rounded-2xl tw-shadow-lg tw-overflow-hidden tw-relative">

      <!-- Header -->
      <div class="tw-bg-blue-200 tw-p-6 tw-text-center">
        <p class="tw-mt-2 tw-text-lg tw-font-semibold">会员信息</p>
      </div>

      <!-- Body -->
      <div class="tw-p-6 tw-text-sm tw-text-gray-800">
        <p class="tw-mb-2">会员号：<span class="tw-font-semibold">JH001</span></p>
        <p class="tw-mb-2">注册邮箱：<span class="tw-font-semibold">99988@qq.com</span></p>
        <p class="tw-mb-2">角色：<span class="tw-font-semibold">商户</span></p>
        <p class="tw-mb-2">
          邀请码：<span class="tw-font-semibold">JH001</span>
          <button class="tw-ml-2 tw-text-blue-500 tw-text-xs">📋</button>
        </p>
        <p class="tw-mb-2">
          团队报表：
          <a href="#" class="tw-text-blue-600 tw-underline tw-text-xs">点击查看详情 🔍</a>
        </p>

        <!-- 密码 -->
        <div class="tw-mt-4">
          <p class="tw-mb-2">
            登录密码：<span class="tw-font-mono">******</span>
            <button class="tw-ml-2 tw-text-blue-500 tw-text-xs">✏️</button>
          </p>
          <p class="tw-mb-2">
            支付密码：<span class="tw-font-mono">******</span>
            <button class="tw-ml-2 tw-text-blue-500 tw-text-xs">✏️</button>
          </p>
        </div>

        <!-- 资产 -->
        <div class="tw-mt-6">
          <p class="tw-mb-1">总资产：<span class="tw-font-bold">1650 USDT</span></p>
          <p class="tw-mb-1">可用资产：<span class="tw-font-bold">1250 USDT</span></p>
        </div>

        <!-- 收款卡管理 -->
        <div class="tw-mt-6">
          <p class="tw-mb-2 tw-font-semibold">收款卡管理</p>
          <div class="tw-flex tw-items-center tw-space-x-2">
            <select class="tw-border tw-rounded tw-px-2 tw-py-1">
              <option>支付宝</option>
              <option>微信</option>
              <option>银行卡</option>
            </select>
            <button class="tw-text-red-500">➕</button>
            <button class="tw-text-gray-500">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="tw-p-4 tw-text-center tw-text-xs tw-text-gray-500">
        Copy@ JH演示商
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可以在这里加入 Vue 逻辑，比如从 API 获取用户数据
</script>

<style scoped lang="scss">
/* 如有额外全局样式可以写在这里，不会影响 Tailwind 前缀 */
</style>
