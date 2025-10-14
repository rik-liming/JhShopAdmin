<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">嘉禾管理后台</h3>
      </div>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="user_name" v-model="loginForm.user_name" placeholder="用户名" name="user_name" type="text"
                  tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                  placeholder="密码" name="password" tabindex="2" autocomplete="on"
                  @keyup.enter="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">
        登录</el-button>
    </el-form>

    <el-dialog v-model="needBindOtp" title="验证码校验" class="custom-dialog">
      <div>请使用谷歌验证器，扫描二维码绑定后，输入验证码</div>
      <QrcodeVue :value="qrCodeUrl" :size="200" class="qrcode" />

      <v-sheet color="surface">
        <v-otp-input
          v-model="otp"
          variant="outlined"
        ></v-otp-input>
      </v-sheet>

      <v-btn
        class="my-4 mx-auto"
        color="success"
        height="40"
        text="验证"
        variant="flat"
        width="70%"
        @click="submitOtp"
      ></v-btn>
    </el-dialog>

    <el-dialog v-model="needVerifyOtp" title="验证码校验" class="custom-dialog">
      <div class="verifyOtpHint">请输入谷歌验证器生成的验证码</div>

      <v-sheet color="surface">
        <v-otp-input
          v-model="otp"
          variant="outlined"
        ></v-otp-input>
      </v-sheet>

      <v-btn
        class="my-4 mx-auto"
        color="success"
        height="40"
        text="验证"
        variant="flat"
        width="70%"
        @click="submitOtp"
      ></v-btn>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { FormItemRule } from 'element-plus';
import type { IForm } from '@/types/element-plus';
import store from '@/store';
import * as AdminApi from '@/api/admin';
import QrcodeVue from 'qrcode.vue'

interface QueryType {
  // 自定义key 任意字符串
  [propname:string]:string
}

export default defineComponent({
  name: 'Login',
  components: {
    QrcodeVue,
  },
  data() {
    const validateUserName: FormItemRule['validator'] = (_rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
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
    return {
      loginForm: {
        user_name: '',
        password: '',
      },
      loginRules: {
        user_name: [{ required: true, trigger: 'blur', validator: validateUserName }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      needBindOtp: false,
      qrCodeUrl: '',
      needVerifyOtp: false,
      otp: '',
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
      if (this.loginForm.user_name === '') {
        this.$refs.userName?.focus();  // 这里使用 optional chaining (?.) 避免 undefined 错误
      } else if (this.loginForm.password === '') {
        this.$refs.password?.focus();  // 这里使用 optional chaining (?.) 避免 undefined 错误
      }
    });
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        (this.$refs.password as HTMLElement).focus();
      });
    },
    async handleLogin() {
      const isValid = await (this.$refs.loginForm as IForm).validate();

      if (isValid) {
        this.loading = true

        try {
          const loginResp = await AdminApi.login(this.loginForm)
          if (loginResp.data.code == 10000) {
            if (loginResp.data.data.qr_code_url) {
              this.needBindOtp = true
              this.qrCodeUrl = loginResp.data.data.qr_code_url
            } else if (loginResp.data.data.need_otp) {
              this.needVerifyOtp = true
            }
          } else {
            ElMessage.error(loginResp.data.msg);
          }
        } catch (error) {
          ElMessage.error("登录失败，请重试")
        } finally {
          this.loading = false
        }
      }
    },
    async submitOtp() {
      const adminStore = store.admin()
      try {
        const response = await adminStore.verifyOtp(this.loginForm.user_name, this.otp)
        if (response.data.code == 10000) {
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (e) {
        ElMessage.error("登录失败，请重试")
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
  }
});
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-plus css */
.login-container {
  .el-input {
    height: 47px;
    width: 85%;

    .el-input__wrapper,
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      box-shadow: none;
    }

    input {
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor  !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
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
