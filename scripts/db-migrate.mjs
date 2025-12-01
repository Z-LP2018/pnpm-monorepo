#!/usr/bin/env node

/**
 * 数据库迁移脚本
 * 用于执行数据库迁移操作
 *
 * 用法:
 *   node scripts/db-migrate.mjs --service=user-service --action=up      # 执行迁移
 *   node scripts/db-migrate.mjs --service=user-service --action=down    # 回滚迁移
 *   node scripts/db-migrate.mjs --service=user-service --action=status  # 查看迁移状态
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
    service: null,
    action: 'up', // up, down, status, create
    name: null,
  }

  args.forEach(arg => {
    if (arg.startsWith('--service=')) {
      options.service = arg.split('=')[1]
    } else if (arg.startsWith('--action=')) {
      options.action = arg.split('=')[1]
    } else if (arg.startsWith('--name=')) {
      options.name = arg.split('=')[1]
    }
  })

  return options
}

function migrate(options) {
  try {
    if (!options.service) {
      console.error('❌ 请指定服务名称: --service=<service-name>')
      process.exit(1)
    }

    const servicePath = join(rootDir, 'services', options.service)

    console.log(`🗄️  数据库迁移 - 服务: ${options.service}, 操作: ${options.action}\n`)

    switch (options.action) {
      case 'up':
        console.log('⬆️  执行迁移...')
        // 假设使用 Prisma
        execSync('pnpm prisma migrate deploy', {
          cwd: servicePath,
          stdio: 'inherit',
        })
        break

      case 'down':
        console.log('⬇️  回滚迁移...')
        console.log('⚠️  回滚操作需要根据使用的 ORM 工具调整')
        break

      case 'status':
        console.log('📊 查看迁移状态...')
        execSync('pnpm prisma migrate status', {
          cwd: servicePath,
          stdio: 'inherit',
        })
        break

      case 'create':
        if (!options.name) {
          console.error('❌ 创建迁移需要指定名称: --name=<migration-name>')
          process.exit(1)
        }
        console.log(`➕ 创建迁移: ${options.name}`)
        execSync(`pnpm prisma migrate dev --name ${options.name}`, {
          cwd: servicePath,
          stdio: 'inherit',
        })
        break

      default:
        console.error(`❌ 无效的操作: ${options.action}`)
        console.log('可用操作: up, down, status, create')
        process.exit(1)
    }

    console.log('\n✅ 迁移操作完成!')
  } catch (error) {
    console.error('\n❌ 迁移失败:', error.message)
    process.exit(1)
  }
}

const options = parseArgs()
migrate(options)
