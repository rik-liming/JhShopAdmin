import router from './router';
import store from '@/store';
import permissionStore from './store/modules/permission';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

// 在应用初始化时就进行动态路由的处理
export async function initDynamicRoutes() {
  const adminStore = store.admin();
  const hasToken = !!adminStore.adminLoginToken;

  if (hasToken) {
    const hasRoles = !!adminStore.admin?.value?.role;

    if (hasRoles) {
      let roles = [adminStore.admin?.value?.role];
      // 动态生成路由
      const accessRoutes = await permissionStore().generateRoutes(roles);
      
      // Dynamically add routes
      accessRoutes.forEach(route => {
        router.addRoute(route);  // Add the new route
      });
    }
  }
}

router.beforeEach(async (to, from, next) => {
  // console.log('router.beforeEach', to.path, from.path);
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const adminStore = store.admin()

  const hasToken = !!adminStore.adminLoginToken

  if (hasToken) {

    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      NProgress.done();
      next({ path: '/' });
    } else {
      const hasRoles = !!adminStore.admin?.value?.role

      // determine whether the user has obtained his permission roles through getInfo
      // console.log('hasRoles=', hasRoles);
      if (hasRoles) {
        let roles = [adminStore.admin?.value?.role]
        
        // Check if we already generated routes, if not, generate them dynamically
        // 动态生成路由
        const accessRoutes = await permissionStore().generateRoutes(roles);
        
        // Dynamically add routes
        accessRoutes.forEach(route => {
          router.addRoute(route);  // Add the new route
        });

        next();
      } else {
        try {
          ElMessage.error('无权访问!');
          NProgress.done();
          next(`/login?redirect=${to.path}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // remove token and go to login page to re-login
          // await userStore().resetToken();
          ElMessage.error(error.message || 'Has Error');
          NProgress.done();
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      NProgress.done();
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
