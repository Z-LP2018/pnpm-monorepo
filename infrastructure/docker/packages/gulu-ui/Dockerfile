# 多阶段构建 Dockerfile for Gulu UI 文档站点

# 第一阶段：构建阶段
FROM node:24-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@9.0.0

# 复制 workspace 配置文件
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# 复制 packages 目录（包含 gulu-ui 及其依赖的 workspace 包）
COPY packages ./packages

# 安装依赖
RUN pnpm install --frozen-lockfile

# 先构建 workspace 依赖包（按依赖顺序）
# 1. 构建 @gulu/types（没有 workspace 依赖）
WORKDIR /app/packages/gulu-types
RUN pnpm build

# 2. 构建 @gulu/hooks（依赖 @gulu/types）
WORKDIR /app/packages/gulu-hooks
RUN pnpm build

# 3. 构建 @gulu/ui（依赖 @gulu/hooks 和 @gulu/types）
WORKDIR /app/packages/gulu-ui
RUN pnpm build

# 4. 构建文档
RUN pnpm docs:build

# 第二阶段：生产阶段
FROM nginx:alpine

# 复制构建好的文档到 nginx 目录
COPY --from=builder /app/packages/gulu-ui/docs/.vitepress/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY infrastructure/docker/packages/gulu-ui/nginx.conf /etc/nginx/conf.d/default.conf

# 复制启动脚本
COPY infrastructure/docker/packages/gulu-ui/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 暴露端口
EXPOSE 80

# 使用启动脚本（会打印信息后启动 nginx）
ENTRYPOINT ["/docker-entrypoint.sh"]

