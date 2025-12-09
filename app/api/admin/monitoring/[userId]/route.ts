import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/permissions';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId } = params;

  try {
    // 获取用户信息
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // 获取用户的所有学习记录
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select(`
        *,
        courses:course_id (
          title,
          order_index,
          category
        )
      `)
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });

    if (progressError) throw progressError;

    return NextResponse.json({ user, progress });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
