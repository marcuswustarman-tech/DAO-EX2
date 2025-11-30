import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 获取所有课程
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (coursesError) throw coursesError;

    // 获取用户的学习进度
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', session.user.id);

    if (progressError) throw progressError;

    // 合并课程和进度数据
    const coursesWithProgress = courses?.map((course) => {
      const userProgress = progress?.find((p) => p.course_id === course.id);
      return {
        ...course,
        userProgress: userProgress || { status: '未开始', progress: 0 },
      };
    });

    return NextResponse.json({ courses: coursesWithProgress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
