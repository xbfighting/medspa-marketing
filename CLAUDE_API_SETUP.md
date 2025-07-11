# Claude API Setup Guide

## 平台访问认证

为了保护 API key 不被滥用，平台现已添加登录认证功能。

### 默认登录凭据
- 用户名: `admin`
- 密码: `medspa2024`

**重要**: 请在生产环境中修改这些默认凭据！

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

1. **在 Vercel Dashboard 中配置所有环境变量**
   - 进入你的项目设置
   - 点击 "Settings" → "Environment Variables"
   - 添加以下环境变量：
   
   **Claude API 配置**:
     - Name: `CLAUDE_API_KEY`
     - Value: 你的 API key
     
   **认证配置**:
     - Name: `AUTH_USERNAME`
     - Value: 你的用户名（不要使用默认值）
     
     - Name: `AUTH_PASSWORD`
     - Value: 你的密码（不要使用默认值）
     
     - Name: `JWT_SECRET`
     - Value: 一个随机的长字符串（用于加密 session）
     
   - Environment: 选择 Production (也可以选择 Preview 和 Development)

2. **重新部署**
   - 环境变量添加后，需要重新部署才能生效
   - 可以在 Vercel Dashboard 点击 "Redeploy"

## 禁用 Claude API

如果你在生产环境中遇到 API 问题，可以通过设置环境变量来禁用 Claude API：

```
ENABLE_CLAUDE_API=false
```

系统会自动使用内置的智能模板系统，确保功能正常运行。

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
