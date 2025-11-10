<template>
  <div style="padding: 6px 0px; position: relative;" @click="handleClick">
    <!-- 数字红点 -->
    <span
      class="notification-dot"
      :style="{
        width: dotSize + 'px',
        height: dotSize + 'px',
        right: dotRight + 'px',
        top: dotTop + 'px',
        lineHeight: dotSize + 'px',
        fontSize: fontSize + 'px'
      }"
    >
      {{ unreadCount > maxCount ? maxCount + '+' : unreadCount }}
    </span>

    <!-- 铃铛图标 -->
    <img
      src="@/assets/notification_bell.png"
      class="notification-bell"
      :class="{ 'is-rotating': isRotating }"
      :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import store from '@/store'
import * as MessageApi from '@/api/message'
import emitter from '@/event/eventBus';

const adminStore = store.admin()

// 动画状态
const isRotating = ref(false)

// 初始图标大小
const iconSize = ref(34)

// 设置未读数量和最大数量
const unreadCount = ref(0)
const maxCount = ref(99)

// 动态监听 device
watch(() => store.app().device, (newDevice) => {
  if (newDevice === 'mobile') {
    iconSize.value = 30
  } else if (newDevice === 'desktop') {
    iconSize.value = 44
  } else {
    iconSize.value = 30
  }
}, { immediate: true })

// 红点大小和位置
const dotSize = computed(() => iconSize.value * 0.4)
const dotRight = computed(() => iconSize.value * -0.1)
const dotTop = computed(() => iconSize.value * +0.1)
const fontSize = computed(() => dotSize.value * 0.6)

// emit 事件
const emit = defineEmits(['toggleClick'])

function handleClick() {
  isRotating.value = true
  setTimeout(() => {
    isRotating.value = false
    emit('toggleClick')
  }, 300)
}

// 更新红点数量
const updateReddot = async(from) => {
  try {
    const resp = await MessageApi.getMessageUnreadCount(adminStore.adminLoginToken, from)
    if (resp.data.code === 10000) {
      unreadCount.value = resp.data.data.unread_count
    }
  } catch (error) {
    unreadCount.value = 0
  }
}

const onBusinessUpdated = async(data) => {
  updateReddot('businessUpdated')
}

const onMessageRead = async(data) => {
  // 如果是自己
  if (data.admin_id === adminStore?.admin?.value?.id) {
    updateReddot('messageRead')
  }
}

// 初始化并定时更新红点
onMounted(async() => {
  updateReddot('showMessageBox')

  // 监听交易状态变更事件
  emitter.on('business:updated', onBusinessUpdated);

  // 监听消息弹框状态变更事件
  emitter.on('message:read', onMessageRead);
});
</script>

<style scoped>
.notification-bell {
  cursor: pointer;
  transition: transform 1s;
}

.notification-bell.is-rotating {
  transform: scale(1.5);
}

.notification-dot {
  position: absolute;
  background-color: red;
  color: white;
  text-align: center;
  border-radius: 50%;
  font-weight: bold;
  z-index: 2;
  box-sizing: border-box;
  padding: 0 3px; /* 当数字大于1位，增加左右内边距 */
}
</style>
