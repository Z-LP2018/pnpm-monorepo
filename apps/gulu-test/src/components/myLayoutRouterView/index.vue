<template>
  <template v-if="layout">
    <component :is="layout">
      <router-view />
    </component>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>

<script setup lang="ts">
// 自动导入所有布局组件（通过 Vite 插件自动生成）
import { layoutComponents } from 'virtual:auto-layouts'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const layout = computed(() => {
  if (!route.meta?.layout) {
    return null
  } else {
    return layoutComponents[route.meta.layout as string]
  }
})
</script>
