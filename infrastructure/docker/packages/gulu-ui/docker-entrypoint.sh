#!/bin/sh
set -e

# 打印启动信息
echo "=========================================="
echo "🚀 @gulu/ui 文档站点"
echo "🌐 访问地址: http://localhost:80"
echo "=========================================="
echo "环境变量为"

env | grep -E '^[A-Z_]+=' | grep -vE '^(PATH|HOME|HOSTNAME|SHLVL|PWD|_|OLDPWD)=' | sort | while IFS='=' read -r key value; do
  echo "   $key=$value"
done

echo "💡 提示: 使用 'docker port 你的容器名' 查看端口映射"
echo "=========================================="
# 启动 nginx
exec nginx -g "daemon off;"

