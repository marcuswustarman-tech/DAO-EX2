require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createTeamLeader() {
  const username = 'teamleader001';
  const password = 'Leader2024';
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({
      username: username,
      password: hashedPassword,
      role_status: '团队长',
      contact: 'leader@mingdao.com',
      age: 30,
      registered_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('创建失败:', error);
  } else {
    console.log('\n✅ 团队长账号创建成功！\n');
    console.log('账号信息：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━');
    console.log('账号：', username);
    console.log('密码：', password);
    console.log('等级：', data.role_status);
    console.log('━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('请使用此账号登录 http://localhost:3000/console\n');
  }

  process.exit(0);
}

createTeamLeader();
