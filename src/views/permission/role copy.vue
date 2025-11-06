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
    />

    <div class="mt-4 text-right">
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as PrivilegeApi from '@/api/privilege'
import * as RoleApi from '@/api/role'

const role = 'admin'
const roleName = '管理员'

const treeRef = ref()
const treeData = ref([])

// 后端返回的已勾选ID
const checkedKeys = ref([])

onMounted(async () => {
  const { data: tree } = await PrivilegeApi.getPrivilegesTree()
  const { data: checked } = await RoleApi.getRoleRules('', role)
  treeData.value = tree
  checkedKeys.value = checked

  // 等待节点渲染完后，手动设置选中项（防止级联全选）
  await nextTick()
  manuallyCheckNodes(treeRef.value, checked)
})

// 手动设置选中项（仅勾选指定 ID，不触发级联）
function manuallyCheckNodes(tree, ids) {
  if (!tree || !Array.isArray(ids)) return
  ids.forEach(id => {
    const node = tree.getNode(id)
    if (node) {
      node.checked = true // 直接设置状态，不触发递归
    }
  })
}

/**
 * 选中或取消选中节点时触发
 */
const onNodeCheck = (data, { checkedKeys }) => {
  const tree = treeRef.value
  const node = tree.getNode(data.id)

  // 勾选子节点 → 自动勾选父节点
  if (node.checked) {
    let parent = node.parent
    while (parent && parent.level > 0) {
      tree.setChecked(parent.data.id, true, false)
      parent = parent.parent
    }
  } else {
    // 取消父节点 → 取消所有子节点
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
}

/**
 * 保存角色权限
 */
const onSave = async () => {
  const selected = treeRef.value.getCheckedKeys()
  await RoleApi.updateRoleRules('', role, { ruleIds: selected })
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.border {
  border: 1px solid #e5e7eb;
}

custom-tree .el-tree-node:has(.el-tree-node__children:empty) {
  display: inline-flex;
}
.custom-tree .el-tree-node__children:not(:empty) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
