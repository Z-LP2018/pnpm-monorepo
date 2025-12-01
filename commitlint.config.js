/**
 * Commitlint 配置
 * 用于规范 Git 提交信息格式
 *
 * 提交信息格式: <type>(<scope>): <subject>
 *
 * 示例:
 *   feat(ui): 添加按钮组件
 *   fix(api): 修复用户登录接口
 *   docs: 更新 README 文档
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 类型定义
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档变更
        'style', // 代码格式（不影响功能）
        'refactor', // 重构（既不是新增功能，也不是修复 bug）
        'perf', // 性能优化
        'test', // 增加测试
        'build', // 构建过程或辅助工具的变动
        'ci', // CI 配置文件和脚本的变动
        'chore', // 其他改动
        'revert', // 回滚提交
      ],
    ],
    // subject 大小写不做限制
    'subject-case': [0],
    // subject 不允许以.结尾
    'subject-full-stop': [2, 'never', '.'],
    // subject 最小长度
    'subject-min-length': [2, 'always', 5],
  },
}
