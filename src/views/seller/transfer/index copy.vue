<template>
  <div class="tw-bg-gradient-to-b tw-from-blue-100 tw-to-blue-300 tw-p-6 tw-rounded-lg tw-w-96">
    <div class="tw-flex tw-justify-between tw-items-center">
      <h2 class="tw-text-2xl tw-font-semibold tw-text-blue-800">转账</h2>
      <button @click="close" class="tw-text-white tw-bg-red-500 tw-px-4 tw-py-2 tw-rounded-lg">
        关闭
      </button>
    </div>

    <div class="tw-mt-4">
      <div class="tw-flex tw-justify-between tw-items-center">
        <div class="tw-text-blue-800 tw-font-semibold">商户号：JH001</div>
      </div>
      <div class="tw-mt-2 tw-text-gray-600">总资产：1650 USDT</div>
      <div class="tw-mt-2 tw-text-gray-600">可用资产：1250 USDT</div>

      <div class="tw-mt-4">
        <div class="tw-text-red-500 tw-font-semibold">平台转账</div>
        <div class="tw-text-sm tw-text-red-500 tw-mt-2">
          每笔转账收取手续费 2 USDT
        </div>
      </div>

      <div class="tw-mt-6">
        <label for="recipient" class="tw-block tw-text-gray-700 tw-font-medium">对方商户号</label>
        <input id="recipient" v-model="recipient" type="text" class="tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-md" placeholder="此处文字透明度35%" />
      </div>

      <div class="tw-mt-4">
        <label for="amount" class="tw-block tw-text-gray-700 tw-font-medium">转账金额</label>
        <input id="amount" v-model="amount" type="number" class="tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-md" placeholder="此处文字透明度35%" />
      </div>

      <div class="tw-mt-4">
        <label for="paymentCode" class="tw-block tw-text-gray-700 tw-font-medium">支付密码</label>
        <input id="paymentCode" v-model="paymentCode" type="password" class="tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-md" placeholder="此处文字透明度35%" />
      </div>

      <div class="tw-mt-6 tw-flex tw-justify-between">
        <span class="tw-text-gray-600">总资产：1650 USDT</span>
        <span class="tw-text-gray-600">可用资产：1250 USDT</span>
      </div>

      <div class="tw-mt-8 tw-flex tw-justify-between">
        <button @click="cancel" class="tw-bg-gray-300 tw-text-gray-800 tw-px-4 tw-py-2 tw-rounded-lg">
          取消
        </button>
        <button @click="transfer" class="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg">
          即时转账
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 表单数据
const recipient = ref('');
const amount = ref('');
const paymentCode = ref('');

// 关闭弹窗
const close = () => {
  // 这里可以关闭当前页面或者弹窗
};

// 取消转账
const cancel = () => {
  // 取消逻辑，例如重置表单
  recipient.value = '';
  amount.value = '';
  paymentCode.value = '';
};

// 执行转账
const transfer = () => {
  // 转账逻辑，这里可以进行数据验证和提交
  console.log('转账成功', { recipient: recipient.value, amount: amount.value, paymentCode: paymentCode.value });
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  background: #e6f1f7;
  border-radius: 10px;
  padding: 20px;
}

.tw-text-red {
  color: #e74c3c;
}

.tw-bg-gradient-to-b {
  background: linear-gradient(to bottom, #e6f1f7, #7fb3d5);
}

.tw-text-blue-800 {
  color: #1d4b73;
}

.tw-px-4,
.tw-py-2 {
  padding: 0.5rem 1rem;
}

.tw-text-lg {
  font-size: 1.125rem;
}

.tw-w-full {
  width: 100%;
}

.tw-border-collapse {
  border-collapse: collapse;
}

.tw-border {
  border: 1px solid #ddd;
}

.tw-text-left {
  text-align: left;
}

.tw-text-center {
  text-align: center;
}

.tw-mt-4 {
  margin-top: 1rem;
}

.tw-flex {
  display: flex;
}

.tw-justify-between {
  justify-content: space-between;
}

.tw-bg-red-500 {
  background-color: #e74c3c;
}

.tw-bg-blue-500 {
  background-color: #3498db;
}

.tw-rounded-lg {
  border-radius: 0.5rem;
}
</style>
