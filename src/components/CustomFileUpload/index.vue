<template>
  <div class="tw-flex tw-flex-col tw-items-center">
    <!-- 选择文件按钮 -->
    <input
      type="file"
      accept="image/*"
      @change="handleFileChange"
      class="tw-hidden"
      ref="fileInput"
    />
    
    <!-- 上传按钮 -->
    <div
        class="tw-w-full tw-h-28 tw-bg-gray-100 tw-border tw-border-dashed tw-border-gray-400 tw-rounded-md tw-flex tw-items-center tw-justify-center"
        @click="triggerFileInput"
    >
        <div
            class="tw-text-gray-400 tw-text-sm"
        >
            点击上传
        </div>
    </div>

    <!-- 预览区域 -->
    <div v-if="imageUrl" class="tw-m-4 tw-flex">
      <img :src="imageUrl" alt="Preview" class="tw-w-32 tw-h-32 tw-object-cover" />
      <button
        @click="removeImage"
        class="tw-text-sm tw-text-red-500 tw-ml-2 tw-ml-4"
      >
        删除
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['update:file'])

const imageUrl = ref('') // 用于保存图片预览的 URL
const selectedFile = ref(null) // 用于保存选择的文件
const fileInput = ref(null)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 创建图片预览
    const reader = new FileReader()
    reader.onload = () => {
      imageUrl.value = reader.result
    }
    reader.readAsDataURL(file)

    selectedFile.value = file // 保存文件对象

    // 触发事件将文件对象传递给父组件
    emit('update:file', file)
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const removeImage = () => {
  imageUrl.value = '' // 清除预览
  selectedFile.value = null // 清空文件对象
  emit('update:file', null) // 清空父组件传递的文件
  fileInput.value.value = '' // 清空文件选择
}
</script>

<style scoped>
.tw-hidden {
  display: none;
}
</style>
