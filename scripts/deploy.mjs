#!/usr/bin/env node

/**
 * 部署脚本
 * 用于部署应用到不同环境
 *
 * 用法:
 *   node scripts/deploy.mjs --env=dev      # 部署到开发环境
 *   node scripts/deploy.mjs --env=prod     # 部署到生产环境
 *   node scripts/deploy.mjs --env=prod --service=api-gateway  # 部署指定服务
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
    env: 'dev',
    service: null,
    app: null,
  }

  args.forEach(arg => {
    if (arg.startsWith('--env=')) {
      options.env = arg.split('=')[1]
    } else if (arg.startsWith('--service=')) {
      options.service = arg.split('=')[1]
    } else if (arg.startsWith('--app=')) {
      options.app = arg.split('=')[1]
    }
  })

  return options
}

function deploy(options) {
  try {
    console.log(`🚀 开始部署到 ${options.env} 环境...\n`)

    // 构建项目
    console.log('📦 构建项目...')
    execSync('pnpm build', {
      cwd: rootDir,
      stdio: 'inherit',
    })

    // 根据环境选择 Docker Compose 文件
    const composeFile = options.env === 'prod' ? 'docker-compose.prod.yml' : 'docker-compose.yml'

    if (options.service) {
      console.log(`🔧 部署服务: ${options.service}`)
      execSync(`docker-compose -f ${composeFile} up -d --build ${options.service}`, {
        cwd: rootDir,
        stdio: 'inherit',
      })
    } else if (options.app) {
      console.log(`📱 部署应用: ${options.app}`)
      // 前端应用可能需要不同的部署方式（如 Nginx、CDN 等）
      console.log('⚠️  前端应用部署需要根据实际情况配置')
    } else {
      console.log(`🐳 使用 Docker Compose 部署所有服务...`)
      execSync(`docker-compose -f ${composeFile} up -d --build`, {
        cwd: rootDir,
        stdio: 'inherit',
      })
    }

    console.log(`\n✅ 部署到 ${options.env} 环境完成!`)
  } catch (error) {
    console.error(`\n❌ 部署失败:`, error.message)
    process.exit(1)
  }
}

const options = parseArgs()

if (!['dev', 'staging', 'prod'].includes(options.env)) {
  console.error('❌ 无效的环境，请使用: dev, staging, prod')
  process.exit(1)
}

deploy(options)
