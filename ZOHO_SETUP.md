# Zoho Mail 配置指南

## 步骤 1: 注册 Zoho Mail

1. 访问 https://www.zoho.com/mail/
2. 点击 "Sign Up Free"
3. 选择 "Free Plan" (5 users, 5GB/user)
4. 填写信息注册账号

## 步骤 2: 创建邮箱账号

1. 登录 Zoho Mail 管理后台
2. 可以选择：
   - 使用 Zoho 提供的免费域名（如 yourname@zohomail.com）
   - 或绑定你的自定义域名 mingdaotrade.cn

## 步骤 3: 生成应用专用密码

1. 访问 https://accounts.zoho.com/home#security/app-passwords
2. 点击 "Generate New Password"
3. 应用名称填: `DAO Email Service`
4. 复制生成的密码（16位）

## 步骤 4: 配置环境变量

在 `.env.local` 中更新：

```
EMAIL_USER=你的Zoho邮箱地址
EMAIL_PASSWORD=应用专用密码
```

## 步骤 5: 启用 IMAP

1. 登录 Zoho Mail
2. 右上角设置 → Mail Accounts
3. 确保 IMAP Access 已启用

## 步骤 6: 运行服务

```bash
node email-service.js
```

## Zoho IMAP/SMTP 配置

- IMAP: imap.zoho.com:993 (SSL)
- SMTP: smtp.zoho.com:465 (SSL)
