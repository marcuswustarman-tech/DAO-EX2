require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createUser(username, password, roleStatus) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({
      username: username,
      password_hash: hashedPassword,
      role_status: roleStatus,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error(`❌ 创建 ${username} 失败:`, error.message);
    return false;
  } else {
    console.log(`✅ 创建成功: ${username} (${roleStatus})`);
    return true;
  }
}

async function main() {
  console.log('开始创建测试账号...\n');

  await createUser('student001', 'test123', '学员');
  await createUser('premium001', 'test123', '付费学员');
  await createUser('leader001', 'test123', '团队长');

  console.log('\n=== 测试账号信息 ===\n');
  console.log('学员账号:');
  console.log('  账号: student001');
  console.log('  密码: test123\n');

  console.log('付费学员账号:');
  console.log('  账号: premium001');
  console.log('  密码: test123\n');

  console.log('团队长账号:');
  console.log('  账号: leader001');
  console.log('  密码: test123\n');

  console.log('登录地址: https://www.mingdaotrade.cn/console\n');
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
