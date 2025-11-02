<template>
  
  <el-form :model="form" ref="formRef" label-width="160px" label-position="left">
    <el-row>
      <el-col :lg="8">
        <!-- 基本信息 -->
        <el-card class="tw-p-6 tw-m-4 tw-rounded-lg tw-min-h-[320px]">
          <el-form-item label="广告文字">
            <el-input type="textarea" v-model="form.advertisement_text" :rows="2" />
          </el-form-item>

          <el-form-item label="平台收款地址">
            <el-input v-model="form.payment_address" placeholder="请输入收款地址地址" />
          </el-form-item>

          <!-- <el-form-item label="支付二维码">
            <el-input v-model="form.payment_qr_code" placeholder="请输入支付二维码 URL" />
          </el-form-item> -->

          <el-form-item label="转账手续费 (USDT)">
            <el-input-number v-model="form.transfer_fee" :min="0" :step="0.01" />
          </el-form-item>

          <el-form-item label="提现手续费 (USDT)">
            <el-input-number v-model="form.withdrawl_fee" :min="0" :step="0.01" />
          </el-form-item>
        </el-card>
      </el-col>

      <el-col :lg="8">
        <el-card class="tw-p-6 tw-m-4 tw-rounded-lg tw-min-h-[320px]">
          
          <el-form-item label="平台汇率">
            <el-input-number v-model="form.exchange_rate_platform" :min="0" :step="0.01" />
          </el-form-item>

          <el-form-item label="支付宝汇率">
            <el-input-number v-model="form.exchange_rate_alipay" :min="0" :step="0.01" />
          </el-form-item>

          <el-form-item label="微信汇率">
            <el-input-number v-model="form.exchange_rate_wechat" :min="0" :step="0.01" />
          </el-form-item>

          <el-form-item label="银行卡汇率">
            <el-input-number v-model="form.exchange_rate_bank" :min="0" :step="0.01" />
          </el-form-item>
        </el-card>
      </el-col>

      <el-col :lg="8">
        <el-card class="tw-p-6 tw-m-4 tw-rounded-lg tw-min-h-[320px]">
          <!-- 优化后的远程订单配置 -->
          <el-form-item label="远程下单开放市场">
            <el-checkbox-group v-model="remoteConfig.openMarkets">
              <el-checkbox label="alipay">支付宝</el-checkbox>
              <el-checkbox label="wechat">微信</el-checkbox>
              <el-checkbox label="bank">银行卡</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="远程下单开放额度" class="tw-font-bold">
            <div class="tw-flex tw-flex-col tw-gap-2">
              <div
                v-for="(amount, index) in remoteConfig.amountOptions"
                :key="index"
                class="tw-flex tw-items-center tw-gap-2"
              >
                <el-input
                  v-model.number="remoteConfig.amountOptions[index]"
                  type="number"
                  placeholder="请输入金额"
                  min="1"
                  @input="handleAmountChange(index)"
                  class="tw-w-[150px]"
                />
                <el-button
                  v-if="remoteConfig.amountOptions.length > 1"
                  type="danger"
                  link
                  @click="removeAmount(index)"
                >
                  删除
                </el-button>
              </div>

              <!-- 添加按钮 -->
              <el-button
                v-if="remoteConfig.amountOptions.length < 3"
                type="primary"
                link
                @click="addAmount"
              >
                + 添加额度
              </el-button>
            </div>
          </el-form-item>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="tw-mt-10">
      <el-col :lg="8">
      </el-col>
      <el-col :lg="8">
        <el-form-item>
          <el-button type="primary" @click="submit">保存配置</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-col>
      <el-col :lg="8">
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as ConfigApi from '@/api/config'
import store from '@/store';

interface PlatformConfig {
  payment_address: string;
  payment_qr_code: string;
  transfer_fee: number;
  withdrawl_fee: number;
  exchange_rate_platform: number;
  exchange_rate_alipay: number;
  exchange_rate_wechat: number;
  exchange_rate_bank: number;
  advertisement_text: string;
  remote_order_config: {
    openMarkets: string[];
    amountOptions: number[];
  };
}

const adminStore = store.admin()

// 表单数据
const formRef = ref();
const form = reactive<PlatformConfig>({
  payment_address: '',
  payment_qr_code: '',
  transfer_fee: 0,
  withdrawl_fee: 0,
  exchange_rate_platform: 0,
  exchange_rate_alipay: 0,
  exchange_rate_wechat: 0,
  exchange_rate_bank: 0,
  advertisement_text: '',
  remote_order_config: {
    openMarkets: ['alipay', 'wechat', 'bank'],
    amountOptions: [500, 1000, 2000]
  }
});

// 远程订单配置单独绑定，便于表单控制
const remoteConfig = reactive({
  openMarkets: [...form.remote_order_config.openMarkets],
  amountOptions: [...form.remote_order_config.amountOptions]
});

// 可选额度列表
const amountOptionsList = [500, 1000, 2000];

const addAmount = () => {
  if (remoteConfig.amountOptions.length < 3) {
    remoteConfig.amountOptions.push(0);
  }
};

const removeAmount = (index: number) => {
  remoteConfig.amountOptions.splice(index, 1);
};

// 限制金额必须为正整数
const handleAmountChange = (index: number) => {
  const val = remoteConfig.amountOptions[index];
  if (val < 0) remoteConfig.amountOptions[index] = 0;
};

// 加载配置
const loadConfig = async () => {
  try {
    const res = await ConfigApi.getConfigInfo(adminStore.adminLoginToken);
    if (res.data.code === 10000) {
      Object.assign(form, res.data.data.config);

      // 远程订单配置同步
      remoteConfig.openMarkets = [...form.remote_order_config.openMarkets];
      remoteConfig.amountOptions = [...form.remote_order_config.amountOptions];
    }
  } catch (err) {
    console.error(err);
    ElMessage.error('加载配置失败');
  }
};

// 提交配置
const submit = async () => {
  try {
    // 更新 form 中的 remote_order_config
    form.remote_order_config.openMarkets = [...remoteConfig.openMarkets];
    form.remote_order_config.amountOptions = [...remoteConfig.amountOptions];

    const updateResp = await ConfigApi.updateConfigInfo(adminStore.adminLoginToken, form);
    if (updateResp.data.code === 10000) {
      ElMessage.success('配置已保存');
    }
  } catch (err) {
    console.error(err);
    ElMessage.error('保存失败');
  }
};

// 重置
const reset = () => loadConfig();

onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
/* 左对齐表单标签 */
.el-form {
  text-align: left;
}

.el-form-item__label {
  text-align: left !important;
}
</style>
