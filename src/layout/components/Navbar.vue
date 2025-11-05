<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSidebar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">

      </template>

      <el-dropdown class="notification-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img 
            src="@/assets/notification_bell.png"
            class="user-avatar"
            @click="showMessageBox"
          > -->
          <notification-bell @toggleClick="showMessageBox" />
        </div>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img 
            src="@/assets/profile_icon.png" 
            class="user-avatar"
          >
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/setting/person">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <router-link to="/logout">
              <el-dropdown-item divided>登出</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import store from '@/store';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import NotificationBell from '@/components/NotificationBell';
import { defineComponent } from 'vue';
import emitter from '@/event/eventBus';

export default defineComponent({
  components: {
    Breadcrumb,
    Hamburger,
    NotificationBell,
  },
  computed: {
    ...mapState(store.app, [
      'sidebar',
      'device'
    ]),
    ...mapState(store.admin, [
      'avatar'
    ])
  },
  methods: {
    toggleSidebar() {
      store.app().toggleSidebar();
    },
    showMessageBox() {
      emitter.emit('business:updated', {});
    },
  }
});
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      line-height: 50px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container,
    .notification-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 10px;
        position: relative;
        height: 45px;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .notification-container {
      margin-right: 0;
      .avatar-wrapper {
        margin-top: 0px;
      }
    }
  }
}
</style>
