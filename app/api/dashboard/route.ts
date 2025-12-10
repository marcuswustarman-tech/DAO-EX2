import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isActiveStudent, isTeamLeader, canApplyInterview } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

// 学员Dashboard数据
async function getStudentDashboard(userId: string) {
  try {
    // 获取所有学习阶段
    const { data: stages } = await supabase
      .from('learning_stages')
      .select('*')
      .order('order_index', { ascending: true });

    // 获取学习进度
    const { data: progress } = await supabase
      .from('stage_progress')
      .select('*')
      .eq('user_id', userId);

    // 计算总进度
    const totalStages = stages?.length || 0;
    const completedStages = progress?.filter(p => p.status === '已完成').length || 0;
    const progressPercentage = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

    // 找到当前阶段
    const progressMap = (progress || []).reduce((acc: any, p: any) => {
      acc[p.stage_id] = p;
      return acc;
    }, {});

    let currentStage = null;
    for (const stage of stages || []) {
      const stageProgress = progressMap[stage.id];
      if (!stageProgress || stageProgress.status !== '已完成') {
        currentStage = {
          ...stage,
          progress: stageProgress
        };
        break;
      }
    }

    // 如果全部完成，取最后一个阶段
    if (!currentStage && stages && stages.length > 0) {
      currentStage = {
        ...stages[stages.length - 1],
        progress: progressMap[stages[stages.length - 1].id]
      };
    }

    // 获取待提交的作业（当前阶段进行中但没有提交作业）
    let pendingAssignments: any[] = [];
    if (currentStage && currentStage.progress?.status === '进行中') {
      const { data: assignments } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', userId)
        .eq('stage_id', currentStage.id)
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (!assignments || assignments.length === 0) {
        pendingAssignments = [currentStage];
      }
    }

    // 获取最近的作业审核结果
    const { data: recentReviews } = await supabase
      .from('assignments')
      .select(`
        *,
        stage:learning_stages!inner(stage_name)
      `)
      .eq('user_id', userId)
      .not('status', 'eq', '待审核')
      .order('submitted_at', { ascending: false })
      .limit(3);

    // 学习天数
    const { data: user } = await supabase
      .from('users')
      .select('registered_at')
      .eq('id', userId)
      .single();

    let learningDays = 0;
    if (user?.registered_at) {
      const registeredDate = new Date(user.registered_at);
      const today = new Date();
      learningDays = Math.floor((today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    // 作业完成数
    const { count: completedAssignments } = await supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', '已通过');

    return NextResponse.json({
      type: 'student',
      progress: {
        total: totalStages,
        completed: completedStages,
        percentage: progressPercentage
      },
      currentStage,
      pendingAssignments,
      recentReviews: recentReviews || [],
      stats: {
        learningDays,
        completedAssignments: completedAssignments || 0
      }
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}

// 准学员Dashboard数据
async function getProspectiveStudentDashboard(userId: string) {
  try {
    // 获取面试申请状态
    const { data: interviewApplication } = await supabase
      .from('interview_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      type: 'prospective_student',
      interviewApplication: interviewApplication || null
    });
  } catch (error) {
    console.error('Error fetching prospective student dashboard:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}

// 团队长Dashboard数据
async function getTeamLeaderDashboard() {
  try {
    // 待审核作业数量
    const { count: pendingAssignments } = await supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true })
      .eq('status', '待审核');

    // 待处理面试申请数量
    const { count: pendingInterviews } = await supabase
      .from('interview_applications')
      .select('*', { count: 'exact', head: true })
      .eq('result', '待定');

    // 学员统计
    const { count: totalStudents } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('role_status', ['学员', '付费学员', '交易员']);

    const { count: prospectiveStudents } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role_status', '准学员');

    // 最近需要审核的作业（最新5个）
    const { data: recentAssignments } = await supabase
      .from('assignments')
      .select(`
        *,
        user:users!inner(username),
        stage:learning_stages!inner(stage_name)
      `)
      .eq('status', '待审核')
      .order('submitted_at', { ascending: false })
      .limit(5);

    // 需要关注的学员（阶段停滞超过3天的）
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: stuckStudents } = await supabase
      .from('stage_progress')
      .select(`
        *,
        user:users!inner(username, role_status),
        stage:learning_stages!inner(stage_name)
      `)
      .eq('status', '进行中')
      .lt('started_at', threeDaysAgo.toISOString())
      .limit(5);

    return NextResponse.json({
      type: 'team_leader',
      stats: {
        pendingAssignments: pendingAssignments || 0,
        pendingInterviews: pendingInterviews || 0,
        totalStudents: totalStudents || 0,
        prospectiveStudents: prospectiveStudents || 0
      },
      recentAssignments: recentAssignments || [],
      stuckStudents: stuckStudents || []
    });
  } catch (error) {
    console.error('Error fetching team leader dashboard:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const roleStatus = session.user.role_status as any;
  console.log('Dashboard API - User role_status:', roleStatus);
  console.log('Dashboard API - User ID:', session.user.id);
  console.log('Dashboard API - isTeamLeader:', isTeamLeader(roleStatus));
  console.log('Dashboard API - isActiveStudent:', isActiveStudent(roleStatus));
  console.log('Dashboard API - canApplyInterview:', canApplyInterview(roleStatus));

  // 团队长Dashboard
  if (isTeamLeader(roleStatus)) {
    return getTeamLeaderDashboard();
  }

  // 学员Dashboard
  if (isActiveStudent(roleStatus)) {
    return getStudentDashboard(session.user.id);
  }

  // 准学员Dashboard
  if (canApplyInterview(roleStatus)) {
    return getProspectiveStudentDashboard(session.user.id);
  }

  console.error('Dashboard API - No matching role for:', roleStatus);
  return NextResponse.json({
    error: `No dashboard available for role: ${roleStatus}`,
    debug: {
      roleStatus,
      isTeamLeader: isTeamLeader(roleStatus),
      isActiveStudent: isActiveStudent(roleStatus),
      canApplyInterview: canApplyInterview(roleStatus)
    }
  }, { status: 403 });
}
