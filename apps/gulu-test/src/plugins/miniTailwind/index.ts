import type { Plugin, ViteDevServer } from 'vite'
import { generateCss } from './engine'

// 虚拟css文件
const virtualId = 'virtual:mini-tailwind.css'
const resolvedVirtualId = '\0' + virtualId
const classRegex = /class=["'`]([^"'`]+)["'`]/g
const classNames = new Set<string>()

export function miniTailwindPlugin(): Plugin {
  // vite开发服务器实例（ViteDevServer）
  let server: ViteDevServer | undefined

  return {
    name: 'mini-tailwind',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
    },

    transform(code, id) {
      if (!/\.(vue|jsx|tsx|svelte)$/.test(id)) return
      const before = classNames.size
      classRegex.lastIndex = 0 // 重置正则状态
      let match
      while ((match = classRegex.exec(code)) !== null) {
        if (match[1]) {
          match[1].split(/\s+/).forEach(c => c.trim() && classNames.add(c.trim()))
        }
      }

      // 有新增 class 时，触发虚拟模块更新
      if (classNames.size > before) {
        const mod = server?.moduleGraph.getModuleById(resolvedVirtualId)
        if (mod) {
          server?.moduleGraph.invalidateModule(mod)
          server?.ws.send({
            type: 'full-reload',
          })
        }
      }
    },

    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId
    },

    load(id) {
      if (id === resolvedVirtualId) {
        return generateCss([...classNames])
      }
    },
  }
}
