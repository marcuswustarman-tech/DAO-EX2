require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestAccounts() {
  const accounts = [
    {
      username: 'student001',
      password: 'test123',
      role_status: '学员'
    },
    {
      username: 'premium001',
      password: 'test123',
      role_status: '付费学员'
    },
    {
      username: 'leader001',
      password: 'test123',
      role_status: '团队长'
    }
  ];

  console.log('Creating test accounts...\n');

  for (const account of accounts) {
    try {
      // 生成密码哈希
      const passwordHash = await bcrypt.hash(account.password, 10);

      // 检查用户是否已存在
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', account.username)
        .single();

      if (existing) {
        console.log(`❌ 用户 ${account.username} 已存在，跳过`);
        continue;
      }

      // 插入用户
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: account.username,
          password: passwordHash,
          role_status: account.role_status,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ 创建 ${account.username} 失败:`, error.message);
      } else {
        console.log(`✅ 创建成功: ${account.username}`);
        console.log(`   角色: ${account.role_status}`);
        console.log(`   密码: ${account.password}`);
        console.log('');
      }
    } catch (err) {
      console.error(`❌ 创建 ${account.username} 时出错:`, err.message);
    }
  }

  console.log('\n=== 测试账号信息 ===\n');
  console.log('学员账号:');
  console.log('  账号: student001');
  console.log('  密码: test123');
  console.log('');
  console.log('付费学员账号:');
  console.log('  账号: premium001');
  console.log('  密码: test123');
  console.log('');
  console.log('团队长账号:');
  console.log('  账号: leader001');
  console.log('  密码: test123');
  console.log('');
  console.log('登录地址: https://www.mingdaotrade.cn/console');
}

createTestAccounts()
  .then(() => {
    console.log('完成！');
    process.exit(0);
  })
  .catch((err) => {
    console.error('错误:', err);
    process.exit(1);
  });
