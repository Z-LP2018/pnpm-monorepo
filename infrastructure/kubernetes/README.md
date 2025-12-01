# Kubernetes 配置

此目录包含 Kubernetes 部署相关的配置文件。

## 目录结构

```
kubernetes/
├── deployments/    # Deployment 配置
├── services/       # Service 配置
├── ingress/        # Ingress 配置
└── configmaps/     # ConfigMap 配置
```

## 使用

### 部署应用

```bash
# 部署所有资源
kubectl apply -f deployments/
kubectl apply -f services/
kubectl apply -f ingress/

# 或使用 kustomize
kubectl apply -k .
```

### 查看状态

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

### 删除资源

```bash
kubectl delete -f .
```

## 配置说明

### Deployments

定义应用的部署配置，包括：

- 容器镜像
- 副本数量
- 资源限制
- 环境变量

### Services

定义服务的网络配置，包括：

- 服务类型（ClusterIP、NodePort、LoadBalancer）
- 端口映射
- 选择器

### Ingress

定义外部访问规则，包括：

- 域名配置
- SSL/TLS 证书
- 路由规则

### ConfigMaps

存储应用的配置信息，例如：

- 环境变量
- 配置文件
