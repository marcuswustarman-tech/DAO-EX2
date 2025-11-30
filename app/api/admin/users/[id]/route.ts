import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { hash } from 'bcryptjs';
import { isAdmin } from '@/lib/permissions';

// 更新学员信息
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.role as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { username, password, role, contact, gender, age, training_start_date, is_active } = body;

    const updateData: any = {};

    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (contact !== undefined) updateData.contact = contact;
    if (gender !== undefined) updateData.gender = gender;
    if (age !== undefined) updateData.age = age;
    if (training_start_date !== undefined) updateData.training_start_date = training_start_date;
    if (is_active !== undefined) updateData.is_active = is_active;

    // 如果提供了新密码，加密它
    if (password) {
      updateData.password_hash = await hash(password, 10);
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: '用户名已存在' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 删除学员
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.role as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
