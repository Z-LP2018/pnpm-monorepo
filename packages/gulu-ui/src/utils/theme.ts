import { parseRgb } from '@gulu/hooks'
import type { GuluThemeHooks } from '@gulu/types'
type ThemeColors = GuluThemeHooks.ThemeColors
/**
 * 设置主题色
 * @param colors 主题色配置对象，颜色值为 RGB 格式（三个数字，用逗号分隔）
 * @param target 目标元素，默认为 document.documentElement
 * @example
 * ```typescript
 * import { setTheme } from '@gulu/ui'
 *
 * // 设置主色调（RGB 格式：三个数字，用逗号分隔）
 * setTheme({ primary: '64, 158, 255' })
 *
 * // 设置多个颜色
 * setTheme({
 *   primary: '64, 158, 255',
 *   success: '34, 197, 94',
 *   warning: '251, 146, 60',
 *   danger: '239, 68, 68',
 * })
 * ```
 */
export function setTheme(
  colors: ThemeColors,
  target: HTMLElement = document.documentElement
): void {
  Object.entries(colors).forEach(([key, value]) => {
    if (!value) return

    const rgb = parseRgb(value)
    if (!rgb) {
      console.warn(
        `[GuluUI] 无法解析颜色值: ${value}，请使用 RGB 格式（三个数字，用逗号分隔），如 "64, 158, 255"`
      )
      return
    }

    // 设置 RGB 值（用于 rgba 透明度场景）
    target.style.setProperty(`--gulu-${key}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`)
  })
}

/**
 * 获取当前主题色
 * @param colorKey 颜色键名，如 'primary'
 * @param target 目标元素，默认为 document.documentElement
 * @returns RGB 格式的颜色值，如 "64, 158, 255"
 */
export function getTheme(
  colorKey: keyof ThemeColors,
  target: HTMLElement = document.documentElement
): string | null {
  const value = getComputedStyle(target).getPropertyValue(`--gulu-${colorKey}-rgb`).trim()
  return value || null
}

/**
 * 重置主题色为默认值
 * @param target 目标元素，默认为 document.documentElement
 */
export function resetTheme(target: HTMLElement = document.documentElement): void {
  // 移除所有自定义主题色变量
  const colorKeys: (keyof ThemeColors)[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
  ]
  colorKeys.forEach(key => {
    target.style.removeProperty(`--gulu-${key}`)
    target.style.removeProperty(`--gulu-${key}-rgb`)
  })
}
