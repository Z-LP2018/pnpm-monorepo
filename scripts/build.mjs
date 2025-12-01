#!/usr/bin/env node

/**
 * 构建脚本
 * 用于构建所有或指定的应用/服务
 *
 * 用法:
 *   node scripts/build.mjs              # 构建所有项目
 *   node scripts/build.mjs --app=monitor-platform  # 构建指定应用
 *   node scripts/build.mjs --service=api-gateway   # 构建指定服务
 *   node scripts/build.mjs --package=ui-components # 构建指定包
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const args = process.argv.slice(2)

function parseArgs() {
  const options = {
    app: null,
    service: null,
    package: null,
    all: true,
  }

  args.forEach(arg => {
    if (arg.startsWith('--app=')) {
      options.app = arg.split('=')[1]
      options.all = false
    } else if (arg.startsWith('--service=')) {
      options.service = arg.split('=')[1]
      options.all = false
    } else if (arg.startsWith('--package=')) {
      options.package = arg.split('=')[1]
      options.all = false
    }
  })

  return options
}

function build(options) {
  try {
    console.log('🚀 开始构建...\n')

    if (options.all) {
      console.log('📦 构建所有项目...')
      execSync('pnpm build', {
        cwd: rootDir,
        stdio: 'inherit',
      })
    } else {
      if (options.app) {
        console.log(`📱 构建应用: ${options.app}`)
        execSync('pnpm build', {
          cwd: join(rootDir, 'apps', options.app),
          stdio: 'inherit',
        })
      }
      if (options.service) {
        console.log(`🔧 构建服务: ${options.service}`)
        execSync('pnpm build', {
          cwd: join(rootDir, 'services', options.service),
          stdio: 'inherit',
        })
      }
      if (options.package) {
        console.log(`📦 构建包: ${options.package}`)
        execSync('pnpm build', {
          cwd: join(rootDir, 'packages', options.package),
          stdio: 'inherit',
        })
      }
    }

    console.log('\n✅ 构建完成!')
  } catch (error) {
    console.error('\n❌ 构建失败:', error.message)
    process.exit(1)
  }
}

const options = parseArgs()
build(options)
