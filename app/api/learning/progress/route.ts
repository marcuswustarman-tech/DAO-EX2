import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isActiveStudent } from '@/lib/permissions';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isActiveStudent(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { stage_id } = body;

    if (!stage_id) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查是否已经存在进度记录
    const { data: existing } = await supabase
      .from('stage_progress')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('stage_id', stage_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: '已经开始该阶段学习' },
        { status: 400 }
      );
    }

    // 创建新的进度记录
    const { data: progress, error: insertError } = await supabase
      .from('stage_progress')
      .insert({
        user_id: session.user.id,
        stage_id,
        status: '进行中',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: '创建学习记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress }, { status: 201 });

  } catch (error) {
    console.error('Error creating progress:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
