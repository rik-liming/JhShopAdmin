<template>
  
  <el-form :model="form" ref="formRef" label-width="160px" label-position="left">
    <el-row>
      <el-col :lg="24">
        <!-- 基本信息 -->
        <el-card class="tw-p-6 tw-m-4 tw-rounded-lg tw-min-h-[320px]">

          <el-form-item label="用户名">
            <el-input v-model="form.user_name" disabled />
          </el-form-item>

          <el-form-item label="密码" required>
            <el-input type="password" v-model="form.password" placeholder="请输入密码" />
          </el-form-item>

          <el-form-item label="二步验证密钥" required>
            <el-input v-model="form.two_factor_secret" disabled />
          </el-form-item>

          <div class="tw-flex !tw-items-center">
            <QrcodeVue :value="qrCodeUrl" :size="200" class="qrcode" />
            <el-button class="tw-ml-4" type="primary" @click="regenSecret">重新生成</el-button>
          </div>
          
        </el-card>
      </el-col>
    </el-row>

    <el-row class="tw-mt-10">
      <el-col :lg="8">
      </el-col>
      <el-col :lg="8">
        <el-form-item>
          <el-button type="primary" @click="submit">保存信息</el-button>
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
import * as AdminApi from '@/api/admin'
import store from '@/store';
import QrcodeVue from 'qrcode.vue'

interface Admin {
  user_name: string;
  password: string;
  two_factor_secret: string;
}

const adminStore = store.admin()

// 表单数据
const formRef = ref();
const form = reactive<Admin>({
  user_name: '',
  password: '',
  two_factor_secret: '',
});
const qrCodeUrl = ref('')

// 加载配置
const loadInfo = async () => {
  try {
    const res = await AdminApi.getAdminInfo(adminStore.adminLoginToken);
    if (res.data.code === 10000) {
      Object.assign(form, res.data.data.admin);
      qrCodeUrl.value = res.data.data.qrCodeUrl
    }
  } catch (err) {
    console.error(err);
    ElMessage.error('加载信息失败');
  }
};

// 提交配置
const submit = async () => {
  try {
    const updateResp = await AdminApi.updateAdminInfo(adminStore.adminLoginToken, form);
    if (updateResp.data.code === 10000) {
      ElMessage.success('信息已保存');
    }
  } catch (err) {
    console.error(err);
    ElMessage.error('保存失败');
  }
};

const regenSecret = async () => {
  try {
    const res = await AdminApi.regenSecret(adminStore.adminLoginToken);
    if (res.data.code === 10000) {
      form.two_factor_secret = res.data.data.secret;
      qrCodeUrl.value = res.data.data.qrCodeUrl
    }
  } catch (err) {
    console.error(err);
    ElMessage.error('生成失败');
  }
}

// 重置
const reset = () => loadInfo();

onMounted(() => {
  loadInfo();
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
