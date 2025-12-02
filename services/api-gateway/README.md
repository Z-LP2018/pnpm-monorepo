# Gateway 项目初始化

## 开发流程

| 优先级 | 完成状态 | 任务项                                                                             | 选用技术（首选）                                     | 可选方案（标记为 Optional）              | 备注/说明                                                         |
| ------ | -------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------- |
| 1      | ✔        | 调整项目为 Fastify 驱动（性能更好，官方也推荐）                                    | `@nestjs/platform-fastify`                           | Optional: Express（默认）                | 替换 `main.ts` 中的 `NestFactory.create(NestExpressApplication)`  |
| 2      | ✔        | 配置 pnpm workspace（若根目录已有 `pnpm-workspace.yaml`，只需确认 gateway 已包含） | pnpm workspace                                       | -                                        | 确保 `packages/gateway` 在 workspace 中                           |
| 3      | ✔        | 安装公共依赖（统一放在根目录 devDependencies）                                     | -                                                    | -                                        | `pnpm add -w -D typescript @nestjs/cli` 等                        |
| 4      | ✔        | 配置全局 DTO 验证管道 + 全局异常过滤器                                             | `class-validator` + `ValidationPipe` + 自定义 Filter | -                                        | `whitelist: true, transform: true, forbidNonWhitelisted: true`    |
| 5      | ✔        | 统一响应格式拦截器（所有接口返回 { code, message, data, traceId }）                | 自定义 `TransformInterceptor`                        | -                                        | 支持 `@SkipTransform()` 装饰器跳过（如文件流）                    |
| 6      | ✔        | 认证模块（JWT 验证 + 黑名单检查）                                                  | `@nestjs/jwt` + `@nestjs/passport` + Redis           | Optional: OAuth2（后续扩展）             | **仅验证 AccessToken 有效性**，RefreshToken 颁发由认证服务负责    |
| 7      | ✔        | 角色级鉴权（基础 RBAC）                                                            | 自定义 `RolesGuard` + JWT 解析                       | -                                        | **仅支持角色级别鉴权**（如 admin/user），细粒度权限由权限服务处理 |
| 8      | ✔        | 微服务客户端（Hybrid 模式，支持多传输层）                                          | `@nestjs/microservices`（Hybrid）                    | Optional: gRPC / Kafka / RabbitMQ / NATS | 初期推荐 Redis 或 TCP 传输，简单可靠                              |
| 9      | ☐        | 服务注册与发现集成                                                                 | **Nacos**                                            | Optional: Consul / Etcd                  | 与公司现有技术栈统一，同时支持配置中心                            |
| 10     | ☐        | 配置中心集成（路由、限流、熔断规则动态下发）                                       | **Nacos**                                            | Optional: Apollo / Consul                | 配置变更自动刷新，无需重启，**不包含业务配置**                    |
| 11     | ☐        | 动态路由 + 微服务代理（核心网关功能）                                              | 自定义 `GatewayModule` + Nacos 配置监听              | Optional: 后期切换 APISIX/Kong           | 支持路径重写、超时、重试、WebSocket 代理，**纯转发不做业务逻辑**  |
| 12     | ☐        | 统一限流（分布式 + 多维度）                                                        | `@nestjs/throttler` + Redis 存储                     | Optional: 自研令牌桶/漏桶                | 支持按 IP、接口、服务限流，**UserID 限流需注意性能影响**          |
| 13     | ☐        | 熔断降级 + 超时控制                                                                | `opossum` 或自研 + 自定义降级策略                    | Optional: Sentinel / Resilience4j        | 快速失败 + **通用 fallback 响应**（不包含业务逻辑）               |
| 14     | ☐        | 日志系统（含 TraceID 透传）                                                        | **Pino**（性能最高）                                 | Optional: Winston / ELK                  | Fastify 原生支持，自动注入请求链路 ID                             |
| 15     | ☐        | 链路追踪                                                                           | **OpenTelemetry**                                    | Optional: 直接用 Jaeger（无 OTEL）       | 自动采集 HTTP、Redis、微服务调用，导出到 Jaeger/Tempo             |
| 16     | ☐        | 指标监控                                                                           | **Prometheus** + `@willsoto/nestjs-prometheus`       | -                                        | 暴露 `/metrics`，包含上游服务调用指标                             |
| 17     | ☐        | 健康检查                                                                           | `@nestjs/terminus`                                   | -                                        | `/health` 接口，集成 Redis、Nacos、上游服务检查                   |
| 18     | ☐        | Swagger 文档（仅 dev 环境开启 + JWT 鉴权）                                         | `@nestjs/swagger`                                    | -                                        | 配置 BearerAuth，生产环境自动关闭                                 |
| 19     | ☐        | 环境变量与配置模块                                                                 | `@nestjs/config` + 多环境 .env 文件                  | -                                        | 支持 .env.development / .env.production                           |
| 20     | ☐        | 请求头统一透传（UserID、Roles、TenantID、TraceID 等）                              | 自定义中间件或拦截器                                 | -                                        | **仅透传原始认证信息**，不解析业务字段                            |
| 21     | ☐        | 安全加固（Helmet + CORS + CSRF + 请求体大小限制）                                  | `@fastify/helmet` + `@fastify/cors`                  | -                                        | 防止常见 Web 攻击                                                 |
| 22     | ☐        | 公共响应缓存（静态/通用数据）                                                      | `@nestjs/cache-manager` + Redis Store                | -                                        | **仅缓存公共配置/字典数据**，业务缓存由后端服务处理               |
| 23     | ☐        | WebSocket 代理转发                                                                 | `@nestjs/websockets` + Fastify WS                    | -                                        | **纯转发代理**，不维护连接状态，复杂场景考虑独立部署              |
| 24     | ☐        | Docker + Docker Compose 支持                                                       | Dockerfile（多阶段构建） + docker-compose.yml        | Optional: Kubernetes Deployment          | 本地联调完整微服务生态                                            |
| 25     | ☐        | CI/CD 配置（GitHub Actions / GitLab CI）                                           | -                                                    | -                                        | build → test → docker build → push → deploy                       |
| 26     | ☐        | 单元测试 & E2E 测试覆盖                                                            | Jest + Supertest                                     | -                                        | 目标覆盖率 > 85%，包含网关代理、限流、熔断场景                    |
| 27     | ☐        | 基础灰度发布支持（流量级）                                                         | Nacos 配置 + Header/Weight 路由                      | -                                        | **仅支持 Header/权重分流**，用户级灰度由服务网格/后端处理         |

## 技术选型最终确认（网关项目）—— 2025 版

| 功能模块        | 最终选用方案                                    | 备注                               |
| --------------- | ----------------------------------------------- | ---------------------------------- |
| 微服务框架      | Nest.js v10+ + Fastify                          | 性能最佳，生态完整                 |
| 工作空间管理    | pnpm workspace（monorepo）                      | 统一依赖、极速安装                 |
| 微服务通信      | @nestjs/microservices（Hybrid 模式）            | 支持 TCP/Redis/Kafka/gRPC 随意切换 |
| 服务注册与发现  | **Nacos**（首选）                               | 配置中心 + 注册中心二合一          |
| 配置中心        | **Nacos**                                       | 路由、限流、灰度规则实时下发       |
| 认证授权        | JWT + RefreshToken + Redis 黑名单 + 自定义 RBAC | 无状态 + 高安全                    |
| 限流            | @nestjs/throttler + Redis 分布式令牌桶          | 开箱即用，支持多维度               |
| 熔断降级        | opossum + 自定义 fallback                       | 轻量、灵活                         |
| 日志            | **Pino**（性能最高）                            | 比 Winston 快 5-10 倍              |
| 链路追踪        | **OpenTelemetry** → Jaeger/Tempo                | 未来主流，社区最活跃               |
| 指标监控        | Prometheus + Grafana                            | 标准方案                           |
| 健康检查        | @nestjs/terminus                                | 支持多种检查器                     |
| 缓存            | cache-manager + redis-store                     | 响应缓存 + 权限缓存                |
| ORM（权限中心） | **Prisma**                                      | 类型安全、迁移强大                 |
| 安全防护        | Helmet + CORS + CSRF + 请求体限制               | 必备安全基线                       |
| 容器化          | Docker → Kubernetes + Helm                      | 生产标准                           |

直接保存为项目根目录 `TODO.md`，配合 VSCode 的 **TODO Tree** 或 **Markdown All in One** 插件，优先级一目了然，打勾即视进度。

这份清单已覆盖 99% 企业级网关生产落地的所有关键点，放心照着打，绝对不会踩坑！
