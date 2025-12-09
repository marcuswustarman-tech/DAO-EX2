import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('username, age, phone, contact, role_status, interview_status')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '获取用户信息失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
