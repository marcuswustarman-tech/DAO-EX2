-- 明道交易平台数据库Schema
-- 在Supabase SQL Editor中执行此文件

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('学员', '付费学员', '交易员', '团队长')),

  -- 个人信息
  contact VARCHAR(100),
  gender VARCHAR(10),
  age INTEGER,
  training_start_date DATE,

  -- 系统字段
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 2. 课程表
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  category VARCHAR(50),
  duration_minutes INTEGER,
  content TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 学习进度表
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,

  -- 进度信息
  status VARCHAR(20) DEFAULT '未开始' CHECK (status IN ('未开始', '学习中', '已完成')),
  progress INTEGER DEFAULT 0,
  last_accessed TIMESTAMP,
  completed_at TIMESTAMP,

  -- 系统字段
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- 唯一约束
  UNIQUE(user_id, course_id)
);

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_courses_order ON courses(order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON user_progress(course_id);

-- 5. 插入示例课程数据（可选）
INSERT INTO courses (title, description, order_index, category, duration_minutes) VALUES
  ('交易心理学基础', '了解交易员必备的心理素质和情绪管理技巧', 1, '基础课程', 45),
  ('风险管理入门', '学习如何控制交易风险，保护资金安全', 2, '基础课程', 60),
  ('K线图解读', '掌握K线图的基本形态和市场信号', 3, '基础课程', 50),
  ('技术指标应用', '学习常用技术指标的使用方法', 4, '进阶课程', 55),
  ('交易策略制定', '如何制定和执行系统化交易策略', 5, '进阶课程', 70),
  ('市场趋势分析', '识别和跟踪市场趋势的方法', 6, '进阶课程', 65),
  ('高级风控技术', '深入学习专业风险控制技术', 7, '高级课程', 80),
  ('量化交易基础', '了解量化交易的基本概念和应用', 8, '高级课程', 90),
  ('资金管理策略', '专业的资金分配和仓位管理', 9, '高级课程', 75),
  ('实盘操作技巧', '真实交易环境中的实战技巧', 10, '高级课程', 85)
ON CONFLICT DO NOTHING;

-- 6. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
