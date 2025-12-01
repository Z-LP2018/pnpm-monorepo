import { defineStore } from 'pinia'
// 用户
const userInfo_store = defineStore('userInfo_store', {
  state: () => {
    return {
      token: '',
      refreshToken: '',
      storeUserInfo: {} as any,
    }
  },
  getters: {
    // 判断是否已登录（双 token 机制）
    // 只要有 refreshToken 就认为可以登录（因为可以刷新 accessToken）
    isLoggedIn: state => !!(state.token || state.refreshToken),
  },
  actions: {
    // 设置 token
    setToken(token: string, refreshToken: string) {
      this.token = token
      this.refreshToken = refreshToken
    },
    // 更新 access token（刷新时使用）
    updateToken(token: string) {
      this.token = token
    },
    // 清除 token（退出登录）
    clearToken() {
      this.token = ''
      this.refreshToken = ''
      this.storeUserInfo = {}
    },
    // 设置用户信息
    setUserInfo(userInfo: any) {
      this.storeUserInfo = userInfo
    },
  },
  // 只对 userInfo store 启用持久化
  persist: {
    storage: localStorage,
  },
})
export { userInfo_store }
