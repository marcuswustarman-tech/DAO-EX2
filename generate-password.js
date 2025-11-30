const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'mojie_yc';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n密码哈希值生成成功！\n');
  console.log('='.repeat(80));
  console.log('\nSQL命令（复制到Supabase SQL Editor中执行）：\n');
  console.log(`INSERT INTO users (username, password_hash, role, contact, gender, age, training_start_date)
VALUES ('mojie_yc', '${hash}', '团队长', 'mojie_yc@outlook.com', '男', 30, '2024-01-01');`);
  console.log('\n' + '='.repeat(80));
  console.log('\n登录信息：');
  console.log('账号：mojie_yc');
  console.log('密码：mojie_yc');
  console.log('\n');
}

generateHash();
