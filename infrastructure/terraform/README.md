# Terraform 配置

此目录包含基础设施即代码（IaC）的 Terraform 配置文件。

## 目录结构

```
terraform/
├── aws/            # AWS 云资源配置
└── aliyun/         # 阿里云资源配置
```

## 使用

### 初始化

```bash
cd terraform/aws  # 或 aliyun
terraform init
```

### 规划变更

```bash
terraform plan
```

### 应用变更

```bash
terraform apply
```

### 销毁资源

```bash
terraform destroy
```

## 配置说明

### AWS

包含 AWS 云服务的资源配置，例如：

- VPC 网络
- EC2 实例
- RDS 数据库
- S3 存储桶
- CloudFront CDN

### 阿里云

包含阿里云服务的资源配置，例如：

- VPC 网络
- ECS 实例
- RDS 数据库
- OSS 对象存储
- CDN 加速

## 注意事项

1. 确保已安装 Terraform
2. 配置云服务商的访问凭证
3. 根据实际需求修改配置
4. 生产环境使用前请仔细审查配置
