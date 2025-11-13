<template>
  <div class="tree-container">
    <TreeNode
      v-for="node in privilegeTree"
      :key="node.id"
      :node="node"
      @update-checked="updateChecked"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  privilegeTree: any[]
}>()

const updateChecked = () => {
  // 父组件可在这里拿到最新勾选状态
}
</script>

<style scoped>
.tree-container {
  font-family: Arial, sans-serif;
  font-size: 14px;
}
</style>

<!-- TreeNode.vue -->
<template>
  <div>
    <div
      class="node-row"
      :class="{ checked: node.checked }"
      @click="onRowClick"
    >
      <input
        type="checkbox"
        v-model="node.checked"
        @click.stop="onCheck"
      />
      <span class="node-text" @click.stop="onCheck">{{ node.name }}</span>
    </div>
    <div
      v-if="node.children?.length && node.expanded"
      class="children-container"
      :class="{ 'leaf-children-row': isLeafChildren }"
    >
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @update-checked="$emit('update-checked')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  node: any
}>()
const emit = defineEmits(['update-checked'])

const isLeafChildren = computed(() => {
  // 子节点都没有孩子，则是叶子节点容器
  return (
    props.node.children?.length &&
    props.node.children.every((c: any) => !c.children || c.children.length === 0)
  )
})

const onCheck = () => {
  props.node.checked = !props.node.checked
  setChildren(props.node, props.node.checked)
  emit('update-checked')
}

const onRowClick = () => {
  // 点击整行：展开/收起 + 勾选
  if (props.node.children?.length) {
    props.node.expanded = !props.node.expanded
  }
  props.node.checked = !props.node.checked
  setChildren(props.node, props.node.checked)
  emit('update-checked')
}

const setChildren = (node: any, checked: boolean) => {
  if (!node.children) return
  node.children.forEach((c: any) => {
    c.checked = checked
    setChildren(c, checked)
  })
}
</script>

<style scoped>
.node-row {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
}

.node-row.checked {
  background-color: #e6f7ff;
}

.node-text {
  margin-left: 4px;
}

.children-container {
  margin-left: 16px;
}

/* 横排叶子容器 */
.leaf-children-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 横排子节点样式 */
.leaf-children-row > div {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
}
</style>
