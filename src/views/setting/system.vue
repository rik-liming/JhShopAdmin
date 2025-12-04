<template>
  
  <el-form :model="form" ref="formRef" label-width="180px" label-position="left">
    <el-row>
      <el-col :lg="8">
        <!-- 基本信息 -->
        <el-card class="tw-p-6 tw-m-4 tw-rounded-lg tw-min-h-[480px]">
          <el-form-item label="广告文字">
            <el-input 
              type="textarea" 
              v-model="form.advertisement_text" 
              :rows="2"
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="平台收款地址">
            <el-input 
              v-model="form.payment_address"
              placeholder="请输入收款地址地址"
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="tw-font-bold tw-w-[70px]">平台收款二维码:</span>
            </template>
            <div class="tw-w-full">
              <CustomFileUpload 
                v-model:file="form.payment_qr_code_image"
                v-model:hasChanged="form.payment_qr_code_changed"
                :imageUrl="form.payment_qr_code_url"
              />
            </div>
          </el-form-item>

          <el-form-item label="转账手续费 (USDT)">
            <el-input-number
              v-model="form.transfer_fee" 
              :min="0" 
              :step="0.01"
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="提现手续费 (USDT)">
            <el-input-number 
              v-model="form.withdrawl_fee" 
              :min="0" 
              :step="0.01" 
              :disabled="!canModifyConfig"
            />
          </el-form-item>
        </el-card>
      </el-col>

      <el-col :lg="8">
        <el-card class="tw-p-6 tw-m-4 tw-rounded-lg tw-min-h-[480px]">
          
          <el-form-item label="平台汇率">
            <el-input-number 
              v-model="form.exchange_rate_platform" 
              :min="0" 
              :step="0.01" 
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="支付宝汇率">
            <el-input-number 
              v-model="form.exchange_rate_alipay" 
              :min="0" 
              :step="0.01"
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="微信汇率">
            <el-input-number 
              v-model="form.exchange_rate_wechat" 
              :min="0" 
              :step="0.01" 
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="银行卡汇率">
            <el-input-number 
              v-model="form.exchange_rate_bank" 
              :min="0" 
              :step="0.01" 
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="数字人民币汇率">
            <el-input-number 
              v-model="form.exchange_rate_ecny" 
              :min="0" 
              :step="0.01" 
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="代理佣金比例（%）">
            <el-input-number 
              v-model="form.agent_commission_rate" 
              :min="0" 
              :step="0.01" 
              :disabled="!canModifyConfig"
            />
          </el-form-item>

          <el-form-item label="系统买家佣金比例（%）">
            <el-input-number 
              v-model="form.buyer_commission_rate" 
              :min="0" 
              :step="0.01" 
              :disabled="!canModifyConfig"
            />
          </el-form-item>
        </el-card>
      </el-col>

      <el-col :lg="8">
        <el-card class="tw-p-6 tw-m-4 tw-rounded-lg tw-min-h-[480px]">
          <!-- 优化后的远程订单配置 -->
          <el-form-item label="远程下单开放市场">
            <el-checkbox-group 
              v-model="remoteConfig.openMarkets"
              :disabled="!canModifyConfig"
            >
              <el-checkbox label="alipay">支付宝</el-checkbox>
              <el-checkbox label="wechat">微信</el-checkbox>
              <el-checkbox label="bank">银行卡</el-checkbox>
              <el-checkbox label="ecny">数字人民币</el-checkbox>
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
                  :disabled="!canModifyConfig"
                />
                <el-button
                  v-if="remoteConfig.amountOptions.length > 1"
                  type="danger"
                  link
                  @click="removeAmount(index)"
                  :disabled="!canModifyConfig"
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
                :disabled="!canModifyConfig"
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
          <el-button 
            type="primary" 
            @click="submit"
            :disabled="!canModifyConfig"
          >
            保存配置
          </el-button>
          <el-button 
            @click="reset"
            :disabled="!canModifyConfig"
          >
            重置
          </el-button>
        </el-form-item>
      </el-col>
      <el-col :lg="8">
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import * as ConfigApi from '@/api/config'
import store from '@/store';
import { hasActionPermission, formatImageUrl } from '@/utils/tool'
import CustomFileUpload from '@/components/CustomFileUpload';

interface PlatformConfig {
  payment_address: string;
  payment_qr_code: string;
  payment_qr_code_url: string;
  payment_qr_code_image: any;
  payment_qr_code_changed: false;
  transfer_fee: number;
  withdrawl_fee: number;
  agent_commission_rate: number;
  buyer_commission_rate: number;
  exchange_rate_platform: number;
  exchange_rate_alipay: number;
  exchange_rate_wechat: number;
  exchange_rate_bank: number;
  exchange_rate_ecny: number;
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
  payment_qr_code_url: '',
  payment_qr_code_image: null,
  payment_qr_code_changed: false,
  transfer_fee: 0,
  withdrawl_fee: 0,
  agent_commission_rate: 0,
  buyer_commission_rate: 0,
  exchange_rate_platform: 0,
  exchange_rate_alipay: 0,
  exchange_rate_wechat: 0,
  exchange_rate_bank: 0,
  exchange_rate_ecny: 0,
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

      // 二维码处理
      if (form.payment_qr_code) {
        form.payment_qr_code_url = formatImageUrl(form.payment_qr_code)
      }

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

    const formData = new FormData();

    // 远程下单和支付二维码单独处理
    Object.entries(form).forEach(([key, value]) => {
        if (key === 'remote_order_config' || key === 'payment_qr_code_image') return
        formData.append(key, value instanceof Blob ? value : String(value))
    })

    formData.append('remote_order_config', JSON.stringify(form.remote_order_config))
    formData.append('payment_qr_code_image', form.payment_qr_code_image)

    const updateResp = await ConfigApi.updateConfigInfo(adminStore.adminLoginToken, formData);
    if (updateResp.data.code === 10000) {
      ElMessage.success('配置已保存');
    } else {
      ElMessage.error(updateResp.data.msg);
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

const canModifyConfig = computed(() => {
  return hasActionPermission('/setting/system:modify', adminStore?.admin?.value?.id, adminStore?.admin?.value?.role)
})
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
