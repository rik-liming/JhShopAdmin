<template>
  <div class="p-4">
    <el-tree
      ref="treeRef"
      :key="treeKey"
      :data="privilegeTree"
      :checkedKeys="checkedRules"
      show-checkbox
      node-key="id"
      :props="{ children: 'children', label: 'name' }"
      class="border p-3 rounded-md custom-tree"
      @check="onNodeCheck"
      @node-expand="onNodeExpand"
      @node-collapse="onNodeCollapse"
    >
      <template #default="{ data }">
        <div class="node-content-wrapper">
          {{ data.name }}
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, defineProps, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'
import * as RoleApi from '@/api/role'
import store from '@/store'

/**
 * Props 定义
 */
const props = defineProps<{
  privilegeTree: any[]
  role: string
  treeKey: number
  checkedRules: number[]
}>()

const adminStore = store.admin()
const treeRef = ref<any>(null)

/**
 * 生命周期：初始化渲染
 */
onMounted(async () => {
  await nextTick()
  manuallyCheckNodes(treeRef.value, props.checkedRules)
  await nextTick()
  markLeafChildrenRows()
})

/**
 * 监听角色或选中规则变化时重新渲染
 */
watch(
  () => [props.role, props.checkedRules],
  async () => {
    await nextTick()
    manuallyCheckNodes(treeRef.value, props.checkedRules)
    await nextTick()
    markLeafChildrenRows()
  },
  { immediate: true }
)

/**
 * 手动设置选中项（仅勾选指定 ID，不触发级联）
 */
function manuallyCheckNodes(tree, ids: number[]) {
  if (!tree || !Array.isArray(ids)) return
  ids.forEach(id => {
    const node = tree.getNode(id)
    if (node) {
      node.checked = true
    }
  })
}

/**
 * 标记那些其子节点都是叶子的父节点的 children 容器
 */
function markLeafChildrenRows() {
  const treeEl = treeRef.value?.$el
  if (!treeEl) return

  // 清除旧样式
  treeEl.querySelectorAll('.leaf-children-row').forEach(el => {
    el.classList.remove('leaf-children-row')
  })

  const nodes = treeEl.querySelectorAll('.el-tree-node')
  nodes.forEach(nodeEl => {
    const childrenContainer = nodeEl.querySelector(':scope > .el-tree-node__children')
    if (!childrenContainer) return

    const childNodes = Array.from(childrenContainer.querySelectorAll(':scope > .el-tree-node'))
    if (childNodes.length === 0) return

    // 判断这些直接子项是否全都是“叶子”
    const allChildrenAreLeaf = childNodes.every(childEl => {
      const grandChildren = childEl.querySelector(':scope > .el-tree-node__children')
      return !grandChildren || grandChildren.querySelectorAll(':scope > .el-tree-node').length === 0
    })

    if (allChildrenAreLeaf && !childrenContainer.classList.contains('leaf-children-row')) {
      childrenContainer.classList.add('leaf-children-row')
    }
  })
}

/**
 * 处理节点选中逻辑（父子级联）
 */
const onNodeCheck = (data, { checkedKeys }) => {
  const tree = treeRef.value
  const node = tree.getNode(data.id)

  if (node.checked) {
    // 勾选时自动选中所有父节点
    let parent = node.parent
    while (parent && parent.level > 0) {
      tree.setChecked(parent.data.id, true, false)
      parent = parent.parent
    }
  } else {
    // 取消选中时，取消所有子节点
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

  // 展开/收起后重新标记布局
  requestAnimationFrame(() => {
    markLeafChildrenRows()
  })
}

/**
 * 节点展开/收起事件 → 重新布局
 */
const onNodeExpand = () => requestAnimationFrame(() => markLeafChildrenRows())
const onNodeCollapse = () => requestAnimationFrame(() => markLeafChildrenRows())

/**
 * 提供给父组件的接口
 */
const getSelectedRules = () => {
  return treeRef.value?.getCheckedKeys() || []
}

defineExpose({
  getSelectedRules
})
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

/* 保持父节点内容对齐 */
.custom-tree .el-tree-node__content {
  display: flex;
  align-items: center;
}
</style>
