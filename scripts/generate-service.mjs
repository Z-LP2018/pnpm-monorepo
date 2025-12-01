#!/usr/bin/env node

/**
 * 生成微服务模板脚本
 * 用于快速创建新的 Nest.js 微服务项目
 *
 * 用法:
 *   node scripts/generate-service.mjs --name=order-service
 *   node scripts/generate-service.mjs --name=payment-service --type=rest
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const args = process.argv.slice(2)

function parseArgs() {
  const options = {
    name: null,
    type: 'rest', // rest, graphql, microservice
  }

  args.forEach(arg => {
    if (arg.startsWith('--name=')) {
      options.name = arg.split('=')[1]
    } else if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1]
    }
  })

  return options
}

function generateService(options) {
  try {
    if (!options.name) {
      console.error('❌ 请指定服务名称: --name=<service-name>')
      process.exit(1)
    }

    const servicePath = join(rootDir, 'services', options.name)

    if (existsSync(servicePath)) {
      console.error(`❌ 服务 ${options.name} 已存在`)
      process.exit(1)
    }

    console.log(`🚀 生成微服务: ${options.name} (类型: ${options.type})\n`)

    // 创建目录结构
    mkdirSync(servicePath, { recursive: true })
    mkdirSync(join(servicePath, 'src'), { recursive: true })
    mkdirSync(join(servicePath, 'src', 'modules'), { recursive: true })
    mkdirSync(join(servicePath, 'prisma'), { recursive: true })
    mkdirSync(join(servicePath, 'test'), { recursive: true })

    // 生成 package.json
    const packageJson = {
      name: `@gu-lu-gu-lu/${options.name}`,
      version: '1.0.0',
      description: `${options.name} microservice`,
      main: 'dist/main.js',
      scripts: {
        build: 'nest build',
        format: 'prettier --write "src/**/*.ts" "test/**/*.ts"',
        start: 'nest start',
        'start:dev': 'nest start --watch',
        'start:debug': 'nest start --debug --watch',
        'start:prod': 'node dist/main',
        lint: 'eslint "{src,apps,libs,test}/**/*.ts" --fix',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:cov': 'jest --coverage',
        'test:debug':
          'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
        'test:e2e': 'jest --config ./test/jest-e2e.json',
        'prisma:generate': 'prisma generate',
        'prisma:migrate': 'prisma migrate dev',
        'prisma:studio': 'prisma studio',
      },
      dependencies: {
        '@nestjs/common': '^10.0.0',
        '@nestjs/core': '^10.0.0',
        '@nestjs/platform-express': '^10.0.0',
        '@prisma/client': '^5.0.0',
        'reflect-metadata': '^0.1.13',
        rxjs: '^7.8.1',
      },
      devDependencies: {
        '@nestjs/cli': '^10.0.0',
        '@nestjs/schematics': '^10.0.0',
        '@nestjs/testing': '^10.0.0',
        '@types/express': '^4.17.17',
        '@types/jest': '^29.5.2',
        '@types/node': '^20.3.1',
        '@types/supertest': '^2.0.12',
        '@typescript-eslint/eslint-plugin': '^6.0.0',
        '@typescript-eslint/parser': '^6.0.0',
        eslint: '^8.42.0',
        'eslint-config-prettier': '^9.0.0',
        'eslint-plugin-prettier': '^5.0.0',
        jest: '^29.5.0',
        prettier: '^3.0.0',
        prisma: '^5.0.0',
        'source-map-support': '^0.5.21',
        supertest: '^6.3.3',
        'ts-jest': '^29.1.0',
        'ts-loader': '^9.4.3',
        'ts-node': '^10.9.1',
        'tsconfig-paths': '^4.2.0',
        typescript: '^5.1.3',
      },
      jest: {
        moduleFileExtensions: ['js', 'json', 'ts'],
        rootDir: 'src',
        testRegex: '.*\\.spec\\.ts$',
        transform: {
          '^.+\\.(t|j)s$': 'ts-jest',
        },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: '../coverage',
        testEnvironment: 'node',
      },
    }

    writeFileSync(join(servicePath, 'package.json'), JSON.stringify(packageJson, null, 2))

    // 生成 main.ts
    const mainTs = `import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
  console.log(\`🚀 \${process.env.SERVICE_NAME || 'Service'} is running on: \${await app.getUrl()}\`)
}
bootstrap()
`

    writeFileSync(join(servicePath, 'src', 'main.ts'), mainTs)

    // 生成 app.module.ts
    const appModuleTs = `import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
`

    writeFileSync(join(servicePath, 'src', 'app.module.ts'), appModuleTs)

    // 生成 tsconfig.json
    const tsconfig = {
      extends: '../../tsconfig.json',
      compilerOptions: {
        module: 'commonjs',
        declaration: true,
        removeComments: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        target: 'ES2021',
        sourceMap: true,
        outDir: './dist',
        baseUrl: './',
        incremental: true,
        skipLibCheck: true,
        strictNullChecks: false,
        noImplicitAny: false,
        strictBindCallApply: false,
        forceConsistentCasingInFileNames: false,
        noFallthroughCasesInSwitch: false,
      },
    }

    writeFileSync(join(servicePath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2))

    // 生成 .gitignore
    const gitignore = `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# Environment
.env
.env.local
`

    writeFileSync(join(servicePath, '.gitignore'), gitignore)

    // 生成 README.md
    const readme = `# ${options.name}

微服务描述

## 开发

\`\`\`bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm start:dev

# 运行测试
pnpm test
\`\`\`

## 数据库

\`\`\`bash
# 生成 Prisma Client
pnpm prisma:generate

# 运行迁移
pnpm prisma:migrate

# 打开 Prisma Studio
pnpm prisma:studio
\`\`\`
`

    writeFileSync(join(servicePath, 'README.md'), readme)

    console.log(`\n✅ 微服务 ${options.name} 生成完成!`)
    console.log(`\n📁 位置: services/${options.name}`)
    console.log(`\n下一步:`)
    console.log(`  cd services/${options.name}`)
    console.log(`  pnpm install`)
    console.log(`  pnpm start:dev`)
  } catch (error) {
    console.error('\n❌ 生成失败:', error.message)
    process.exit(1)
  }
}

const options = parseArgs()
generateService(options)
