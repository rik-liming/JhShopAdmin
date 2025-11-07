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
import { onMounted, ref } from 'vue';
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

onMounted(() => {

  // 监听用户角色变更事件
//   emitter.on('user:roleChanged', async (data: any) => {

// 	// 如果是自己
// 	if (data.user_id === userStore?.user?.value?.id) {
// 		forceLogoutTitle.value = "角色变更"
// 		forceLogoutMsg.value = "您的角色已变更，请重新登录"
// 		forceLogoutVisible.value = true;
// 	}
//   });

  // 监听交易状态变更事件
//   emitter.on('transaction:updated', async (data: any) => {
// 	// 如果是自己
// 	if (data.user_id === userStore?.user?.value?.id) {
// 		messageDialogTitle.value = "系统消息"
// 		messageDialogVisible.value = true;
// 	}
//   });

  // 监听业务更新事件
  emitter.on('business:updated', async (data: any) => {
	messageDialogTitle.value = "待处理业务消息"
	
	updateTableKey()

	if (!messageDialogVisible.value) {
		messageDialogVisible.value = true;
	}
  });

  // 监听消息弹框状态变更事件
  emitter.on('message:read', async (data: any) => {
	// 如果是自己
	if (data.admin_id === adminStore?.admin?.value?.id) {
		messageDialogVisible.value = false;	
	}
  });
  

  // 可以在这里继续监听其他全局事件
  // emitter.on('user:assetChanged', ...)
});

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
