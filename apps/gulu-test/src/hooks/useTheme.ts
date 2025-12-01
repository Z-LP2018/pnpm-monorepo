import { ref } from 'vue'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'app-theme'

// 默认主题
const defaultTheme: Theme = 'dark'

// 当前主题状态
const currentTheme = ref<Theme>(defaultTheme)

// 设置主题
function setTheme(theme: Theme) {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

// 初始化主题（可在外部调用）
export function initTheme() {
  // 监听系统主题变化
  const match = matchMedia('(prefers-color-scheme:dark)')
  match.addEventListener('change', e => {
    if (e.matches) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  })

  // 从 localStorage 读取
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  // 如果有保存的主题
  if (savedTheme) {
    setTheme(savedTheme)
  }
  // 如果没有保存的主题，则根据系统主题设置
  else {
    if (match.matches) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }
}

export function useTheme() {
  // 切换主题
  const toggleTheme = () => {
    const newTheme: Theme = currentTheme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return {
    currentTheme,
    setTheme,
    toggleTheme,
  }
}
