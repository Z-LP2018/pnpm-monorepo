import { readdirSync, statSync } from 'fs'
import { extname, join, relative } from 'path'
import type { Plugin } from 'vite'

const virtualModuleId = 'virtual:auto-layouts'
const resolvedVirtualModuleId = '\0' + virtualModuleId
/**
 * 自动扫描布局目录并生成布局映射的 Vite 插件
 * 类似 Next.js 的约定式布局系统
 */
export function autoLayoutsPlugin(): Plugin {
  const layoutsDir = join(process.cwd(), 'src/layouts')
  return {
    name: 'auto-layouts',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return null
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        // 扫描布局目录
        const layouts = scanLayouts(layoutsDir)
        // 生成布局映射代码
        const imports: string[] = []
        const mappings: string[] = []

        layouts.forEach(({ name, path }) => {
          const importName = `Layout${name.charAt(0).toUpperCase() + name.slice(1)}`
          imports.push(`import ${importName} from '${path}'`)
          mappings.push(`  ${name}: ${importName},`)
        })

        return `
              ${imports.join('\n')}

              export const layoutComponents = {
              ${mappings.join('\n')}
              }

              export const layoutNames = ${JSON.stringify(
                layouts.map(l => l.name),
                null,
                2
              )}
              `
      }
      return null
    },
  }
}

interface LayoutInfo {
  name: string
  path: string
}

//递归扫描布局目录
function scanLayouts(dir: string): LayoutInfo[] {
  const layouts: LayoutInfo[] = []

  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
    return layouts
  }

  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    const relativePath = relative(process.cwd(), fullPath)
    if (entry.isDirectory()) {
      // 如果是目录，查找 index.vue 或 index.tsx
      const indexPath = join(fullPath, 'index.vue')
      const indexTsxPath = join(fullPath, 'index.tsx')
      if (statSync(indexPath, { throwIfNoEntry: false })?.isFile()) {
        const name = entry.name
        layouts.push({
          name,
          path: `/${relativePath.replace(/\\/g, '/')}/index.vue`,
        })
      } else if (statSync(indexTsxPath, { throwIfNoEntry: false })?.isFile()) {
        const name = entry.name
        layouts.push({
          name,
          path: `/${relativePath.replace(/\\/g, '/')}/index.tsx`,
        })
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name)
      if (ext === '.vue' || ext === '.tsx') {
        const name = entry.name.replace(/\.(vue|tsx)$/, '')
        layouts.push({
          name,
          path: `/${relativePath.replace(/\\/g, '/')}`,
        })
      }
    }
  }
  return layouts
}
