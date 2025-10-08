<template>
  <div class="register-container">

    <div class="register-box">

      <span class="new-label">New</span>

      <div class="tw-absolute tw-top-16 tw-right-4 tw-flex tw-flex-col tw-items-end tw-z-20">
        <button 
          class="tw-text-red-500 tw-text-sm tw-border tw-border-solid tw-border-gray-500 tw-rounded tw-px-4 tw-py-2 tw-mb-4" 
          @click="handleClose"
        >
          关闭
        </button>
      </div>

      <!-- Logo -->
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="logo" class="logo" />
      </div>

      <!-- 表单 -->
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm" class="form-box">
        <el-form-item prop="email" label="注册邮箱" class="custom-form-item">
          <el-input 
            v-model="registerForm.email" 
            placeholder="Money@bitcon.com" 
            clearable 
          />
        </el-form-item>

        <el-form-item prop="password" label="密码" class="custom-form-item">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="Password"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item prop="confirmPassword" label="密码确认" class="custom-form-item">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Password"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item prop="inviteCode" label="邀请码" class="custom-form-item">
          <el-input
            v-model="registerForm.inviteCode"
            placeholder="12345678"
            clearable
          />
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item class="custom-form-item register-btn-container">
          <el-button
            type="primary"
            class="register-btn"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>

        <button 
          class="tw-w-full tw-text-red-500 tw-font-medium"
          @click="handleClose"
        >
          取消
        </button>
      </el-form>

      <!-- Footer -->
      <div class="footer">Copy@ JH嘉禾商城</div>
    </div>
  </div>
</template>

<script lang="ts">
import { validEmail } from '@/utils/validate';
import { defineComponent } from 'vue';
import type { FormItemRule } from 'element-plus';
import type { IForm } from '@/types/element-plus';
import * as AuthApi from '@/api/auth';

interface QueryType {
  // 自定义key 任意字符串
  [propname:string]:string
}

export default defineComponent({
  name: 'register',
  components: {
  },
  data() {
    const validateEmail: FormItemRule['validator'] = (_rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    };
    const validatePassword: FormItemRule['validator'] = (_rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'));
      } else {
        callback();
      }
    };
    const validateConfirmPassword: FormItemRule['validator'] = (_rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码需一致'));
      } else {
        callback();
      }
    };
    const validateInviteCode: FormItemRule['validator'] = (_rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邀请码'));
      } else {
        callback();
      }
    };
    
    return {
      registerForm: {
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: '',
      },
      registerRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        inviteCode: [{ required: true, trigger: 'blur', validator: validateInviteCode }]
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      if (this.registerForm.email === '') {
        this.$refs.email?.focus();  // 这里使用 optional chaining (?.) 避免 undefined 错误
      } else if (this.registerForm.password === '') {
        this.$refs.password?.focus();  // 这里使用 optional chaining (?.) 避免 undefined 错误
      }
    });
  },
  methods: {
    async handleRegister() {
      const isValid = await (this.$refs.registerForm as IForm).validate();

      if (isValid) {
        this.loading = true

        try {
          const registerResp = await AuthApi.register(this.registerForm)
          if (registerResp.data.code == 10000) {
            this.$router.push("/register/success");
          } else {
            ElMessage.error(registerResp.data.msg);
          }
        } catch (error) {
          ElMessage.error("注册失败，请重试")
        } finally {
          this.loading = false
        }
      }
    },
    getOtherQuery(query:QueryType) {
      return Object.keys(query).reduce((acc:QueryType, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },

    // 跳转登录页
    handleClose() {
      this.$router.push("/login");
    },
  }
});
</script>

<style scoped lang="scss">
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  // align-items: center;
  background-image: url('@/assets/login_background.jpg');
  background-size: cover; /* 图片铺满 */
  background-position: center; /* 居中 */

  /* 自适应 iPhone 风格圆角 */
  border-radius: min(11vw, 11vh); /* 取宽和高中较小的比例 */;
  overflow: hidden;

  .new-label {
    position: absolute;
    color: #95F204;
    font-family: 'Rockwell-Bold', 'Rockwell Bold', 'Rockwell';
    font-size: 28px;
    font-weight: 700;
    right: 100px;
    top: 70px;
  }

  .logo-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    margin-bottom: 50px;

    .logo {
      width: 190px;
      height: 180px;
    }
  }

  .form-box {
    margin-top: 40px;
  }

  // :deep(.register-container .el-form-item) {
  //   border: 0px !important;
  //   background: transparent !important;
  // }

  .custom-form-item {
    display: block;
    margin-top: 2rem;
    margin-bottom: 1.5rem; /* Add space between each item */
    border: 0px !important;
    background: transparent !important;
  }

  .custom-form-item .el-form-item__label {
    display: block; /* Ensure label is on a new line */
    margin-bottom: 0.5rem; /* Space between label and input */
    font-family: 'PingFangSC-Regular', 'PingFang SC' !important;
    color: #333333 !important;
  }

  :deep(.el-form-item--label-right .el-form-item__label) {
    font-size: 16px !important;
    color: #333 !important;
    font-weight: 400;
  }

  :deep(.el-input__wrapper) {
    background-color: transparent !important;
    box-shadow: none !important;
    border: 2px solid rgb(215, 215, 215) !important;
    border-left: 0px !important;
    border-right: 0px !important;
    border-top: 0px !important;
    --el-input-text-color: #333;
  }

  :deep(.el-input input) {
    color: black !important;
    font-size: 16px !important;
    --el-input-placeholder-color: #333333 !important;
  }

  .custom-form-item .el-input input {
    color: black !important;
    font-size: 16px !important;
  }

  :deep(.el-form-item__error) {
    padding-top: 12px !important;
    color: #ea5543 !important;
  }

  .custom-form-item .el-input {
    width: 100%; /* Ensure input takes full width */
  }

  .register-btn-container {
    margin-bottom: 2px !important;
  }

  .register-btn {
    width: 100%;
    background: black;
    opacity: 0.57;
    border: none;
    color: #F2F2F2;
    letter-spacing: 4px;
    font-size: 20px;
    border-radius: 20px;
    width: 278px;
    height: 53px;
    padding: 2px;
    margin-top: 80px;
    margin-bottom: 10px !important;
  }

  .footer {
    // position: fixed;
    // bottom: 6px;
    // left: calc(50% - 54px);
    font-size: 11px;
    text-align: center;
    font-family: Arial Normal, Arial;
    color: #333333;
    opacity: 0.57;
    margin: 30px 0 0 0;
  }

  :deep(div.el-dialog.custom-dialog) {
    width: 80% !important;
    --el-dialog-width: 80% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }

  :deep(.el-dialog__header) {
    /* Adjust the header if needed */
    padding: 10px 20px !important;
    margin-left: -180px !important;
  }

  :deep(.el-dialog__body) {
    padding: 20px !important; /* Adjust body padding */
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }

  :deep(.el-dialog__footer) {
    padding: 10px 20px !important; /* Adjust footer padding */
  }

  :deep(.qrcode) {
    margin-top: 20px !important;
  }

  .verifyOtpHint{
    margin: 20px;
  }
}
</style>
