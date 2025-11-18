<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu class="left-menu" :default-active="activeMenu" :collapse="isCollapse"
               :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false"
               :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item 
          v-for="route in permission_routes" 
          :key="route.path" 
          :item="route" 
          :base-path="route.path" 
          :is-top-route="true"
          :reddot="reddot"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
// import variables from '@/styles/variables.modules.scss';
import store from '@/store';
import * as ReddotApi from '@/api/reddot'
import emitter from '@/event/eventBus';

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem,
    Logo
  },
  data() {
    return {
      variables: {
        menuBg: '#304156',
        menuText: '#fff',
        menuActiveText: '#409EFF'
      },
      reddot: {}, // 红点数据
      reddotTimer: null,
    };
  },
  computed: {
    ...mapState(store.app, ['sidebar']),
    ...mapState(store.permission, {
      permission_routes: 'routes'
    }),
    ...mapState(store.settings, {
      secondMenuPopup: 'secondMenuPopup'
    }),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return store.settings().sidebarLogo;
    },
    isCollapse() {
      if (this.secondMenuPopup) {
        return true;
      }
      return !this.sidebar.opened;
    }
  },
  methods: {
    // 获取红点数据
    async fetchReddot() {
      try {
        const resp = await ReddotApi.getReddot(store.admin().adminLoginToken)
        if (resp.data.code === 10000) {
          this.reddot = resp.data.data.reddot;
        }
      } catch (err) {
        console.error('获取红点失败', err);
      }
    },
    async onReddotUpdated(data) {
      this.fetchReddot();
    }
  },
  mounted() {
    this.fetchReddot(); // 组件加载时立即请求一次
    this.reddotTimer = setInterval(this.fetchReddot, 5 * 60 * 1000); // 每5分钟请求一次，校正一下，以防推送没收到
    
    // 监听红点变更事件
    emitter.on('reddot:updated', this.onReddotUpdated);
  },
  beforeUnmount() {
    clearInterval(this.reddotTimer); // 销毁组件时清理定时器

    // 移除红点变更事件监听
    emitter.off('reddot:updated', this.onReddotUpdated);
  }
});
</script>
