<template>
  <div class="register-container">

    <div class="register-box">

      <span class="good-label">Good!</span>

      <!-- Logo -->
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="logo" class="logo" />
      </div>

      <div class="tw-flex tw-flex-col tw-items-center tw-h-1/3 tw-justify-start">
        <span class="success-hint tw-mt-20">注册成功</span>
      </div>
      <el-button
        type="primary"
        class="login-btn"
        :loading="loading"
        @click="handleLogin"
      >
        立即登录
      </el-button>

      <!-- Footer -->
      <div class="footer">Copy@ JH嘉禾商城</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'registerSuccess',
  methods: {
    // 跳转登录页
    handleLogin() {
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

  .good-label {
    position: absolute;
    color: #d9001b;
    font-family: 'Rockwell-Bold', 'Rockwell Bold', 'Rockwell';
    font-size: 28px;
    font-weight: 700;
    right: 80px;
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

  .success-hint {
      text-decoration: underline rgba(215, 215, 215, 0.57);
      text-decoration-thickness: 3px; /* 增加下划线的粗细 */
      text-underline-offset: 30px; /* 增加下划线与文字的距离 */
      font-size: 46px;
      font-weight: 700;
      color: #a30014;
      font-family: 'STXingkaiSC-Bold', 'Xingkai SC Bold', 'Xingkai SC';
  }

  .login-btn {
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
    margin: 140px 0 0 0;
  }
}
</style>
