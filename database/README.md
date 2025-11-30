# 数据库配置指南

## 1. 创建Supabase项目

1. 访问 [https://supabase.com](https://supabase.com) 并登录/注册
2. 点击 "New Project" 创建新项目
3. 填写项目名称、数据库密码、选择区域（建议选择离你最近的）
4. 等待项目创建完成（大约2分钟）

## 2. 获取API密钥

1. 在Supabase项目页面，点击左侧菜单的 "Settings" (设置)
2. 点击 "API"
3. 复制以下信息：
   - **Project URL** (项目URL)
   - **anon public** key (匿名公钥)

## 3. 配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 复制 `.env.example` 的内容到 `.env.local`
3. 填写实际值：

```env
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名公钥
NEXTAUTH_SECRET=随机生成的密钥（可以运行：openssl rand -base64 32）
NEXTAUTH_URL=http://localhost:3000
```

## 4. 初始化数据库

1. 在Supabase项目页面，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `database/schema.sql` 文件的全部内容
4. 粘贴到SQL编辑器
5. 点击 "Run" 执行SQL
6. 确认所有表都已创建成功

## 5. 创建测试账号

在SQL Editor中运行以下SQL创建一个团队长测试账号：

```sql
-- 插入团队长测试账号
-- 密码：admin123（已加密）
INSERT INTO users (username, password_hash, role, contact, gender, age, training_start_date) VALUES
  ('admin', '$2a$10$rOvwD8qHn5CqXLKJ5h.qmO7VHZJj3X8pFt3yP3qz7tLLwXxBqH4pC', '团队长', 'admin@mingdao.com', '男', 30, '2024-01-01');

-- 插入普通学员测试账号
-- 密码：student123（已加密）
INSERT INTO users (username, password_hash, role, contact, gender, age, training_start_date) VALUES
  ('student1', '$2a$10$K/T4EZ5qE8PcYqH.5jH5KuO7Nl5VxV4vJqC8gG3aU3H7qK8F0XyLa', '学员', 'student@test.com', '男', 25, '2024-01-15');

-- 插入付费学员测试账号
-- 密码：premium123（已加密）
INSERT INTO users (username, password_hash, role, contact, gender, age, training_start_date) VALUES
  ('premium1', '$2a$10$L9T5FZ6rF9QdZrI.6kI6LvP8Om6WyW5wKrD9hH4bV4I8rL9G1YzMb', '付费学员', 'premium@test.com', '女', 28, '2024-01-10');
```

## 6. 测试登录

启动开发服务器后，访问 `/console` 使用以下账号测试：

- **团队长账号**：admin / admin123
- **学员账号**：student1 / student123
- **付费学员账号**：premium1 / premium123

## 7. 数据库表说明

### users（用户表）
- 存储所有学员和管理员信息
- 密码使用bcrypt加密
- role字段控制权限：学员、付费学员、交易员、团队长

### courses（课程表）
- 存储所有课程信息
- order_index控制显示顺序
- is_published控制是否发布

### user_progress（学习进度表）
- 记录每个学员对每门课程的学习进度
- status：未开始、学习中、已完成
- progress：0-100的进度百分比

## 常见问题

### Q: 如何重置数据库？
A: 在SQL Editor中运行：
```sql
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```
然后重新执行 `database/schema.sql`

### Q: 如何修改密码？
A: 需要使用bcrypt加密新密码。可以在Node.js中运行：
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('新密码', 10);
console.log(hash);
```

### Q: 如何添加新课程？
A: 在SQL Editor中运行：
```sql
INSERT INTO courses (title, description, order_index, category, duration_minutes) VALUES
  ('课程标题', '课程描述', 11, '课程分类', 60);
```
