import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { hash } from 'bcryptjs';
import { isAdmin } from '@/lib/permissions';

// 获取所有学员
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.role as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, role, contact, gender, age, training_start_date, created_at, is_active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 创建新学员
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.role as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, password, role, contact, gender, age, training_start_date } = body;

    // 验证必填字段
    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 加密密码
    const password_hash = await hash(password, 10);

    // 插入新用户
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash,
        role,
        contact,
        gender,
        age,
        training_start_date,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // unique violation
        return NextResponse.json({ error: '用户名已存在' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
