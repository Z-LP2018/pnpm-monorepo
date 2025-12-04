# Gulu UI 文档站点 Docker 使用指南

## 概述

本项目使用多阶段构建方式构建 Docker 镜像，将 @gulu/ui 文档站点打包为独立的容器化应用。

## 前置要求

| 项目     | 要求                                                                                         |
| -------- | -------------------------------------------------------------------------------------------- |
| Docker   | Docker Desktop (Windows/Mac) 或 Docker Engine (Linux)，版本 >= 20.10                         |
| 项目文件 | 项目根目录需包含 `pnpm-workspace.yaml`、`package.json`、`pnpm-lock.yaml` 和 `packages/` 目录 |

## Dockerfile 说明

### 构建流程

| 阶段     | 说明                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| 构建阶段 | 使用 Node.js 24 Alpine 安装依赖，按顺序构建 `@gulu/types` → `@gulu/hooks` → `@gulu/ui`，最后构建 VitePress 文档 |
| 生产阶段 | 使用 Nginx Alpine 提供静态文件服务                                                                              |

## 使用方式

### 方式一：Docker 命令

| 步骤        | 命令                                                                                  | 说明                        |
| ----------- | ------------------------------------------------------------------------------------- | --------------------------- |
| 1. 构建镜像 | `docker build -t gulu-ui-docs -f infrastructure/docker/packages/gulu-ui/Dockerfile .` | 在项目根目录执行            |
| 2. 运行容器 | `docker run -d -p 8080:80 -e PORT=8080 --name gulu-ui-docs gulu-ui-docs`              | 端口映射：主机8080 → 容器80 |
| 3. 访问站点 | 浏览器打开 `http://localhost:8080`                                                    | -                           |
| 4. 查看日志 | `docker logs -f gulu-ui-docs`                                                         | 实时查看容器日志            |
| 5. 停止容器 | `docker stop gulu-ui-docs`                                                            | 停止运行中的容器            |
| 6. 删除容器 | `docker rm gulu-ui-docs`                                                              | 删除已停止的容器            |

### 方式二：Docker Compose

| 步骤        | 命令                                  | 说明                                                  |
| ----------- | ------------------------------------- | ----------------------------------------------------- |
| 1. 启动服务 | `docker-compose up -d`                | 在 `infrastructure/docker/packages/gulu-ui/` 目录执行 |
| 2. 指定端口 | `DOCS_PORT=3000 docker-compose up -d` | 或通过 `.env` 文件设置 `DOCS_PORT=3000`               |
| 3. 查看状态 | `docker-compose ps`                   | 查看运行中的容器                                      |
| 4. 查看日志 | `docker-compose logs -f`              | 实时查看日志                                          |
| 5. 停止服务 | `docker-compose down`                 | 停止并删除容器                                        |

### 服务依赖配置

在 `docker-compose.yml` 中配置服务依赖，确保依赖服务先启动。

#### 方式一：简单依赖

等待依赖服务启动即可（不等待健康检查）：

```yaml
services:
  gulu-ui-docs:
    depends_on:
      - postgres
      - redis
```

#### 方式二：条件依赖（推荐）

等待依赖服务健康检查通过后再启动：

```yaml
services:
  gulu-ui-docs:
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      api-gateway:
        condition: service_healthy
```

#### 完整示例

```yaml
version: '3.8'

services:
  gulu-ui-docs:
    build:
      context: ../../../../
      dockerfile: infrastructure/docker/packages/gulu-ui/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - gulu-network

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - gulu-network

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - gulu-network

networks:
  gulu-network:
    driver: bridge
```

#### 依赖条件说明

| 条件                             | 说明                               |
| -------------------------------- | ---------------------------------- |
| `service_started`                | 等待服务启动（默认，无需指定）     |
| `service_healthy`                | 等待服务健康检查通过（推荐）       |
| `service_completed_successfully` | 等待服务成功完成（用于一次性任务） |

## 常用命令

### 镜像管理

| 操作         | 命令                                 |
| ------------ | ------------------------------------ |
| 查看镜像     | `docker images \| grep gulu-ui-docs` |
| 删除镜像     | `docker rmi gulu-ui-docs`            |
| 强制删除镜像 | `docker rmi -f gulu-ui-docs`         |

### 容器管理

| 操作             | 命令                                |
| ---------------- | ----------------------------------- |
| 查看运行中的容器 | `docker ps \| grep gulu-ui-docs`    |
| 查看所有容器     | `docker ps -a \| grep gulu-ui-docs` |
| 启动容器         | `docker start gulu-ui-docs`         |
| 重启容器         | `docker restart gulu-ui-docs`       |
| 停止容器         | `docker stop gulu-ui-docs`          |
| 删除容器         | `docker rm gulu-ui-docs`            |
| 强制删除容器     | `docker rm -f gulu-ui-docs`         |

### 查看信息

| 操作         | 命令                              |
| ------------ | --------------------------------- |
| 查看端口映射 | `docker port gulu-ui-docs`        |
| 查看容器详情 | `docker inspect gulu-ui-docs`     |
| 查看资源使用 | `docker stats gulu-ui-docs`       |
| 进入容器     | `docker exec -it gulu-ui-docs sh` |

### 清理操作

| 操作                 | 命令                                                 |
| -------------------- | ---------------------------------------------------- |
| 停止并删除容器       | `docker stop gulu-ui-docs && docker rm gulu-ui-docs` |
| 删除未使用的镜像     | `docker image prune`                                 |
| 清理所有未使用的资源 | `docker system prune -a`                             |

## 参数说明

### Docker 构建参数

| 参数                                                   | 说明                   |
| ------------------------------------------------------ | ---------------------- |
| `-t gulu-ui-docs`                                      | 镜像标签名称           |
| `-f infrastructure/docker/packages/gulu-ui/Dockerfile` | Dockerfile 路径        |
| `.`                                                    | 构建上下文为项目根目录 |

### Docker 运行参数

| 参数                  | 说明                             |
| --------------------- | -------------------------------- |
| `-d`                  | 后台运行（detached mode）        |
| `-p 8080:80`          | 端口映射（主机端口:容器端口）    |
| `-e PORT=8080`        | 设置环境变量（用于启动脚本显示） |
| `--name gulu-ui-docs` | 容器名称                         |

## 环境变量

### 传递环境变量

容器启动时会自动打印所有自定义环境变量，方便查看配置。

#### Docker 命令方式

```bash
# 传递单个环境变量
docker run -d -p 8080:80 -e MYSQL_PASSWORD=123456 --name gulu-ui-docs gulu-ui-docs

# 传递多个环境变量
docker run -d -p 8080:80 \
  -e PORT=8080 \
  -e MYSQL_PASSWORD=123456 \
  -e API_URL=https://api.example.com \
  --name gulu-ui-docs \
  gulu-ui-docs

# 从文件读取环境变量
docker run -d -p 8080:80 --env-file .env --name gulu-ui-docs gulu-ui-docs
```

#### Docker Compose 方式

在 `docker-compose.yml` 中添加环境变量：

```yaml
services:
  gulu-ui-docs:
    environment:
      - NODE_ENV=production
      - MYSQL_PASSWORD=123456
      - API_URL=https://api.example.com
```

或使用 `.env` 文件：

```env
MYSQL_PASSWORD=123456
API_URL=https://api.example.com
```

### 环境变量打印

容器启动时会自动打印：

| 输出内容       | 说明                                                          |
| -------------- | ------------------------------------------------------------- |
| 环境变量配置   | 显示 `ENV_VARS_TO_PRINT` 中指定的变量（默认：PORT、NODE_ENV） |
| 自定义环境变量 | 显示所有自定义环境变量（排除系统变量）                        |

### 示例输出

```
📋 环境变量配置:
   PORT=8080
   NODE_ENV=production

🔧 自定义环境变量:
   API_URL=https://api.example.com
   MYSQL_PASSWORD=123456
   NODE_ENV=production
   PORT=8080
```

## 相关文件

| 文件                   | 说明                    |
| ---------------------- | ----------------------- |
| `Dockerfile`           | Docker 镜像构建文件     |
| `docker-compose.yml`   | Docker Compose 配置文件 |
| `nginx.conf`           | Nginx 服务器配置        |
| `docker-entrypoint.sh` | 容器启动脚本            |
