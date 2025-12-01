import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
const pinia = createPinia()
// 注册持久化插件，但不设置全局默认配置
// 这样只有明确配置了 persist 的 store 才会持久化
pinia.use(createPersistedState())
export { pinia }
