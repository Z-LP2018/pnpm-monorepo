# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 monorepo 配置文件
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY turbo.json ./

# 复制共享包
COPY packages ./packages

# 复制服务代码
COPY services/api-gateway ./services/api-gateway
COPY tsconfig.json ./

# 安装 pnpm
RUN npm install -g pnpm@9

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建服务
RUN pnpm --filter @gulu/api-gateway build

# 运行阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@9

# 复制构建产物和依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api-gateway/dist ./dist
COPY --from=builder /app/services/api-gateway/package.json ./package.json
COPY --from=builder /app/services/api-gateway/public ./public
COPY --from=builder /app/packages ./packages

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "dist/main.js"]

