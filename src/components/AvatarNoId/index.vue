<template>
  <div style="padding: 8px 0;display: flex; align-items: center;" @click="handleClick">
    <img
      src="@/assets/profile_icon.png"
      class="profile-icon"
      :class="{ 'is-rotating': isRotating }"
      :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import store from '@/store'

// 动画状态
const isRotating = ref(false)

// 设置初始图标大小
let iconSize = ref(40)

// 动态监听 device 的变化
watch(() => store.app().device, (newDevice) => {
  if (newDevice === 'mobile') {
    iconSize.value = 28
  } else if (newDevice === 'desktop') {
    iconSize.value = 40
  } else {
    iconSize.value = 40 // 默认值
  }
}, { immediate: true }) // { immediate: true } 确保页面加载时会立即获取 device 的值

// emit 事件
const emit = defineEmits(['toggleClick'])

function handleClick() {
  // 触发旋转
  isRotating.value = true
  setTimeout(() => {
    isRotating.value = false

    // 触发原来的事件
    emit('toggleClick')
  }, 300) // 动画时间 1s
}
</script>

<style scoped>
.profile-icon {
  cursor: pointer;
  transition: transform 1s;
}

.profile-icon.is-rotating {
  transform: scale(1.5);  /* 放大 1.2 倍 */
}
</style>
