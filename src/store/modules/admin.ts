import { defineStore } from 'pinia';
import router, { resetRouter } from '@/router';
import tagsViewStore from './tagsView';
import permissionStore from './permission';
import * as AdminApi from '@/api/admin'
import { useStorage } from '@vueuse/core'

// 每个浏览器 tab 都有独立的 ID
const tabId = sessionStorage.getItem('tabId') || crypto.randomUUID();
sessionStorage.setItem('tabId', tabId);

export interface IAdmin {
  id: string
  userName: string
  realName: string
  avatar: string
  email: string
  role: string
}

export default defineStore({
  id: 'admin',
  state: () => ({
    // 分开存储
    adminLoginToken: useStorage(`adminLoginToken_${tabId}`, ''),
    admin: useStorage<IAdmin>(`admin_${tabId}`, {} as IAdmin),
  }),
  actions: {
    // user verify otp and login
    async verifyOtp(user_name: string, otp: string) {
      try {
        const response = await AdminApi.verifyOtp({user_name, otp})
        if (response.data.code == 10000) {
          const { token, admin } = response.data.data;

          this.adminLoginToken = token
          this.admin.value = {
            id: admin.id,
            userName: admin.user_name,
            realName: admin.real_name,
            avatar: admin.avatar,
            email: admin.email,
            role: admin.role,
          }
        }
        return response
      } catch (error) {
        throw error;
      }
    },

    // user logout
    async logout() {
      try {
        // 登出是前端登出即可，后端处理失败也同样退出
        const response = await AdminApi.logout(this.adminLoginToken)
        this.adminLoginToken = '';
        this.admin = null;
        resetRouter();
        tagsViewStore().delAllViews();

        // if (response.data.code == 10000) {
          
        // }
      } catch (error) {
        throw error;
      }
    },
  }
});
