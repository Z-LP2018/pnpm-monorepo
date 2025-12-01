<template>
  <div class="route-history-layout flex flex-col overflow-hidden">
    <!-- 历史记录栏 -->
    <div v-if="historyList.length > 0">
      <div class="route-history-header">
        <span class="history-title">浏览历史</span>
        <el-button v-if="showClearButton" text type="danger" size="small" @click="handleClear">
          清空
        </el-button>
      </div>
      <div class="route-history-list">
        <el-tag
          v-for="item in historyList"
          :key="`${item.path}-${item.timestamp}`"
          :closable="closable"
          class="history-tag"
          @close="handleRemove(item.path)"
          @click="handleClick(item)"
        >
          {{ item.title }}
        </el-tag>
      </div>
    </div>
    <!-- 页面内容 -->
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteHistoryItem } from '@/store/modules/history'
import { history_store } from '@/store/modules/history'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  // 显示的历史记录数量
  maxCount?: number
  // 是否显示清空按钮
  showClearButton?: boolean
  // 标签是否可关闭
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 10,
  showClearButton: true,
  closable: true,
})

const router = useRouter()
const historyStore = history_store()

// 获取最近的历史记录
const historyList = computed(() => {
  return historyStore.recentHistory(props.maxCount)
})

// 点击历史记录项
const handleClick = (item: RouteHistoryItem) => {
  router.push({
    path: item.path,
    query: item.query,
  })
}

// 移除指定路径的历史记录
const handleRemove = (path: string) => {
  historyStore.removeHistoryByPath(path)
}

// 清空所有历史记录
const handleClear = () => {
  historyStore.clearHistory()
}
</script>

<style scoped lang="less">
.route-history-layout {
  width: 100%;
  height: 100%;
}
</style>
