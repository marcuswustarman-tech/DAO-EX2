import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    // 获取课程信息
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (courseError) throw courseError;

    // 获取或创建用户进度
    let { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('course_id', id)
      .single();

    // 如果没有进度记录，创建一个
    if (!progress) {
      const { data: newProgress, error: createError } = await supabase
        .from('user_progress')
        .insert({
          user_id: session.user.id,
          course_id: id,
          status: '学习中',
          progress: 0,
        })
        .select()
        .single();

      if (createError) throw createError;
      progress = newProgress;
    }

    return NextResponse.json({ course, progress });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 更新进度
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { status, progress: progressValue } = await request.json();

  try {
    const updateData: any = {
      last_accessed: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
      if (status === '已完成') {
        updateData.completed_at = new Date().toISOString();
        updateData.progress = 100;
      }
    }

    if (progressValue !== undefined) {
      updateData.progress = progressValue;
    }

    const { data, error } = await supabase
      .from('user_progress')
      .update(updateData)
      .eq('user_id', session.user.id)
      .eq('course_id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ progress: data });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
