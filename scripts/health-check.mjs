#!/usr/bin/env node

/**
 * 健康检查脚本
 * 用于检查服务是否正常运行
 *
 * 用法:
 *   node scripts/health-check.mjs                    # 检查所有服务
 *   node scripts/health-check.mjs --service=api-gateway  # 检查指定服务
 *   node scripts/health-check.mjs --port=3000        # 检查指定端口
 */

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = process.argv.slice(2)

// 服务配置
const SERVICES = {
  'api-gateway': { port: 3000, name: 'API Gateway' },
  'file-service': { port: 3001, name: 'File Service' },
  'message-service': { port: 3002, name: 'Message Service' },
}

function parseArgs() {
  const options = {
    service: null,
    port: null,
    host: 'localhost',
    timeout: 5000,
  }

  args.forEach(arg => {
    if (arg.startsWith('--service=')) {
      options.service = arg.split('=')[1]
    } else if (arg.startsWith('--port=')) {
      options.port = parseInt(arg.split('=')[1])
    } else if (arg.startsWith('--host=')) {
      options.host = arg.split('=')[1]
    } else if (arg.startsWith('--timeout=')) {
      options.timeout = parseInt(arg.split('=')[1])
    }
  })

  return options
}

async function checkHealth(serviceName, port, host, timeout) {
  const url = `http://${host}:${port}/health`

  try {
    console.log(`🔍 检查 ${serviceName} (${url})...`)

    // 使用 Node.js 内置模块检查健康状态
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(timeout),
    })

    if (response.ok) {
      console.log(`✅ ${serviceName} 健康检查通过 (HTTP ${response.status})`)
      return true
    } else {
      console.log(`❌ ${serviceName} 健康检查失败 (HTTP ${response.status})`)
      return false
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`❌ ${serviceName} 健康检查超时`)
    } else {
      console.log(`❌ ${serviceName} 健康检查失败: ${error.message}`)
    }
    return false
  }
}

async function checkDatabase(host = 'localhost') {
  console.log('\n📊 检查数据库连接...')

  const checks = [
    { name: 'PostgreSQL', port: 5432 },
    { name: 'Redis', port: 6379 },
    { name: 'MongoDB', port: 27017 },
  ]

  let allHealthy = true

  for (const db of checks) {
    try {
      // 使用 Node.js 内置模块检查端口
      const net = await import('net')
      const socket = new net.Socket()

      const isOpen = await new Promise(resolve => {
        const timeout = setTimeout(() => {
          socket.destroy()
          resolve(false)
        }, 2000)

        socket.on('connect', () => {
          clearTimeout(timeout)
          socket.destroy()
          resolve(true)
        })

        socket.on('error', () => {
          clearTimeout(timeout)
          resolve(false)
        })

        socket.connect(db.port, host)
      })

      if (isOpen) {
        console.log(`✅ ${db.name} 连接正常`)
      } else {
        console.log(`⚠️  ${db.name} 连接失败`)
        allHealthy = false
      }
    } catch (error) {
      console.log(`⚠️  ${db.name} 检查失败: ${error.message}`)
      allHealthy = false
    }
  }

  return allHealthy
}

async function main() {
  const options = parseArgs()

  console.log('🏥 开始健康检查...\n')

  let allHealthy = true

  if (options.service) {
    // 检查指定服务
    const service = SERVICES[options.service]
    if (!service) {
      console.error(`❌ 未知服务: ${options.service}`)
      process.exit(1)
    }

    const healthy = await checkHealth(
      service.name,
      options.port || service.port,
      options.host,
      options.timeout
    )
    allHealthy = healthy
  } else if (options.port) {
    // 检查指定端口
    const healthy = await checkHealth(
      `服务 (端口 ${options.port})`,
      options.port,
      options.host,
      options.timeout
    )
    allHealthy = healthy
  } else {
    // 检查所有服务
    for (const [key, service] of Object.entries(SERVICES)) {
      const healthy = await checkHealth(service.name, service.port, options.host, options.timeout)
      if (!healthy) {
        allHealthy = false
      }
    }

    // 检查数据库
    const dbHealthy = await checkDatabase(options.host)
    if (!dbHealthy) {
      allHealthy = false
    }
  }

  console.log('\n' + '='.repeat(50))
  if (allHealthy) {
    console.log('✅ 所有健康检查通过')
    process.exit(0)
  } else {
    console.log('❌ 部分健康检查失败')
    process.exit(1)
  }
}

main().catch(error => {
  console.error('❌ 健康检查脚本执行失败:', error)
  process.exit(1)
})
