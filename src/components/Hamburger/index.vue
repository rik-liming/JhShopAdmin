<template>
  <div style="padding: 6px 15px;" @click="handleClick">
    <img
      src="@/assets/logo.png"
      class="hamburger-logo"
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
    iconSize.value = 40
  } else if (newDevice === 'desktop') {
    iconSize.value = 60
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
.hamburger-logo {
  transition: transform 1s;
}

.hamburger-logo.is-rotating {
  transform: rotate(360deg);
}
</style>
