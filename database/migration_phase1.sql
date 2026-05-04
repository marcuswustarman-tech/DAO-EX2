-- ============================================
-- 明DAO 学员培训管理系统 - 数据库迁移脚本
-- Phase 1: 核心功能
-- ============================================

-- 1. 修改 users 表，添加新字段
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role_status VARCHAR(20) DEFAULT '准学员',
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS interview_status VARCHAR(20) DEFAULT '未申请',
ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP DEFAULT NOW();

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role_status);
CREATE INDEX IF NOT EXISTS idx_users_interview_status ON users(interview_status);

-- 2. 面试申请表
CREATE TABLE IF NOT EXISTS interview_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW(),
  interview_time TIMESTAMP,
  meeting_number VARCHAR(50),
  interview_notes TEXT,
  result VARCHAR(20) DEFAULT '待定',
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_user ON interview_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_result ON interview_applications(result);

-- 3. 学习阶段定义表
CREATE TABLE IF NOT EXISTS learning_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number INTEGER NOT NULL UNIQUE,
  stage_name VARCHAR(50) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  has_courses BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 插入预定义阶段
INSERT INTO learning_stages (stage_number, stage_name, description, order_index, has_courses) VALUES
(0, '准备阶段', '学员准备阶段，下载资料并提交准备作业', 0, FALSE),
(1, '第一阶段', '第一阶段学习，完成第一阶段作业', 1, FALSE),
(2, '第二阶段', '18节课程学习，每节课需提交作业', 2, TRUE),
(3, '第三阶段', '考核阶段：十个交易日稳定盈利记录', 3, FALSE)
ON CONFLICT (stage_number) DO NOTHING;

-- 4. 第二阶段课程表（重构 courses）
CREATE TABLE IF NOT EXISTS stage_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES learning_stages(id) ON DELETE CASCADE,
  course_number INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stage_courses_stage ON stage_courses(stage_id);
CREATE INDEX IF NOT EXISTS idx_stage_courses_number ON stage_courses(course_number);

-- 5. 学员阶段进度表
CREATE TABLE IF NOT EXISTS stage_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES learning_stages(id) ON DELETE CASCADE,
  current_course_id UUID REFERENCES stage_courses(id),
  status VARCHAR(20) DEFAULT '未开始',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, stage_id)
);

CREATE INDEX IF NOT EXISTS idx_stage_progress_user ON stage_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_stage_progress_stage ON stage_progress(stage_id);
CREATE INDEX IF NOT EXISTS idx_stage_progress_status ON stage_progress(status);

-- 6. 作业提交表
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES learning_stages(id) ON DELETE CASCADE,
  course_id UUID REFERENCES stage_courses(id) ON DELETE SET NULL,
  submission_text TEXT,
  file_url VARCHAR(500),
  file_name VARCHAR(200),
  file_size INTEGER,
  submission_count INTEGER DEFAULT 1,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT '待审核',
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_user ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_stage ON assignments(stage_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);

-- 7. 审核评论表
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  result VARCHAR(20) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_assignment ON reviews(assignment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);

-- 8. 通知提醒表
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- 9. 阶段资料表
CREATE TABLE IF NOT EXISTS stage_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES learning_stages(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(200) NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stage_materials_stage ON stage_materials(stage_id);

-- 10. 面试时间段设置表
CREATE TABLE IF NOT EXISTS interview_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_slots_date ON interview_time_slots(date);
CREATE INDEX IF NOT EXISTS idx_interview_slots_available ON interview_time_slots(is_available);

-- 11. 面试须知配置表
CREATE TABLE IF NOT EXISTS interview_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 插入默认面试须知
INSERT INTO interview_settings (setting_key, setting_value) VALUES
('interview_notes', '请准时参加面试，提前准备好相关资料。')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- 数据清理（根据需求，清除旧数据）
-- ============================================

-- 注意：执行前请备份数据！
-- TRUNCATE TABLE user_progress CASCADE;
-- TRUNCATE TABLE courses CASCADE;

-- ============================================
-- 完成提示
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ 数据库迁移完成！';
  RAISE NOTICE '📊 新增表：10个';
  RAISE NOTICE '🔧 修改表：users';
  RAISE NOTICE '📝 预定义阶段：4个';
END $$;
