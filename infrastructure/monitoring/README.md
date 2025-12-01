# 监控配置

此目录包含监控系统的配置文件。

## 目录结构

```
monitoring/
├── prometheus/     # Prometheus 配置
├── grafana/        # Grafana 配置
└── jaeger/         # Jaeger 配置
```

## 组件说明

### Prometheus

Prometheus 是一个开源的监控和告警系统。

**配置文件**: `prometheus/prometheus.yml`

**功能**:

- 指标收集
- 数据存储
- 告警规则

**使用**:

```bash
docker-compose -f monitoring/docker-compose.yml up -d prometheus
```

### Grafana

Grafana 是一个开源的可视化平台。

**配置文件**: `grafana/grafana.ini`

**功能**:

- 数据可视化
- 仪表板
- 告警通知

**使用**:

```bash
docker-compose -f monitoring/docker-compose.yml up -d grafana
```

访问: http://localhost:3000 (默认用户名/密码: admin/admin)

### Jaeger

Jaeger 是一个分布式追踪系统。

**配置文件**: `jaeger/jaeger.yml`

**功能**:

- 分布式追踪
- 性能分析
- 依赖关系图

**使用**:

```bash
docker-compose -f monitoring/docker-compose.yml up -d jaeger
```

访问: http://localhost:16686

## 集成

### 应用集成

在应用中集成监控：

1. **Prometheus 指标**: 使用 `prom-client` 暴露指标
2. **Jaeger 追踪**: 使用 OpenTelemetry SDK
3. **日志收集**: 使用 ELK Stack 或 Loki

### 告警配置

在 `prometheus/alerts.yml` 中配置告警规则。

## 部署

使用 Docker Compose 部署完整的监控栈：

```bash
docker-compose -f monitoring/docker-compose.yml up -d
```
