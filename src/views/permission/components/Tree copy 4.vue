<template>
  <div class="p-4">
    <el-tree
      ref="treeRef"
      :key="treeKey"
      :data="privilegeTree"
      :checked-keys="checkedRules"
      show-checkbox
      node-key="id"
      :props="{ children: 'children', label: 'name' }"
      class="border p-3 rounded-md custom-tree"
      @check="onNodeCheck"
      @node-expand="onNodeExpandCollapse"
      @node-collapse="onNodeExpandCollapse"
    >
      <template #default="{ node, data }">
        <div class="node-content-wrapper">
          {{ data.name }}
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, nextTick, defineExpose } from 'vue'

const props = defineProps<{
  privilegeTree: any[],
  treeKey: number,
  checkedRules: number[],
}>()

const treeRef = ref<any>(null)

// 手动设置选中项
function manuallyCheckNodes(tree, ids) {
  if (!tree || !Array.isArray(ids)) return
  ids.forEach(id => {
    const node = tree.getNode(id)
    if (node) node.checked = true
  })
}

// 只对叶子节点的直接子节点横排
function markLeafChildrenRows() {
  const treeEl = treeRef.value?.$el
  if (!treeEl) return

  // 清理旧样式
  treeEl.querySelectorAll('.leaf-children-row').forEach(el => el.classList.remove('leaf-children-row'))

  const nodes = treeEl.querySelectorAll('.el-tree-node')
  nodes.forEach(nodeEl => {
    const childrenContainer = nodeEl.querySelector(':scope > .el-tree-node__children')
    if (!childrenContainer) return

    const childNodes = Array.from(childrenContainer.querySelectorAll(':scope > .el-tree-node'))
    if (childNodes.length === 0) return

    // 判断所有直接子节点是否都是叶子节点
    const allChildrenAreLeaf = childNodes.every(childEl => {
      const grandChildren = childEl.querySelector(':scope > .el-tree-node__children')
      if (!grandChildren) return true
      return grandChildren.querySelectorAll(':scope > .el-tree-node').length === 0
    })

    if (allChildrenAreLeaf) {
      childrenContainer.classList.add('leaf-children-row')
    }
  })
}

// 节点展开/收起时重新标记横排
const onNodeExpandCollapse = () => {
  requestAnimationFrame(() => {
    markLeafChildrenRows()
  })
}

// 勾选逻辑
const onNodeCheck = (data, { checkedKeys }) => {
  const tree = treeRef.value
  const node = tree.getNode(data.id)
  if (!node) return

  if (node.checked) {
    let parent = node.parent
    while (parent && parent.level > 0) {
      tree.setChecked(parent.data.id, true, false)
      parent = parent.parent
    }
  } else {
    const uncheckChildren = (n) => {
      if (n.childNodes?.length) {
        n.childNodes.forEach(c => {
          tree.setChecked(c.data.id, false, false)
          uncheckChildren(c)
        })
      }
    }
    uncheckChildren(node)
  }

  requestAnimationFrame(() => {
    markLeafChildrenRows()
  })
}

// 父组件获取选中节点
const getSelectedRules = () => treeRef.value?.getCheckedKeys() || []
defineExpose({ getSelectedRules })

// 初次渲染和 checkedRules 变化
const renderTree = async () => {
  await nextTick()
  manuallyCheckNodes(treeRef.value, props.checkedRules)
  await nextTick()
  markLeafChildrenRows()
}

onMounted(() => renderTree())
watch(() => props.checkedRules, () => renderTree(), { immediate: true })
</script>

<style scoped>
.border {
  border: 1px solid #e5e7eb;
}

/* 横排叶子集合的样式 */
:deep(.leaf-children-row) {
  display: flex !important;
  flex-wrap: wrap;
  gap: 10px;
}

/* 子节点项微调 */
:deep(.leaf-children-row > .el-tree-node) {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
}

/* 父节点内容对齐 */
.custom-tree .el-tree-node__content {
  display: flex;
  align-items: center;
}
</style>
