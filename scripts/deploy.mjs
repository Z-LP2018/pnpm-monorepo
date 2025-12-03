#!/usr/bin/env node

import { execSync } from 'child_process'
import { argv } from 'process'

const env = argv[2] || 'staging'
const service = argv[3]

const exec = cmd => {
  console.log(`> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

// 构建
if (service) {
  exec(`pnpm turbo run build --filter=@services/${service}`)
  exec(`docker build -f services/${service}/Dockerfile -t ${service}:latest .`)
  exec(`kubectl set image deployment/${service} ${service}=${service}:latest -n ${env}`)
} else {
  // 部署所有服务
  const services = ['api-gateway', 'user-service', 'monitor-service']
  services.forEach(svc => {
    exec(`pnpm turbo run build --filter=@services/${svc}`)
    exec(`docker build -f services/${svc}/Dockerfile -t ${svc}:latest .`)
    exec(`kubectl set image deployment/${svc} ${svc}=${svc}:latest -n ${env}`)
  })
}
