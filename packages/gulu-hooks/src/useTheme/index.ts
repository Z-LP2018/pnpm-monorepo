import type { GuluThemeHooks } from '@gulu/types'
export const parseRgb: GuluThemeHooks.parseRgb = color => {
  // 移除空格
  color = color.trim()

  // 匹配 "r, g, b" 格式（三个数字，用逗号分隔）
  const rgbMatch = color.match(/^(\d+)[,\s]+(\d+)[,\s]+(\d+)$/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1] || '0', 10)
    const g = parseInt(rgbMatch[2] || '0', 10)
    const b = parseInt(rgbMatch[3] || '0', 10)

    // 验证范围 (0-255)
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      return { r, g, b }
    }
  }

  return null
}
