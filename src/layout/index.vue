<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="isSidebarVisible" class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container" :style="bgStyle">
      <app-main />
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div>
  </div>
</template>

<script>
import { AppMain, Settings, Sidebar, TagsView } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapState } from 'pinia';
import store from '@/store';
import { defineComponent } from 'vue';
import mainBackground from '@/assets/main_background.jpg';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'LayoutIndex',
  components: {
    AppMain,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      // 把图片放到 data/context 中，以便模板能访问到
      mainBackground
    };
  },
  computed: {
    ...mapState(store.app, ['sidebar', 'device']),
    ...mapState(store.settings, {
      showSettings: 'showSettings',
      needTagsView: 'tagsView',
      fixedHeader: 'fixedHeader'
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        noSidebar: !this.isSidebarVisible,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    },
    // 内联样式对象：确保 background-image 是合法 url(...)
    bgStyle() {
      const minRadius = Math.min(window.innerWidth * 0.1, window.innerHeight * 0.1); // 计算 11vw 和 11vh 的最小值
      return {
        backgroundImage: `url(${this.mainBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        /* 自适应 iPhone 风格圆角 */
        borderRadius: `${minRadius}px`, // 通过计算得到的最小值
        overflow: 'hidden',
      };
    },
    // 使用当前路由判断是否需要显示 sidebar
    isSidebarVisible() {
      const route = useRoute();
      const hiddenSidebarPages = ['/buy', '/pay']; // 设置在这些路由下不显示 sidebar
      return !hiddenSidebarPages.includes(route.path);
    },
  },
  methods: {
    handleClickOutside() {
      store.app().closeSidebar({ withoutAnimation: false });
    }
  }
});
</script>

<style lang="scss" scoped>
@use "@/styles/mixin.scss";
// @use "@/styles/variables.module.scss";

.app-wrapper {
  @include mixin.clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  /* 为了避免祖先元素没有高度导致背景看不见，使用 min-height:100vh 作为保险 */
  // min-height: 100vh;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

</style>
