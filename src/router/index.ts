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
export const constantRoutes:RouteRecordRaw[] = [
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
    path: '/order/buyer/buy',
    component: Layout,
    name: 'OrderBuyerBuy',
    meta: { 
      hidden: true,
      roles: ['buyer']
    },
    children: [
      {
        path: '',
        name: 'OrderBuyerBuyIndex',
        component: () => import('@/views/buyer/order/buy.vue')
      },
    ]
  },
  {
    path: '/order/buyer/detail',
    component: Layout,
    name: 'OrderBuyerDetail',
    meta: { 
      hidden: true,
      roles: ['buyer']
    },
    children: [
      {
        path: '',
        name: 'OrderBuyerDetailIndex',
        component: () => import('@/views/buyer/order/detail.vue')
      }
    ]
  },
  {
    path: '/order/seller/detail',
    name: 'OrderSellerDetail',
    component: Layout,
    meta: { 
      hidden: true,
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        name: 'OrderSellerDetailIndex',
        component: () => import('@/views/seller/order/detail.vue')
      }
    ]
  },
  {
    path: '/deposit/detail',
    name: 'DepositDetail',
    component: Layout,
    meta: { 
      hidden: true,
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        name: 'DepositDetailIndex',
        component: () => import('@/views/seller/deposit/detail.vue')
      }
    ]
  },
  {
    path: '/transfer/detail',
    name: 'TransferDetail',
    component: Layout,
    meta: { 
      hidden: true,
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        name: 'TransferDetailIndex',
        component: () => import('@/views/seller/transfer/detail.vue')
      }
    ]
  },
  {
    path: '/withdraw/detail',
    name: 'WithdrawDetail',
    component: Layout,
    meta: { 
      hidden: true,
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        name: 'WithdrawDetailIndex',
        component: () => import('@/views/seller/withdraw/detail.vue')
      }
    ]
  },
  {
    path: '/report',
    name: 'Report',
    component: Layout,
    meta: { 
      hidden: true,
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        name: 'ReportIndex',
        component: () => import('@/views/seller/report/index.vue')
      }
    ]
  },

  // 需要展示在侧边栏的
  {
    path: '/deposit',
    name: 'Deposit',
    component: Layout,
    meta: { 
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        component: () => import('@/views/seller/deposit/index.vue'),
        name: 'DepositIndex',
        meta: { title: '充值', icon: markRaw(IconDeposit), affix: true }
      }
    ]
  },
  {
    path: '/transfer',
    name: 'Transfer',
    component: Layout,
    redirect: '/transfer/index',
    meta: { 
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        component: () => import('@/views/seller/transfer/index.vue'),
        name: 'TransferIndex',
        meta: { title: '转账', icon: markRaw(IconTransfer), affix: true }
      }
    ]
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: Layout,
    redirect: '/withdraw/index',
    meta: { 
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        component: () => import('@/views/seller/withdraw/index.vue'),
        name: 'WithdrawIndex',
        meta: { title: '提现', icon: markRaw(IconWithdraw), affix: true }
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: Layout,
    redirect: '/order/index',
    meta: { 
      roles: ['buyer', 'seller', 'agent']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/order/index.vue'),
        name: 'OrderIndex',
        meta: { title: '订单', icon: 'shopping', affix: true }
      }
    ]
  },
  {
    path: '/order/seller/publish',
    name: 'OrderSellerPublish',
    component: Layout,
    meta: { 
      roles: ['seller', 'agent']
    },
    children: [
      {
        path: '',
        component: () => import('@/views/seller/order/publish.vue'),
        name: 'OrderSellerPublishIndex',
        meta: { title: '发布交易', icon: markRaw(IconPublish), affix: true }
      }
    ]
  },
  {
    path: '/finance',
    name: 'Finance',
    component: Layout,
    redirect: '/finance/index',
    meta: { 
      roles: ['buyer', 'seller', 'agent']
    },
    children: [
      {
        path: 'finance',
        component: () => import('@/views/user/finance/index.vue'),
        name: 'FinanceIndex',
        meta: { title: '财务变动', icon: markRaw(IconFinance), affix: true }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Layout,
    redirect: '/profile/index',
    children: [
      {
        path: '',
        component: () => import('@/views/user/profile/index.vue'),
        name: 'ProfileIndex',
        meta: { title: '会员信息', icon: 'user', affix: true }
      }
    ]
  },

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
      await store.user().logout();
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
  routes: constantRoutes
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
