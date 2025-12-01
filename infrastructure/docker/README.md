# Docker 配置

此目录包含 Docker 相关的配置文件。

## 目录结构

```
docker/
├── nginx/          # Nginx 配置
│   ├── nginx.conf  # 主配置文件
│   └── conf.d/     # 站点配置
├── postgres/       # PostgreSQL 配置
├── redis/          # Redis 配置
└── mongodb/        # MongoDB 配置
```

## 使用

### 本地开发

使用根目录的 `docker-compose.yml` 启动本地开发环境：

```bash
pnpm docker:up
```

### 生产环境

使用根目录的 `docker-compose.prod.yml` 部署到生产环境：

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 配置说明

### Nginx

- `nginx.conf`: Nginx 主配置文件
- `conf.d/`: 各个应用的 Nginx 站点配置

### 数据库

各个数据库的配置文件可以根据需要添加，例如：

- 初始化脚本
- 配置文件
- 数据卷挂载配置
