<template>
  <div class="tw-w-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
    <div class="tw-w-[360px] tw-p-6 tw-text-center">
      <!-- 顶部图标 -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-2 tw-relative">
        <div class="tw-flex tw-items-center tw-w-full">
          <img src="@/assets/profile_icon.png" alt="profile" class="tw-w-28 tw-h-32 tw-mx-auto" @click="profileIconClick" />
        </div>
        <div class="tw-absolute tw-left-0 tw-flex tw-flex-col tw-items-end">
          <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSidebar" />
        </div>
        <div class="tw-absolute tw-right-0 tw-flex tw-flex-col tw-items-end">
          <notification-bell @toggleClick="showMessageBox" />
        </div>
      </div>
      

      <!-- 标题 & 汇率 -->
      <h2 class="tw-text-lg tw-font-semibold">会员信息</h2>
      <hr class="tw-my-3 tw-border-gray-300" />

      <!-- 用户信息 -->
      <div class="tw-mt-8 tw-mb-8">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">会员号：</p>
          <p class="tw-font-semibold tw-text-right">JH001</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">注册邮箱：</p>
          <p class="tw-font-semibold tw-text-right">23sdfs@test.com</p>
        </div>
      </div>

      <div class="tw-mt-8 tw-mb-8">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">角色：</p>
          <p class="tw-font-semibold tw-text-right">商户</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">邀请码：</p>
          <p class="tw-font-semibold tw-text-right">4474544</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">团队报表：</p>
          <router-link to="/report" class="tw-text-md">点击查看详情 🔍</router-link>
        </div>
      </div>

      <div class="tw-mt-8 tw-mb-8">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-mb-2">
            登录密码：<span class="tw-font-mono">******</span>
            <button class="tw-ml-2 tw-text-blue-500 tw-text-xs">✏️</button>
          </p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-mb-2">
            支付密码：<span class="tw-font-mono">******</span>
            <button class="tw-ml-2 tw-text-blue-500 tw-text-xs">✏️</button>
          </p>
        </div>
      </div>

      <div class="tw-mt-8 tw-mb-8">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">总资产：</p>
          <p class="tw-font-semibold tw-text-right">1520 USDT</p>
        </div>
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">可用资产：</p>
          <p class="tw-font-semibold tw-text-right">1000 USDT</p>
        </div>
      </div>

      <!-- 收款卡管理 -->
      <div class="tw-mt-8 tw-mb-8">
        <div class="tw-flex tw-justify-between tw-space-x-4">
          <p class="tw-text-left">收款卡管理</p>
        </div>
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

      <!-- 底部版权 -->
      <p class="tw-text-xs tw-text-gray-400 tw-mt-4">Copy@ JH嘉禾商城</p>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { ref } from 'vue'
import Hamburger from '@/components/Hamburger';
import NotificationBell from '@/components/NotificationBell';
import store from '@/store';

const appStore = store.app()
const router = useRouter()

const handleClose = () => {
  router.push('/')
}

const handleTransfer = () => {
  router.push('/transfer/detail')
}

const toggleSidebar = () => {
  appStore.toggleSidebar();
}

const profileIconClick = () => {
  router.push('/')
}

const showMessageBox = () => {
  alert("show message");
}

</script>

<style scoped lang="scss">
.transfer-text {
    text-decoration: underline rgb(215, 215, 215);
    text-decoration-thickness: 3px; /* 增加下划线的粗细 */
    text-underline-offset: 5px; /* 增加下划线与文字的距离 */
}
</style>