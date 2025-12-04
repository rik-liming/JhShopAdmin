<template>
  <div>
	<el-dialog
		v-model="forceLogoutVisible"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:show-close="false"
		class="tw-w-[80%] tw-rounded-xl !tw-flex !tw-flex-col !tw-items-center"
		align-center
	>
		<div class="tw-text-[20px] tw-font-bold tw-font-pingfang tw-mb-4">{{ forceLogoutTitle }}</div>
		<div class="tw-text-[16px] tw-font-pingfang tw-text-center">{{ forceLogoutMsg }}</div>

		<v-btn
			class="my-4 mx-auto"
			color="success"
			height="40"
			text="重新登录"
			variant="flat"
			width="70%"
			@click="logoutHandle"
		></v-btn>
	</el-dialog>

	<el-dialog
		v-model="messageDialogVisible"
		class="messageDialog" 
		align-center
	>
      <div class="tw-text-[20px] tw-text-center tw-mb-4">{{ messageDialogTitle }}</div>
      <notification-table :tableKey="messageDialogTableKey" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { ElMessageBox } from 'element-plus';
import emitter from '@/event/eventBus';
import { useRouter, useRoute } from 'vue-router';
import store from '@/store'

const router = useRouter()
const route = useRoute()
const adminStore = store.admin()

const forceLogoutVisible = ref(false);
const forceLogoutTitle = ref('')
const forceLogoutMsg = ref('')

const messageDialogVisible = ref(false)
const messageDialogTitle = ref('')
const messageDialogTableKey = ref(Math.random())

const onBusinessUpdated = async(data) => {
	if (!adminStore?.admin?.value?.role) {
		return
	}

	messageDialogTitle.value = "待处理业务消息"
	
	updateTableKey()

	if (!messageDialogVisible.value) {
		messageDialogVisible.value = true;
	}
}

const onMessageRead = async(data) => {
	// 如果是自己
	if (data.admin_id === adminStore?.admin?.value?.id) {
		messageDialogVisible.value = false;	
	}
}

const onAdminStatusChanged = async(data) => {
	// 如果是自己
	if (data.admin_id === adminStore?.admin?.value?.id) {
		forceLogoutTitle.value = "状态变更"
		forceLogoutMsg.value = "您的账户状态已变更，请重新登录"
		forceLogoutVisible.value = true;
	}
}

const onAdminRoleStatusChanged = async(data) => {
	// 如果是自己所属角色
	if (data.role === adminStore?.admin?.value?.role) {
		forceLogoutTitle.value = "状态变更"
		forceLogoutMsg.value = "您的角色状态已变更，请重新登录"
		forceLogoutVisible.value = true;
	}
}

const onAdminPrivilegeChanged = async(data) => {
	// 如果是自己所属角色
	if (data.role === adminStore?.admin?.value?.role) {
		forceLogoutTitle.value = "权限变更"
		forceLogoutMsg.value = "您的角色权限已变更，请重新登录"
		forceLogoutVisible.value = true;
	}
}

const onAdminPasswordChanged = async(data) => {
	// 如果是自己
	if (data.admin_id === adminStore?.admin?.value?.id) {
		forceLogoutTitle.value = "密码变更"
		forceLogoutMsg.value = "您的账户密码已变更，请重新登录"
		forceLogoutVisible.value = true;
	}
}

onMounted(() => {

  // 检查是否存在强制退出弹框
  checkForceLogout()

  // 监听业务更新事件
  emitter.on('business:updated', onBusinessUpdated);

  // 监听消息弹框状态变更事件
  emitter.on('message:read', onMessageRead);

  // 监听管理员状态变更事件
  emitter.on('admin:statusChanged', onAdminStatusChanged);

  // 监听角色状态变更事件
  emitter.on('admin:roleStatusChanged', onAdminRoleStatusChanged);

  // 监听角色权限变更事件
  emitter.on('admin:privilegeChanged', onAdminPrivilegeChanged);

  // 监听管理员密码变更事件
  emitter.on('admin:passwordChanged', onAdminPasswordChanged);

  // 可以在这里继续监听其他全局事件
  // emitter.on('user:assetChanged', ...)
});

onUnmounted(() => {
  // 移除事件，防止重复监听
  emitter.off('business:updated', onBusinessUpdated);
  emitter.off('message:read', onMessageRead);
  emitter.off('admin:statusChanged', onAdminStatusChanged);
  emitter.off('admin:roleStatusChanged', onAdminStatusChanged);
  emitter.off('admin:privilegeChanged', onAdminPrivilegeChanged);
  emitter.off('admin:passwordChanged', onAdminPasswordChanged);
});

// 监听弹窗状态，动态注册/移除刷新拦截事件
watch(forceLogoutVisible, (newVal) => {
  if (newVal) {
    // 弹窗打开时，拦截刷新
    window.addEventListener('beforeunload', forceLogoutBeforeUnload)
  } else {
    // 弹窗关闭时，取消拦截
    window.removeEventListener('beforeunload', forceLogoutBeforeUnload)
  }
})

const forceLogoutBeforeUnload = (e) => {
  // 如果检测到刷新，就强制退出
  const data = {
	flag: true,
	expiresAt: Date.now() + 5 * 60 * 1000 // 5分钟有效
  }
  localStorage.setItem(`forceLogout_admin_${adminStore?.admin?.value?.id}`, JSON.stringify(data))
}

/** 检测是否有强制登出标记 */
const checkForceLogout = () => {
	if (!adminStore?.admin?.value?.id) return
	const data = localStorage.getItem(`forceLogout_admin_${adminStore?.admin?.value?.id}`)
	if (!data) return

	try {
		const { flag, expiresAt } = JSON.parse(data)
		if (flag && Date.now() < expiresAt) {
			localStorage.removeItem(`forceLogout_admin_${adminStore?.admin?.value?.id}`)
			router.replace('/forcelogout')
		} else {
			localStorage.removeItem(`forceLogout_admin_${adminStore?.admin?.value?.id}`) // 清理过期数据
		}
	} catch {
		localStorage.removeItem(`forceLogout_admin_${adminStore?.admin?.value?.id}`)
	}
}

const logoutHandle = async() => {
	forceLogoutVisible.value = false
	router.replace('/forcelogout')
}

const updateTableKey = () => {
	messageDialogTableKey.value = Math.random()
}

</script>

<style scoped lang="scss">

:deep(div.el-dialog.custom-dialog) {
	width: 80% !important;
	--el-dialog-width: 80% !important;
	display: flex !important;
	flex-direction: column !important;
	align-items: center !important;
}

:deep(.el-dialog__header) {
/* Adjust the header if needed */
	padding: 10px 20px !important;
	margin-left: -180px !important;
}

:deep(.el-dialog__body) {
	padding: 20px !important; /* Adjust body padding */
	display: flex !important;
	flex-direction: column !important;
	align-items: center !important;
}

:deep(.el-dialog__footer) {
	padding: 10px 20px !important; /* Adjust footer padding */
}

:deep(.el-dialog.messageDialog) {
  background-image: url('@/assets/main_background.jpg'); /* 设置背景图片 */
  background-size: cover; /* 背景图片覆盖整个区域 */
  background-position: center; /* 背景图片居中 */
  background-repeat: no-repeat; /* 背景图片不重复 */
  width: 80% !important;
  --el-dialog-width: 80% !important;
  padding: 0 !important;
}

</style>
