import { defineStore } from 'pinia';
import router, { resetRouter } from '@/router';
import tagsViewStore from './tagsView';
import permissionStore from './permission';
import * as AdminApi from '@/api/admin'
import { useStorage } from '@vueuse/core'

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
    loginToken: useStorage('adminLoginToken', ''),
    admin: useStorage<IAdmin>('admin', {} as IAdmin),
  }),
  actions: {
    // user verify otp and login
    async verifyOtp(username: string, otp: string) {
      try {
        const response = await AdminApi.verifyOtp({username, otp})
        if (response.data.code == 10000) {
          const { token, admin } = response.data.data;

          this.loginToken = token
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
        const response = await AdminApi.logout(this.loginToken)
        this.loginToken = '';
        this.admin = null;
        resetRouter();
        tagsViewStore().delAllViews();

        // if (response.data.code == 10000) {
          
        // }
      } catch (error) {
        throw error;
      }
    },

    // dynamically modify permissions
    async changeRoles(role: string) {
      const token = role + '-token';
      this.token = token;
      // setToken(token);

      const infoRes = await this.getInfo();
      const roles = infoRes.roles || [];

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await permissionStore().generateRoutes(roles);

      // dynamically add accessible routes
      accessRoutes.forEach(item => {
        router.addRoute(item);
      });

      tagsViewStore().delAllViews();
    }
  }
});
