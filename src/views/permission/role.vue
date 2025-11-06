<template>
  <div class="p-4">
    <h2 class="mb-2 text-lg font-bold">角色权限分配 - {{ roleName }}</h2>

    <el-tree
      ref="treeRef"
      :data="treeData"
      show-checkbox
      node-key="id"
      :props="{ children: 'children', label: 'name' }"
      class="border p-3 rounded-md custom-tree"
      @check="onNodeCheck"
    >
      <template #default="{ node, data }">
        <div class="node-content-wrapper">
          {{ data.name }}
        </div>
      </template>
    </el-tree>

    <div class="mt-4 text-right">
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as PrivilegeApi from '@/api/privilege'
import * as RoleApi from '@/api/role'
import store from '@/store'

const adminStore = store.admin()

const role = 'admin'
const roleName = '管理员'

const treeRef = ref(null)
const treeData = ref([])

// 已勾选ID
const checkedKeys = ref([])

let mo = null // MutationObserver instance

onMounted(async () => {
  const treeResp = await PrivilegeApi.getPrivilegesTree(adminStore.adminLoginToken)
  const { tree } = treeResp.data.data

  const roleRulesResp = await RoleApi.getRoleRules(adminStore.adminLoginToken, role)
  const { rules: checked } = roleRulesResp.data.data
  const routerKeysResp = await RoleApi.getRoleRouterKeys(adminStore.adminLoginToken)
  console.log(routerKeysResp.data.data)
  treeData.value = tree
  checkedKeys.value = checked

  await nextTick()
  manuallyCheckNodes(treeRef.value, checked)

  // 初次标记叶子容器
  await nextTick()
  markLeafChildrenRows()

  // 监听树 DOM 变动（展开/收起/异步加载等），变化时重新标记
  const treeEl = treeRef.value?.$el || treeRef.value
  if (treeEl) {
    mo = new MutationObserver(() => {
      // 用 requestAnimationFrame / nextTick 做一次防抖
      requestAnimationFrame(() => {
        markLeafChildrenRows()
      })
    })
    mo.observe(treeEl, { childList: true, subtree: true, attributes: true })
  }
})

onBeforeUnmount(() => {
  if (mo) {
    mo.disconnect()
    mo = null
  }
})

// 手动设置选中项（仅勾选指定 ID，不触发级联）
function manuallyCheckNodes(tree, ids) {
  if (!tree || !Array.isArray(ids)) return
  ids.forEach(id => {
    const node = tree.getNode(id)
    if (node) {
      node.checked = true
    }
  })
}

// 标记那些其子节点都是叶子的父节点的 children 容器，添加类名 .leaf-children-row
function markLeafChildrenRows() {
  // 清除旧样式
  const treeEl = treeRef.value?.$el
  if (!treeEl) return

  // 移除之前添加的类
  treeEl.querySelectorAll('.leaf-children-row').forEach(el => {
    el.classList.remove('leaf-children-row')
  })

  // 遍历所有 el-tree-node 元素
  const nodes = treeEl.querySelectorAll('.el-tree-node')
  nodes.forEach(nodeEl => {
    const childrenContainer = nodeEl.querySelector(':scope > .el-tree-node__children')
    if (!childrenContainer) return

    // 获取直接子项（.el-tree-node）
    const childNodes = Array.from(childrenContainer.querySelectorAll(':scope > .el-tree-node'))

    // 如果没有子项，跳过
    if (childNodes.length === 0) return

    // 判断这些直接子项是否全都是“叶子”（即它们内部没有 .el-tree-node__children 或子容器为空）
    const allChildrenAreLeaf = childNodes.every(childEl => {
      const grandChildren = childEl.querySelector(':scope > .el-tree-node__children')
      // 如果不存在子容器，或子容器中没有 .el-tree-node，说明是叶子
      if (!grandChildren) return true
      const gc = grandChildren.querySelectorAll(':scope > .el-tree-node')
      return gc.length === 0
    })

    // 如果直系子项全部为叶子，则把 childrenContainer 标记为横向排列
    if (allChildrenAreLeaf) {
      childrenContainer.classList.add('leaf-children-row')
    }
  })
}

// onNodeCheck, onSave, 手动选中等
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

  // 树结构没变，但展开/收起可能改变布局，延迟重新标记
  requestAnimationFrame(() => {
    markLeafChildrenRows()
  })
}

const onSave = async () => {
  const selected = treeRef.value.getCheckedKeys()
  await RoleApi.updateRoleRules(adminStore.adminLoginToken, { role, ruleIds: selected })
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.border {
  border: 1px solid #e5e7eb;
}

/* 横排叶子集合的样式：在这里控制排列与间距 */
:deep(.leaf-children-row) {
  display: flex !important;
  flex-wrap: wrap;
  gap: 10px;
  /* 让子节点项在一行显示 */
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
