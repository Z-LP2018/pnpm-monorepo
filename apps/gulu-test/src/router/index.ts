import { history_store } from '@/store/modules/history'
import NProgress from 'nprogress'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 标志位：是否已初始化历史记录 store
let historyStoreInitialized = false
// 登录页白名单
const loginPath = '/login'
//判断是否已登录(如果两个都不存在 → 未登录)
function isAuthenticated(): boolean {
  // 从 localStorage 读取 token（与 useRequest 保持一致）
  const accessToken = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')
  // 只要有 refreshToken 就认为可以登录（因为可以刷新 accessToken）
  return !!(accessToken || refreshToken)
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // 在路由守卫中获取 store 实例（确保 pinia 已注册）
  const historyStore = history_store()

  // 初始化历史记录 store（只初始化一次）
  if (!historyStoreInitialized) {
    historyStore.init()
    historyStoreInitialized = true
  }

  // 添加路由历史记录（排除重复路由）
  if (from.path !== to.path || from.fullPath !== to.fullPath) {
    historyStore.addHistory(to)
  }

  // 判断是否已登录（双 token 机制）
  const isLoggedIn = isAuthenticated()
  if (isLoggedIn) {
    // 已登录
    if (to.path === loginPath) {
      // 已登录访问登录页，重定向到首页
      next('/home')
    } else {
      // 访问其他页面，直接通过
      next()
    }
  } else {
    // 未登录
    if (to.path === loginPath) {
      // 访问登录页，直接通过
      next()
    } else {
      // 检查路由是否需要登录（通过 meta.requiresAuth）
      const requiresAuth = to.matched.some(record => {
        const requiresPermission = record.meta && record.meta.requiresAuth
        return requiresPermission
      })
      if (requiresAuth) {
        // 需要登录的页面，重定向到登录页 & 保存目标路径，登录后可以跳转回来
        next({
          path: loginPath,
          query: { redirect: to.fullPath },
        })
      } else {
        next()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export { router }
