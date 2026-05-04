const bcrypt = require('bcryptjs');

async function generateHash() {
  const username = 'student01';
  const password = 'student01';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n密码哈希值生成成功！\n');
  console.log('='.repeat(80));
  console.log('\nSQL命令（复制到Supabase SQL Editor中执行）：\n');
  console.log(`INSERT INTO users (username, password_hash, role_status, contact, gender, age, training_start_date)
VALUES ('${username}', '${hash}', '学员', 'student01@example.com', '男', 25, '2024-12-02');`);
  console.log('\n' + '='.repeat(80));
  console.log('\n登录信息：');
  console.log(`账号：${username}`);
  console.log(`密码：${password}`);
  console.log('\n');
}

generateHash();
