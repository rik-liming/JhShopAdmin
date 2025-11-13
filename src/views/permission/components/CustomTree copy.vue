<template>
  <div class="custom-tree">
    <TreeNode
      v-for="node in treeData"
      :key="node.id"
      :node="node"
      :level="0"
      @update-checked="onUpdateChecked"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineExpose } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps<{ treeData: any[], checkedRules?: number[] }>()
const treeData = props.treeData

const selectedLeafIds = ref<number[]>([])

const onUpdateChecked = () => {
  updateSelectedLeafIds(treeData)
}

const updateSelectedLeafIds = (nodes: any[]) => {
  selectedLeafIds.value = []
  const dfs = (arr: any[]) => {
    arr.forEach(n => {
      if (!n.children || n.children.length === 0) {
        if (n.checked) selectedLeafIds.value.push(n.id)
      } else {
        dfs(n.children)
      }
    })
  }
  dfs(nodes)
}

// 初始化勾选
if (props.checkedRules?.length) {
  const dfsInit = (nodes: any[]) => {
    nodes.forEach(n => {
      if (props.checkedRules.includes(n.id)) n.checked = true
      if (n.children) dfsInit(n.children)
    })
  }
  dfsInit(treeData)
  updateSelectedLeafIds(treeData)
}

// 父组件可调用获取选中叶子节点
defineExpose({
  getSelectedLeafIds: () => selectedLeafIds.value
})
</script>

<style scoped>
.custom-tree {
  width: 100%;
}
</style>
