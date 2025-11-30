# 会员系统使用指南

## 系统概览

已成功实现完整的会员管理和学习系统，包含以下功能模块：

### 新增页面
1. **控制台** (`/console`) - 登录入口和个人信息
2. **付费专属** (`/premium`) - 付费学员专属内容（占位）
3. **学习进度** (`/progress`) - 课程列表和学习进度追踪
4. **课程详情** (`/courses/[id]`) - 单个课程的详细页面（占位）
5. **学员后台控制系统** (`/admin`) - 团队长专属管理后台

### 用户等级体系
- **学员** - 基础等级，可以查看学习进度
- **付费学员** - 可以访问付费专属内容 + 学习进度
- **交易员** - 可以访问付费专属内容 + 学习进度
- **团队长** - 所有权限 + 学员后台控制系统

---

## 快速开始指南

### 第1步：配置Supabase数据库

1. 访问 [https://supabase.com](https://supabase.com) 创建账号和项目
2. 在SQL Editor中执行 `database/schema.sql` 文件
3. 获取项目URL和API密钥（在Settings > API中）

详细步骤请查看 `database/README.md`

### 第2步：配置环境变量

创建 `.env.local` 文件（复制 `.env.example`）：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名公钥
NEXTAUTH_SECRET=随机密钥（运行: openssl rand -base64 32）
NEXTAUTH_URL=http://localhost:3000
```

### 第3步：创建测试账号

在Supabase SQL Editor中运行：

```sql
-- 团队长测试账号（密码：admin123）
INSERT INTO users (username, password_hash, role, contact) VALUES
  ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '团队长', 'admin@test.com');
```

### 第4步：启动项目

```bash
npm install
npm run dev
```

访问 http://localhost:3000/console 使用 `admin` / `admin123` 登录

---

## 功能详解

### 1. 控制台 (`/console`)

**未登录状态：**
- 显示登录表单（账号 + 密码）
- 所有人可见

**已登录状态：**
- 显示个人信息（账号、等级）
- 团队长额外显示"进入学员后台控制系统"按钮
- 退出登录功能

### 2. 付费专属 (`/premium`)

**访问控制：**
- 未登录 → 自动跳转到控制台登录
- 学员 → 显示"权限不足，需要升级为付费学员"
- 付费学员/交易员/团队长 → 显示专属内容（目前为占位页面）

### 3. 学习进度 (`/progress`)

**功能：**
- 显示整体学习进度（百分比和完成课程数）
- 按分类展示所有课程
- 每门课程显示：
  - 状态图标（✅已完成 / 🔄学习中 / ⭕未开始）
  - 课程标题、描述、时长
  - 进度百分比（学习中时显示）
  - 操作按钮（查看/继续学习/开始学习）

**访问控制：**
- 所有登录用户均可访问

### 4. 课程详情 (`/courses/[id]`)

**功能：**
- 显示课程详细信息
- 课程内容展示区域（预留，待填充）
- "标记为已完成"按钮
- 返回学习进度按钮

**扩展预留：**
- 视频播放器
- PDF文档查看
- 练习题和测验
- 学习笔记

### 5. 学员后台控制系统 (`/admin`)

**仅团队长可访问**

#### 学员管理标签页
- **功能：**
  - 查看所有学员列表
  - 添加新学员（账号、密码、等级、联系方式、性别、年龄、培训日期）
  - 编辑学员信息（修改等级、更新个人信息）
  - 删除学员
  - 按等级筛选

- **表格列：**
  - 账号、等级、联系方式、性别、年龄、培训日期、操作

#### 学习监控标签页
- **功能：**
  - 查看所有学员的学习统计
  - 总进度百分比可视化
  - 已完成课程数/总课程数
  - 最后学习时间追踪
  - 按等级筛选

- **预留扩展：**
  - 查看单个学员详细学习记录
  - 课程完成率统计
  - 学习时长统计
  - 导出报表功能

---

## 数据库架构

### users（用户表）
```sql
- id: UUID主键
- username: 账号（唯一）
- password_hash: 加密密码
- role: 等级（学员/付费学员/交易员/团队长）
- contact: 联系方式
- gender: 性别
- age: 年龄
- training_start_date: 培训开始日期
- created_at: 创建时间
- updated_at: 更新时间
- is_active: 账号是否激活
```

### courses（课程表）
```sql
- id: UUID主键
- title: 课程标题
- description: 课程描述
- order_index: 显示顺序
- category: 分类（基础课程/进阶课程/高级课程）
- duration_minutes: 预计时长（分钟）
- content: 课程内容（HTML）
- is_published: 是否发布
- created_at: 创建时间
```

### user_progress（学习进度表）
```sql
- id: UUID主键
- user_id: 用户ID（外键）
- course_id: 课程ID（外键）
- status: 状态（未开始/学习中/已完成）
- progress: 进度（0-100）
- last_accessed: 最后访问时间
- completed_at: 完成时间
- created_at: 创建时间
- updated_at: 更新时间
```

---

## API 端点

### 认证
- `POST /api/auth/[...nextauth]` - NextAuth登录处理

### 学习进度
- `GET /api/progress` - 获取当前用户的所有课程和进度
- `GET /api/courses/[id]` - 获取课程详情和用户进度
- `PATCH /api/courses/[id]` - 更新课程学习进度

### 管理后台（需要团队长权限）
- `GET /api/admin/users` - 获取所有学员
- `POST /api/admin/users` - 创建新学员
- `PATCH /api/admin/users/[id]` - 更新学员信息
- `DELETE /api/admin/users/[id]` - 删除学员
- `GET /api/admin/monitoring` - 获取所有学员的学习统计
- `GET /api/admin/monitoring/[userId]` - 获取单个学员的详细学习记录

---

## 权限矩阵

| 功能 | 未登录 | 学员 | 付费学员 | 交易员 | 团队长 |
|------|--------|------|----------|--------|--------|
| 控制台登录 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 付费专属 | ❌ | ❌ | ✅ | ✅ | ✅ |
| 学习进度 | ❌ | ✅ | ✅ | ✅ | ✅ |
| 课程学习 | ❌ | ✅ | ✅ | ✅ | ✅ |
| 学员后台 | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 后续扩展方向

### 课程内容填充
1. 在 `courses` 表的 `content` 字段添加HTML内容
2. 或者创建独立的课程内容管理系统
3. 支持富文本、视频、附件等

### 付费专属内容
1. 添加专属交易策略文档
2. 实时市场分析报告
3. 一对一导师预约系统
4. 内部交易社区

### 学习监控增强
1. 学习时长统计
2. 课程完成率趋势图
3. 学员排行榜
4. 自动提醒功能

### 课程管理
1. 团队长可在后台添加/编辑课程
2. 课程上传系统（视频、PDF等）
3. 课程分类管理
4. 课程预览功能

### 数据分析
1. 学员留存率分析
2. 课程受欢迎度统计
3. 学习行为分析
4. 导出Excel报表

---

## 安全注意事项

1. **密码安全**
   - 所有密码使用bcrypt加密（成本因子10）
   - 从不明文存储或传输密码

2. **API安全**
   - 所有管理API都验证团队长权限
   - 使用NextAuth JWT进行会话管理
   - Supabase Row Level Security（需额外配置）

3. **环境变量**
   - 永远不要提交.env.local到Git
   - 在Vercel部署时配置环境变量
   - 定期轮换NEXTAUTH_SECRET

4. **数据库访问**
   - 只使用Supabase anon key（限制权限）
   - 配置RLS策略保护敏感数据
   - 定期备份数据库

---

## 部署到Vercel

1. 确保所有代码已提交到GitHub
2. 在Vercel中导入GitHub仓库
3. 配置环境变量（与.env.local相同）
4. Vercel会自动检测Next.js并部署
5. 每次推送到main分支都会自动重新部署

---

## 常见问题

**Q: 如何重置学员密码？**
A: 在学员后台控制系统中编辑学员，留空密码则不修改，填写新密码则更新。

**Q: 如何添加新课程？**
A: 目前需在Supabase SQL Editor中手动插入，后续可在管理后台添加课程管理功能。

**Q: 学员看不到某门课程怎么办？**
A: 检查courses表中该课程的is_published字段是否为true。

**Q: 如何批量导入学员？**
A: 可以编写SQL批量插入脚本，或后续开发Excel导入功能。

**Q: 构建失败提示Supabase错误？**
A: 确保.env.local文件存在且配置正确，或创建临时placeholder值用于构建测试。

---

## 文件结构

```
项目目录/
├── app/
│   ├── admin/              # 学员后台控制系统
│   ├── console/            # 控制台（登录）
│   ├── premium/            # 付费专属
│   ├── progress/           # 学习进度
│   ├── courses/[id]/       # 课程详情
│   └── api/
│       ├── auth/           # NextAuth认证
│       ├── progress/       # 学习进度API
│       ├── courses/        # 课程API
│       └── admin/          # 管理后台API
├── components/
│   ├── AuthProvider.tsx    # NextAuth会话提供者
│   └── Navbar.tsx          # 导航栏（已添加新栏目）
├── lib/
│   ├── auth.ts             # NextAuth配置
│   ├── supabase.ts         # Supabase客户端
│   └── permissions.ts      # 权限检查函数
├── database/
│   ├── schema.sql          # 数据库初始化SQL
│   └── README.md           # 数据库配置指南
├── types/
│   └── next-auth.d.ts      # NextAuth类型扩展
└── .env.example            # 环境变量模板
```

---

完成时间：2025-01-30
版本：v1.0
