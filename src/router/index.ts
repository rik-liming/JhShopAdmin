import { markRaw } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router'; // createWebHashHistory, createWebHistory
import type { Router, RouteRecordRaw, RouteComponent } from 'vue-router';
import { 
  Help as IconHelp, 
  HomeFilled as IconHome,
  Sell as IconWithdraw,
  SoldOut as IconDeposit,
  DArrowRight as IconTransfer,
  Plus as IconPublish,
  Money as IconFinance,
  SwitchButton as IconLogout,
  Setting as IconSetting,
  Tools as IconSettingSystem,
  Avatar as IconSettingPerson,
  Stamp as IconPermission,
  Present as IconReward,
  DataAnalysis as IconReport,
} from '@element-plus/icons-vue';
import store from '@/store';

/* Layout */
const Layout = ():RouteComponent => import('@/layout/index.vue');

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 *
 * 注意：hidden、alwaysShow 属性配置移动到了meta中！！！
 */
export const firstConstantRoutes:RouteRecordRaw[] = [
  // 不需要展示在侧边栏的
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectIndex',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/forcelogout',
    name: 'ForceLogout',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
    beforeEnter: async(to, from, next) => {
      try {
        await store.admin().logout();
        next('/login'); // 跳转到登录页面
      } catch (error) {
        console.error('Logout failed:', error);
        next('/login'); // 如果注销失败，也跳转到登录页面
      }
    } 
  },
  {
    path: '/auth-redirect',
    name: 'AuthRedirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  // 需要展示在侧边栏的
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'DashboardIndex',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  },
];

/**
 * .
 * the routes that need to be dynamically loaded based on user roles
 *
 * 注意：hidden、alwaysShow 属性配置移动到了meta中！！！
 */
export const asyncRoutes:RouteRecordRaw[] = [
  {
    path: '/setting',
    name: 'Setting',
    meta: { 
      roles: ['admin', 'superAdmin'],
      title: '常规管理', 
      icon: markRaw(IconSetting),
      alwaysShow: true, // will always show the root menu
    },
    component: Layout,
    children: [
      {
        path: 'system',
        component: () => import('@/views/setting/system.vue'),
        name: 'SettingSystem',
        meta: { 
          title: '系统配置', 
          affix: true,
          needIndent: true,
          roles: ['superAdmin'],
        }
      },
      {
        path: 'person',
        component: () => import('@/views/setting/person.vue'),
        name: 'SettingPerson',
        meta: { 
          title: '个人资料', 
          affix: true,
          needIndent: true,
        }
      },
    ]
  },
  {
    path: '/permission',
    name: 'Permission',
    meta: { 
      roles: ['superAdmin'],
      title: '权限管理', 
      icon: markRaw(IconPermission),
      alwaysShow: true, // will always show the root menu
    },
    component: Layout,
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role.vue'),
        name: 'PermissionRole',
        meta: { 
          title: '角色管理', 
          affix: true,
          needIndent: true,
        }
      },
      {
        path: 'admin',
        component: () => import('@/views/permission/admin.vue'),
        name: 'PermissionAdmin',
        meta: { 
          title: '管理员管理', 
          affix: true,
          needIndent: true,
        }
      },
    ]
  },
  {
    path: '/user',
    name: 'User',
    meta: { 
      roles: ['admin', 'superAdmin']
    },
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: '',
        component: () => import('@/views/user/index.vue'),
        name: 'UserIndex',
        meta: { 
          title: '会员管理', 
          icon: 'user', 
          affix: true,
          reddotKey: 'user',
        }
      }
    ]
  },
  {
    path: '/transaction',
    name: 'transaction',
    meta: { 
      roles: ['admin', 'superAdmin'],
      title: '财务管理', 
      icon: markRaw(IconPermission),
      alwaysShow: true, // will always show the root menu
      reddotKey: 'transaction',
    },
    component: Layout,
    children: [
      {
        path: 'record',
        component: () => import('@/views/transaction/record.vue'),
        name: 'TransactionRecord',
        meta: { 
          title: '财务变动', 
          affix: true,
          needIndent: true,
          hidden: true,
        }
      },
      {
        path: 'recharge',
        component: () => import('@/views/transaction/recharge.vue'),
        name: 'TransactionRecharge',
        meta: { 
          title: '充值管理', 
          affix: true,
          needIndent: true,
          reddotKey: 'recharge',
        }
      },
      {
        path: 'transfer',
        component: () => import('@/views/transaction/transfer.vue'),
        name: 'TransactionTransfer',
        meta: { 
          title: '转账管理', 
          affix: true,
          needIndent: true,
          reddotKey: 'transfer',
        }
      },
      {
        path: 'withdraw',
        component: () => import('@/views/transaction/withdraw.vue'),
        name: 'TransactionWithdraw',
        meta: { 
          title: '提现管理', 
          affix: true,
          needIndent: true,
          reddotKey: 'withdraw',
        }
      },
    ]
  },
  {
    path: '/order',
    name: 'Order',
    meta: { 
      alwaysShow: true, // will always show the root menu
      roles: ['admin', 'superAdmin'],
      title: '订单管理', 
      icon: 'shopping',
      reddotKey: 'order',
    },
    component: Layout,
    children: [
      {
        path: 'listing',
        component: () => import('@/views/order/listing.vue'),
        name: 'OrderListing',
        meta: { 
          title: '挂单管理', 
          affix: true,
          needIndent: true,
        }
      },
      {
        path: 'normal',
        component: () => import('@/views/order/normal.vue'),
        name: 'OrderNormal',
        meta: { 
          title: '常规订单', 
          affix: true,
          needIndent: true,
          reddotKey: 'order_normal',
        }
      },
      {
        path: 'auto',
        component: () => import('@/views/order/auto.vue'),
        name: 'OrderAuto',
        meta: { 
          title: '自动化订单', 
          affix: true,
          needIndent: true,
          reddotKey: 'order_auto',
        }
      },
    ]
  },
  {
    path: '/report',
    name: 'Report',
    meta: { 
      alwaysShow: true, // will always show the root menu
      roles: ['admin', 'superAdmin'],
      title: '报表管理', 
      icon: markRaw(IconReport),
    },
    component: Layout,
    children: [
      {
        path: 'agent',
        component: () => import('@/views/report/agent.vue'),
        name: 'AgentReport',
        meta: { 
          title: '代理', 
          affix: true,
          needIndent: true,
        }
      },
      {
        path: 'auto_buyer',
        component: () => import('@/views/report/autoBuyer.vue'),
        name: 'AutoBuyerReport',
        meta: { 
          title: '自动化买家', 
          affix: true,
          needIndent: true,
        }
      },
      {
        path: 'buyer',
        component: () => import('@/views/report/buyer.vue'),
        name: 'BuyerReport',
        meta: { 
          title: '系统买家', 
          affix: true,
          needIndent: true,
        }
      },
    ]
  },
  // {
  //   path: '/reward',
  //   name: 'Reward',
  //   meta: { 
  //     roles: ['admin', 'superAdmin'],
  //   },
  //   redirect: '/reward/index',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/reward/index.vue'),
  //       name: 'RewardIndex',
  //       meta: { 
  //         title: '奖励管理', 
  //         affix: true,
  //         icon: markRaw(IconReward),
  //       }
  //     },
  //   ]
  // },
];

export const lastConstantRoutes:RouteRecordRaw[] = [
  // logout
  {
    path: '/logout',
    name: 'Logout',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/login/index.vue'),
        name: 'LogoutIndex',
        meta: { title: '登出', icon: markRaw(IconLogout), affix: false }
      }
    ],
    beforeEnter: async(to, from, next) => {
      await store.admin().logout();
      next('/login')
    } 
  },

  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', name: 'NoMatch', redirect: '/404', meta: { hidden: true }}
];

console.log('BASE_URL=', import.meta.env);

const createTheRouter = ():Router => createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // 注意，如果要配置 HTML5 模式，则需要修改nginx配置，参考资料：
  // https://router.vuejs.org/zh/guide/essentials/history-mode.html
  // history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: firstConstantRoutes
});

interface RouterPro extends Router {
  matcher: unknown;
}

const router = createTheRouter() as RouterPro;

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  // router.clearRoutes(); RangeError: Maximum call stack size exceeded
  const newRouter = createTheRouter() as RouterPro;
  router.matcher = newRouter.matcher; // reset router
}

export default router;
