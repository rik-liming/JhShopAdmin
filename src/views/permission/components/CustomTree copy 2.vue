<template>
  <div class="tree-container">
    <TreeNode
      v-for="node in treeData"
      :key="node.id"
      :node="node"
      @update-checked="updateChecked"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps<{
  treeData: any[]
}>()

const updateChecked = () => {
  // 父组件可以在这里拿到最新勾选状态
}
</script>

<style scoped>
.tree-container {
  font-family: Arial, sans-serif;
  font-size: 14px;
}
</style>
