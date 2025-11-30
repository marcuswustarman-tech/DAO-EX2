import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/permissions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session.user.role as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // 获取所有学员
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, role')
      .order('username', { ascending: true });

    if (usersError) throw usersError;

    // 获取所有课程
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .eq('is_published', true);

    if (coursesError) throw coursesError;

    const totalCourses = courses?.length || 0;

    // 获取所有学习进度
    const { data: allProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('user_id, status, last_accessed');

    if (progressError) throw progressError;

    // 统计每个学员的进度
    const userStats = users?.map((user) => {
      const userProgress = allProgress?.filter((p) => p.user_id === user.id) || [];
      const completedCount = userProgress.filter((p) => p.status === '已完成').length;
      const overallProgress = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

      // 找到最后学习时间
      const lastAccessed = userProgress
        .map((p) => p.last_accessed)
        .filter(Boolean)
        .sort()
        .reverse()[0];

      return {
        id: user.id,
        username: user.username,
        role: user.role,
        totalProgress: overallProgress,
        completedCourses: completedCount,
        totalCourses,
        lastStudyTime: lastAccessed || null,
      };
    });

    return NextResponse.json({ stats: userStats });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
