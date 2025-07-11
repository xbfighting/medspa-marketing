# Claude API Setup Guide

## 本地开发设置

1. **复制环境变量文件**
   ```bash
   cp .env.local.example .env.local
   ```

2. **获取 Claude API Key**
   - 访问 [Anthropic Console](https://console.anthropic.com/settings/keys)
   - 登录或创建账号
   - 点击 "Create Key"
   - 复制生成的 API key (格式: `sk-ant-api03-...`)

3. **配置 API Key**
   打开 `.env.local` 文件，替换示例 key：
   ```
   =sk-ant-api03-你的实际密钥
   ```

4. **重启开发服务器**
   ```bash
   npm run dev
   ```

## Vercel 部署设置

1. **在 Vercel Dashboard 中配置**
   - 进入你的项目设置
   - 点击 "Settings" → "Environment Variables"
   - 添加新的环境变量：
     - Name: ``
     - Value: 你的 API key
     - Environment: 选择 Production (也可以选择 Preview 和 Development)

2. **重新部署**
   - 环境变量添加后，需要重新部署才能生效
   - 可以在 Vercel Dashboard 点击 "Redeploy"

## 安全说明

- ✅ API key 只在服务器端使用，不会暴露给客户端
- ✅ 使用 Next.js API Routes 确保安全
- ✅ Vercel 会加密存储你的环境变量
- ❌ 永远不要将 API key 提交到 Git
- ❌ 不要使用 `NEXT_PUBLIC_` 前缀

## 测试 API 集成

1. 访问 AI Assistant 页面
2. 输入营销目标（例如："我需要填满下周二的空闲时段"）
3. 点击 "Create Campaign with AI"
4. 如果 API 配置正确，你会看到 Claude 分析的结果
5. 如果 API 未配置，系统会使用默认的模拟数据

## 故障排除

- **API key 无效**: 检查是否正确复制了完整的 key
- **请求失败**: 检查 Anthropic 账户是否有足够的额度
- **本地测试正常但 Vercel 失败**: 确认环境变量已在 Vercel 中正确设置

## 费用说明

- 使用的是 Claude 3 Haiku 模型（最经济的选择）
- 每次分析大约使用 500-1000 tokens
- 费用约为 $0.00025-$0.0005 per 请求

## API 调用日志

所有 Claude API 调用都会记录在 `/logs/claude-api.log` 文件中，包括：
- 时间戳
- API 端点（analyze-goal, generate-content）
- 使用的模型
- Token 使用量
- 估算费用
- 请求和响应数据
- 响应时间

注意：`/logs` 目录已添加到 `.gitignore`，不会提交到版本控制
