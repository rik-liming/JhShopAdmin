<template>
  <div class="p-4">
    <el-tree
      ref="treeRef"
      :key="treeKey"
      :data="privilegeTree"
      show-checkbox
      node-key="id"
      :props="{ children: 'children', label: 'name' }"
      class="border p-3 rounded-md custom-tree"
      @check="onNodeCheck"
      @node-expand="handleNodeChange"
      @node-collapse="handleNodeChange"
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
import { ref, onMounted, nextTick, defineProps, watch, defineExpose } from 'vue'

const props = defineProps<{
  privilegeTree: any[],
  treeKey: number,
  checkedRules: number[],
}>()

const treeRef = ref(null)

// 手动勾选指定节点
function manuallyCheckNodes(tree, ids: number[]) {
  if (!tree || !Array.isArray(ids) || ids.length === 0) return
  ids.forEach(id => {
    try {
      tree.setChecked(id, true, true)
    } catch (e) {
      console.warn('manuallyCheckNodes setChecked failed for id', id, e)
    }
  })
}

// 标记叶子节点的父容器横排
function markLeafChildrenRows() {
  const treeEl = treeRef.value?.$el
  if (!treeEl) return

  treeEl.querySelectorAll('.leaf-children-row').forEach(el => el.classList.remove('leaf-children-row'))

  const nodes = treeEl.querySelectorAll('.el-tree-node')
  nodes.forEach(nodeEl => {
    const childrenContainer = nodeEl.querySelector(':scope > .el-tree-node__children')
    if (!childrenContainer) return

    const childNodes = Array.from(childrenContainer.querySelectorAll(':scope > .el-tree-node'))
    if (childNodes.length === 0) return

    // 只有最终叶子节点的父节点横排：所有子节点都没有子节点
    const allChildrenAreLeaf = childNodes.every(c => {
      const grandChildren = c.querySelector(':scope > .el-tree-node__children')
      if (!grandChildren) return true
      const grandChildNodes = grandChildren.querySelectorAll(':scope > .el-tree-node')
      return grandChildNodes.length === 0
    })

    if (allChildrenAreLeaf) {
      childrenContainer.classList.add('leaf-children-row')
    }
  })
}

const handleNodeChange = async () => {
  await nextTick()
  markLeafChildrenRows()
}

// 节点勾选逻辑
const onNodeCheck = (data, { checkedKeys }) => {
  const tree = treeRef.value
  const node = tree.getNode(data.id)

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

  requestAnimationFrame(() => markLeafChildrenRows())
}

function collectCheckedFromData(treeData) {
  const ret = []
  const dfs = (arr) => {
    if (!Array.isArray(arr)) return
    arr.forEach(n => {
      if (!n) return
      if (n.checked) ret.push(n.id)
      if (n.children && n.children.length) dfs(n.children)
    })
  }
  dfs(treeData)
  return ret
}

// 暴露给父组件的方法
const getSelectedRules = () => {
  // 优先使用数据源来收集（包含父节点）
  const fromData = collectCheckedFromData(props.privilegeTree)
  // 也可以拿 el-tree 的内部 checked 作为双重验证
  const fromTree = treeRef.value?.getCheckedKeys?.() || []
  // 合并去重
  return Array.from(new Set([...fromData, ...fromTree]))
}

defineExpose({
  getSelectedRules
})

onMounted(async () => {
  await nextTick()
  manuallyCheckNodes(treeRef.value, props.checkedRules)
  markLeafChildrenRows()
})

// 监听 checkedRules 更新
watch(() => props.checkedRules, async () => {
  await nextTick()
  manuallyCheckNodes(treeRef.value, props.checkedRules)
  markLeafChildrenRows()
})
</script>

<style scoped>
.border {
  border: 1px solid #e5e7eb;
}

/* 最终叶子节点横排 */
:deep(.leaf-children-row) {
  display: flex !important;
  flex-wrap: wrap;
  gap: 10px;
}

/* 子节点微调 */
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
