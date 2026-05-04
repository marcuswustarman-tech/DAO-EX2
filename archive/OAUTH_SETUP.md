# Azure OAuth2 配置指南

## 步骤 1: 注册 Azure 应用

1. 访问 https://portal.azure.com
2. 登录你的 Microsoft 账号
3. 搜索并进入 "Azure Active Directory"
4. 左侧菜单选择 "应用注册"
5. 点击 "新注册"

## 步骤 2: 配置应用

**应用名称**: DAO Email Service
**支持的账户类型**: 选择"任何组织目录中的账户和个人 Microsoft 账户"
**重定向 URI**: 留空

点击"注册"

## 步骤 3: 获取凭据

注册完成后，你会看到：
- **应用程序(客户端) ID** - 复制这个值
- **目录(租户) ID** - 复制这个值

## 步骤 4: 创建客户端密钥

1. 左侧菜单选择 "证书和密码"
2. 点击 "新客户端密码"
3. 描述: "Email Service Secret"
4. 过期时间: 选择 24 个月
5. 点击"添加"
6. **立即复制"值"** - 这个只显示一次！

## 步骤 5: 配置 API 权限

1. 左侧菜单选择 "API 权限"
2. 点击 "添加权限"
3. 选择 "Microsoft Graph"
4. 选择 "应用程序权限"
5. 搜索并添加以下权限：
   - Mail.Read
   - Mail.ReadWrite
   - Mail.Send
6. 点击 "授予管理员同意"（重要！）

## 步骤 6: 配置环境变量

在 `.env.local` 中添加：

```
AZURE_CLIENT_ID=你的应用程序ID
AZURE_TENANT_ID=你的租户ID
AZURE_CLIENT_SECRET=你的客户端密钥
```

## 步骤 7: 运行服务

```bash
node email-service-oauth.js
```
