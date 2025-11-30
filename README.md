# 明DAO - 自营交易员孵化平台

一个专业的自营交易员筛选和培养平台，采用极简砺炼的设计风格，为有潜质的交易员提供系统化培训和资金支持。

## 项目特点

### 🎨 设计风格
- **极简砺炼风格**：大量留白、深石墨灰主色调、朱红色点缀
- **数据的呼吸动画**：首页采用Canvas动画，展现从混沌中捕捉确定性的理念
- **响应式设计**：完美支持桌面和移动端

### ✨ 核心功能

1. **首页动态封面**
   - 数百个粒子的动态呼吸效果
   - 随机出现的金色曲线（象征盈利曲线）
   - 轻微的鼠标交互

2. **心理测评系统**
   - 20道专业问题，评估5大维度
   - 自动评分和结果分析
   - 智能筛选机制
   - 通过后可预约面试

3. **知识中心**
   - 10篇专业交易文章
   - 分类筛选功能
   - 订阅newsletter

4. **常见问题**
   - 手风琴式交互
   - 6大类别，30+问题

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **动画**: Framer Motion + Canvas API
- **字体**: Inter, Noto Sans SC, Playfair Display
- **部署**: Vercel

## 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看网站

### 构建生产版本
```bash
npm run build
npm start
```

## 部署到Vercel

### 方式一：通过Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 方式二：通过Git集成
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署

## 项目结构

```
DAO-EX2/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── about/             # 关于我们
│   ├── assessment/        # 心理测评
│   ├── training/          # 培训介绍
│   ├── blog/              # 知识中心
│   ├── faq/               # 常见问题
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── DataBreathAnimation.tsx  # 深邃星空动画
│   ├── InterviewModal.tsx       # 预约面试弹窗
│   ├── Navbar.tsx         # 导航栏
│   └── Footer.tsx         # 页脚
├── lib/                   # 工具函数
│   └── assessment.ts      # 测评逻辑
├── public/                # 静态资源
├── tailwind.config.ts     # Tailwind配置
├── vercel.json            # Vercel部署配置
└── package.json
```

## 页面说明

### 首页 (/)
- 深邃星空动画封面
- "明道"标题渐显
- 点击"进入平台"查看完整内容
- 全方位对比表格（明道 vs 竞品）
- 9阶段职业晋升路径
- 学员感言与收益展示
- 捐赠支持板块
- CTA区域（心理测试 + 预约面试）

### 关于我们 (/about)
- 平台理念
- 详细培养流程
- 目标学员画像
- 深邃星空背景

### 培训介绍 (/training)
- 核心优势展示
- 系统化培训体系
- 5阶段培训路径
- 申请要求说明
- 数据统计展示
- 预约面试功能

### 心理测评 (/assessment)
- 20题专业测评（5维度 × 4题）
- 实时进度显示
- 自动评分和维度分析
- 通过后显示预约面试按钮

### 知识中心 (/blog)
- 10篇交易相关文章
- 分类筛选
- 订阅功能

### 常见问题 (/faq)
- 6大类别
- 手风琴式展开
- 涵盖申请、培训、资金等各方面

## 设计系统

### 颜色
- **主色**: #1a1a1a (深石墨灰)
- **强调色**: #C83C23 (朱红)
- **中性色**: #fafafa - #171717

### 字体
- **无衬线**: Inter + Noto Sans SC
- **衬线**: Playfair Display + Noto Serif SC

### 间距
- **section-spacing**: py-20 md:py-28 lg:py-36
- **section-spacing-sm**: py-12 md:py-16 lg:py-20

## 后续开发计划

### MVP已完成 ✅
- [x] 首页动画
- [x] 心理测评系统
- [x] 基础页面（关于、博客、FAQ）
- [x] 导航和页脚
- [x] 响应式设计

### 第二阶段计划
- [ ] 用户登录系统 (NextAuth.js)
- [ ] 数据库集成 (Vercel Postgres)
- [ ] 学员仪表盘
- [ ] 任务和课程系统
- [ ] 交易记录本
- [ ] 实时风控面板

### 第三阶段计划
- [ ] 博客CMS集成
- [ ] 邮件订阅功能
- [ ] 云端交易环境
- [ ] 数据分析和报表

## 许可证

Copyright © 2024 明DAO. 保留所有权利。

## 联系方式

- 钉钉：iiu_z896deh8c
- 邮箱：mojie_yc@outlook.com
