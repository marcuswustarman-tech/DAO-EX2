import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isActiveStudent } from '@/lib/permissions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isActiveStudent(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // 获取所有学习阶段
    const { data: stages, error: stagesError } = await supabase
      .from('learning_stages')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (stagesError) {
      console.error('Database error:', stagesError);
      return NextResponse.json(
        { error: '获取学习阶段失败' },
        { status: 500 }
      );
    }

    // 获取用户的学习进度
    const { data: progressData, error: progressError } = await supabase
      .from('stage_progress')
      .select('*')
      .eq('user_id', session.user.id);

    if (progressError) {
      console.error('Database error:', progressError);
    }

    // 将进度数据转换为以 stage_id 为键的对象
    const progressMap: Record<string, any> = {};
    if (progressData) {
      progressData.forEach(p => {
        progressMap[p.stage_id] = p;
      });
    }

    return NextResponse.json({
      stages: stages || [],
      progress: progressMap,
    });

  } catch (error) {
    console.error('Error fetching stages:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
