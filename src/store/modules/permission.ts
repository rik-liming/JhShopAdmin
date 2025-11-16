import { defineStore } from 'pinia';
import { asyncRoutes, firstConstantRoutes, lastConstantRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';
import { useStorage } from '@vueuse/core'
import * as RoleApi from '@/api/role'

interface IPermissionState {
  routes: Array<RouteRecordRaw>;
  addRoutes: Array<RouteRecordRaw>;
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasMenuPermission(route: RouteRecordRaw, routerKeys: string[]):boolean {
  // 有任意一条路由，前缀一致就证明有权限
  // 构建所有可访问的路径集合
  const allPaths = new Set();

  routerKeys.forEach(key => {
    const base = key.split(':')[0]; // 去掉权限后缀
    const parts = base.split('/').filter(Boolean); // 拆成数组
    let path = '';
    parts.forEach(p => {
      path += '/' + p;
      allPaths.add(path);
    });
    if (base === '') allPaths.add('/'); // 根路径
  });

  return allPaths.has(route.routerKey);
}


/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param role
 */
export function filterAsyncRoutes(routes:RouteRecordRaw[], routerKeys: string[]): Array<RouteRecordRaw> {
  const res:Array<RouteRecordRaw> = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasMenuPermission(tmp, routerKeys)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, routerKeys);
      }
      res.push(tmp);
    }
  });

  return res;
}

export default defineStore({
  id: 'permission',
  state: ():IPermissionState => ({
    routes: [],
    addRoutes: []
  }),
  getters: {},
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = routes;
    },
    async generateRoutes(adminLoginToken: string, adminId: string, role: string) {
      let accessedRoutes;
      if (role === 'superAdmin') {
        accessedRoutes = asyncRoutes || [];
      } else {
        const routerKeys = await this.loadRouterKeys(adminLoginToken, adminId)
        accessedRoutes = filterAsyncRoutes(asyncRoutes, routerKeys);
      }
      accessedRoutes = firstConstantRoutes.concat(accessedRoutes).concat(lastConstantRoutes)
      this.setRoutes(accessedRoutes);
      return accessedRoutes;
    },
    async fetchRouterKeys(adminLoginToken: string, adminId: string) {
      const resp = await RoleApi.getRoleRouterKeys(adminLoginToken)
      if (resp.data.code === 10000) {
        const routerKeys = resp.data.data.routerKeys;
        const storageKey = `routerKeys_admin_${adminId}`;
        const storage = useStorage<string[]>(storageKey, []);
        storage.value = routerKeys
        return routerKeys
      }
      return []
    },
    async loadRouterKeys(adminLoginToken: string, adminId: string) {
      if (!adminLoginToken || !adminId) {
        return []
      }

      const storageKey = `routerKeys_admin_${adminId}`;
      const storage = useStorage<string[]>(storageKey, []);
      if (!storage.value || storage.value == 0) {
        const latestRouterKeys = await this.fetchRouterKeys(adminLoginToken, adminId)
        return latestRouterKeys
      }
      return storage.value
    },
    // 同步获取最新的router keys，没获取到就默认不具有操作权限
    getLatestRouterKeys(adminId: string) {
      const storageKey = `routerKeys_admin_${adminId}`;
      const storage = useStorage<string[]>(storageKey, []);
      if (!storage.value || storage.value == 0) {
        return []
      }
      return storage.value
    },
    clearRouterKeys(adminId: string) {
      const storageKey = `routerKeys_admin_${adminId}`;
      const storage = useStorage<string[]>(storageKey, []);
      storage.value = [];
    }
  }
});
