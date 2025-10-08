import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { setupStore } from './store';

import '@/styles/tailwind.css';
import '@/styles/index.scss';
import SvgIcon from './icons'; // icon
import * as permission from './permission'; // permission control
import vPermission from './directive/permission/index'; // permission control
// import { checkEnableLogs } from './utils/error-log'; // error log

import 'vuetify/styles'
// Vuetify 核心
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'


// 创建 Vuetify 实例
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

import waves from '@/directive/waves'

const app = createApp(App);
setupStore(app);
app.component('svg-icon', SvgIcon);
app.directive('permission', vPermission);
// checkEnableLogs(app);

// 挂载 Vuetify
app.use(vuetify)
app.directive('waves', waves)

async function initDynamicRoutes() {
  await permission.initDynamicRoutes()
}
initDynamicRoutes()

app.use(router);
app.mount('#app');
