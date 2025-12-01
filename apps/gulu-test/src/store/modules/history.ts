import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

// 路由历史记录项
export interface RouteHistoryItem {
  path: string
  name?: string | symbol
  fullPath: string
  meta?: Record<string, any>
  title?: string
  timestamp: number
  query?: Record<string, any>
  params?: Record<string, any>
}

const MAX_MEMORY_HISTORY = 50 // 内存中保留的最大历史记录数
const MAX_STORAGE_HISTORY = 200 // localStorage 中保留的最大历史记录数

const history_store = defineStore('history_store', {
  state: () => {
    return {
      // 内存中的历史记录（最近访问的，用于快速访问）
      memoryHistory: [] as RouteHistoryItem[],
      // 是否启用持久化
      enablePersistence: true,
    }
  },

  getters: {
    // 获取所有历史记录（从内存）
    allHistory: state => state.memoryHistory,
    // 获取最近 N 条历史记录
    recentHistory: state => {
      const func = (count: number = 10) => {
        return state.memoryHistory.slice(-count).reverse()
      }
      return func
    },
    // 根据路径查找历史记录
    findHistoryByPath: state => {
      const func = (path: string) => {
        return state.memoryHistory.find(item => item.path === path)
      }
      return func
    },
  },

  actions: {
    // 添加路由历史记录
    addHistory(route: RouteLocationNormalized) {
      const historyItem: RouteHistoryItem = {
        path: route.path,
        name: route.name,
        fullPath: route.fullPath,
        meta: route.meta,
        title: (route.meta?.title as string) || route.name?.toString() || route.path,
        timestamp: Date.now(),
        query: route.query,
        params: route.params,
      }

      // 避免重复添加相同的路由（如果路径和查询参数都相同）
      const lastHistory = this.memoryHistory[this.memoryHistory.length - 1]
      if (
        lastHistory &&
        lastHistory.path === historyItem.path &&
        JSON.stringify(lastHistory.query) === JSON.stringify(historyItem.query)
      ) {
        return
      }

      // 添加到内存历史记录
      this.memoryHistory.push(historyItem)

      // 限制内存中的历史记录数量
      if (this.memoryHistory.length > MAX_MEMORY_HISTORY) {
        this.memoryHistory.shift()
      }

      // 如果启用持久化，保存到 localStorage
      if (this.enablePersistence) {
        this.saveToStorage()
      }
    },

    // 从 localStorage 加载历史记录
    loadFromStorage() {
      try {
        const stored = localStorage.getItem('route_history')
        if (stored) {
          const parsed = JSON.parse(stored) as RouteHistoryItem[]
          // 只保留最近 N 条
          const recent = parsed.slice(-MAX_STORAGE_HISTORY)
          // 合并到内存历史记录（去重）
          recent.forEach(item => {
            const exists = this.memoryHistory.find(
              h => h.path === item.path && h.timestamp === item.timestamp
            )
            if (!exists) {
              this.memoryHistory.push(item)
            }
          })
          // 排序并限制数量
          this.memoryHistory.sort((a, b) => a.timestamp - b.timestamp)
          if (this.memoryHistory.length > MAX_MEMORY_HISTORY) {
            this.memoryHistory = this.memoryHistory.slice(-MAX_MEMORY_HISTORY)
          }
        }
      } catch (error) {
        console.error('加载路由历史记录失败:', error)
      }
    },

    // 保存到 localStorage
    saveToStorage() {
      try {
        // 获取所有历史记录（包括内存中的）
        let allHistory = [...this.memoryHistory]

        // 尝试从 localStorage 读取已有记录
        const stored = localStorage.getItem('route_history')
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as RouteHistoryItem[]
            // 合并并去重
            parsed.forEach(item => {
              const exists = allHistory.find(
                h => h.path === item.path && h.timestamp === item.timestamp
              )
              if (!exists) {
                allHistory.push(item)
              }
            })
          } catch {
            // 忽略解析错误
          }
        }

        // 按时间排序
        allHistory.sort((a, b) => a.timestamp - b.timestamp)

        // 只保留最近 N 条
        const recent = allHistory.slice(-MAX_STORAGE_HISTORY)

        // 保存到 localStorage
        localStorage.setItem('route_history', JSON.stringify(recent))
      } catch (error) {
        console.error('保存路由历史记录失败:', error)
      }
    },

    // 清除历史记录
    clearHistory() {
      this.memoryHistory = []
      if (this.enablePersistence) {
        localStorage.removeItem('route_history')
      }
    },

    // 删除指定路径的历史记录
    removeHistoryByPath(path: string) {
      this.memoryHistory = this.memoryHistory.filter(item => item.path !== path)
      if (this.enablePersistence) {
        this.saveToStorage()
      }
    },

    // 初始化（从 localStorage 加载）
    init() {
      if (this.enablePersistence) {
        this.loadFromStorage()
      }
    },
  },
})

export { history_store }
