import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { canReviewAssignment } from '@/lib/permissions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canReviewAssignment(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // 获取所有作业，包含用户和阶段信息
    const { data: assignments, error } = await supabase
      .from('assignments')
      .select(`
        *,
        user:users!inner(username),
        stage:learning_stages!inner(stage_name)
      `)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '获取作业列表失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ assignments: assignments || [] });

  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
