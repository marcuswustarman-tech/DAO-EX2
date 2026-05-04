-- 创建测试账号SQL
-- 在Supabase SQL Editor中执行

-- 1. 学员账号
-- 账号: student001
-- 密码: test123
INSERT INTO users (username, password_hash, role_status, is_active)
VALUES (
  'student001',
  '$2b$10$C6B8PWbGTcjA1gwi8Ci.YOTOCf09twHLIbNqsrc4VTs/2Q3/HycR2',
  '学员',
  true
);

-- 2. 付费学员账号
-- 账号: premium001
-- 密码: test123
INSERT INTO users (username, password_hash, role_status, is_active)
VALUES (
  'premium001',
  '$2b$10$C6B8PWbGTcjA1gwi8Ci.YOTOCf09twHLIbNqsrc4VTs/2Q3/HycR2',
  '付费学员',
  true
);

-- 3. 团队长账号
-- 账号: leader001
-- 密码: test123
INSERT INTO users (username, password_hash, role_status, is_active)
VALUES (
  'leader001',
  '$2b$10$C6B8PWbGTcjA1gwi8Ci.YOTOCf09twHLIbNqsrc4VTs/2Q3/HycR2',
  '团队长',
  true
);

-- 查看创建的账号
SELECT username, role_status, is_active, created_at
FROM users
WHERE username IN ('student001', 'premium001', 'leader001');
