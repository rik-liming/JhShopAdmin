<template>
  <div v-if="!isItemHidden" class="root-sidebar-item">
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !(item.meta && item.meta.alwaysShow)">
      <app-link class="link" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item class="left-menu-item" v-if="onlyOneChild.meta" :index="resolvePath(onlyOneChild.path)"
                      :class="{ 'submenu-title-noDropdown': !isNest }">

          <!-- <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" /> -->
          <template v-if="get2MetaIconPath(onlyOneChild, item)">
            <template v-if="typeof get2MetaIconPath(onlyOneChild, item) === 'string'">
              <svg-icon :icon-class="get2MetaIconPath(onlyOneChild, item)" />
              <span v-if="secondMenuPopup && isTopRoute" class="text text-one text-one-added">{{ onlyOneChild.meta.title }}</span>
            </template>
            <component v-else :is="get2MetaIconPath(onlyOneChild, item)" class="svg-icon el-svg-icon" />
          </template>
          <template #title>
            <span class="text text-one">{{ onlyOneChild.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu class="left-sub-menu" v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
      <template v-if="item.meta" #title>
        <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" /> -->
        <template v-if="getMetaIconPath(item)">
          <svg-icon v-if="typeof getMetaIconPath(item) === 'string'" :icon-class="getMetaIconPath(item)" />
          <component v-else :is="getMetaIconPath(item)" class="svg-icon el-svg-icon" />
        </template>
        <!-- <svg-icon v-else icon-class="list" /> -->
        <span class="text text-two">{{ item.meta.title }}</span>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                    :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-sub-menu>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import path from 'path-browserify';
import { isExternal } from '@/utils/validate';
// import Item from './Item';
import AppLink from './Link';
import FixiOSBug from './FixiOSBug';
import { mapState } from 'pinia';
import store from '@/store';

export default defineComponent({
  name: 'SidebarItem',
  components: {
    // Item,
    AppLink
  },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    isTopRoute: { // 是否为顶层路由
      type: Boolean,
      default: false
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  computed: {
    ...mapState(store.settings, {
      secondMenuPopup: 'secondMenuPopup'
    }),
    isItemHidden() {
      if (this.item.meta && this.item.meta.hidden) {
        return true;
      }
      return false;
    }
  },
  methods: {
    getMetaIconPath(item) {
      return item.meta && item.meta.icon;
    },
    get2MetaIconPath(onlyOneChild, item) {
      return onlyOneChild.meta.icon || (item.meta && item.meta.icon);
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (this.isItemHidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
});
</script>

<style lang="scss" scoped>
.link :deep(.el-menu-tooltip__trigger) {
  position: relative;
  padding: 0;
}

.left-menu-item,
.left-sub-menu :deep(.el-sub-menu__title) {
  display: block;
}

.el-svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.left-menu-item {
  // background: #1e3a8a; /* 初始背景色为深蓝色 */
  border: 2px solid transparent; /* 透明边框 */
  color: #fff;
  padding-left: 20px !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  transition: background-color 0.4s ease, color 0.4s ease, border-color 0.6s ease;
  text-align: left;
}

/* 鼠标悬停时的效果 */
.left-menu-item:hover {
  background: linear-gradient(to right, 
    rgba(0, 0, 0, 0.1) 10%,   /* 黑色，透明度为0.8 */
    rgb(45, 97, 241) 80%, /* 深蓝色，完全不透明 */
    rgba(0, 0, 0, 0.8) 100%    /* 黑色，透明度为0.8 */
  );

  color: #fff; /* 鼠标悬停时文字颜色 */
  border-color: skyblue; /* 鼠标悬停时边框颜色变化 */
  // font-size: 18px;
  // font-weight: bold;
}

.left-menu-item.is-active {
  background: linear-gradient(to right, 
    rgba(0, 0, 0, 0.1) 10%,   /* 黑色，透明度为0.8 */
    rgb(45, 97, 241) 80%, /* 深蓝色，完全不透明 */
    rgba(0, 0, 0, 0.8) 100%    /* 黑色，透明度为0.8 */
  );
  color: #fff; /* 鼠标悬停时文字颜色 */
  border-color: skyblue; /* 鼠标悬停时边框颜色变化 */
  font-size: 16px;
  font-weight: bold;
}

.left-menu-item:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  right: -100%;
  bottom: 0;
  background: #1e3a8a; /* 初始背景色 */
  transition: all 0.4s ease; /* 加速过渡 */
  z-index: -1; /* 确保渐变层在按钮内容的下层 */
}

.left-menu-item:hover:before {
  left: 0;
  right: 0;
}
</style>
