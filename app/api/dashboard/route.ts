import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isActiveStudent, isTeamLeader, canApplyInterview } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 如果role_status未定义，默认为准学员
  let roleStatus = session.user.role_status as any;
  if (!roleStatus || roleStatus === 'undefined') {
    roleStatus = '准学员';
  }

  const userId = session.user.id;

  try {
    // 统一数据结构
    const dashboardData: any = {
      user: {
        id: userId,
        name: session.user.name,
        roleStatus: roleStatus
      },
      permissions: {
        canApplyInterview: canApplyInterview(roleStatus),
        canAccessLearning: isActiveStudent(roleStatus),
        isTeamLeader: isTeamLeader(roleStatus)
      }
    };

    // 准学员数据：面试申请状态
    if (canApplyInterview(roleStatus)) {
      const { data: interviewApplication } = await supabase
        .from('interview_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      dashboardData.interviewApplication = interviewApplication || null;
    }

    // 学员数据：学习进度、作业等
    if (isActiveStudent(roleStatus)) {
      // 获取学习阶段
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
          currentStage = { ...stage, progress: stageProgress };
          break;
        }
      }

      if (!currentStage && stages && stages.length > 0) {
        currentStage = {
          ...stages[stages.length - 1],
          progress: progressMap[stages[stages.length - 1].id]
        };
      }

      // 待提交作业
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

      // 最近审核结果
      const { data: recentReviews } = await supabase
        .from('assignments')
        .select(`*, stage:learning_stages!inner(stage_name)`)
        .eq('user_id', userId)
        .not('status', 'eq', '待审核')
        .order('submitted_at', { ascending: false })
        .limit(3);

      // 学习统计
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

      const { count: completedAssignments } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', '已通过');

      dashboardData.learning = {
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
      };
    }

    // 团队长数据：管理统计
    if (isTeamLeader(roleStatus)) {
      const { count: pendingAssignments } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('status', '待审核');

      const { count: pendingInterviews } = await supabase
        .from('interview_applications')
        .select('*', { count: 'exact', head: true })
        .eq('result', '待定');

      const { count: totalStudents } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .in('role_status', ['学员', '付费学员', '交易员']);

      const { count: prospectiveStudents } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role_status', '准学员');

      const { data: recentAssignments } = await supabase
        .from('assignments')
        .select(`*, user:users!inner(username), stage:learning_stages!inner(stage_name)`)
        .eq('status', '待审核')
        .order('submitted_at', { ascending: false })
        .limit(5);

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data: stuckStudents } = await supabase
        .from('stage_progress')
        .select(`*, user:users!inner(username, role_status), stage:learning_stages!inner(stage_name)`)
        .eq('status', '进行中')
        .lt('started_at', threeDaysAgo.toISOString())
        .limit(5);

      dashboardData.management = {
        stats: {
          pendingAssignments: pendingAssignments || 0,
          pendingInterviews: pendingInterviews || 0,
          totalStudents: totalStudents || 0,
          prospectiveStudents: prospectiveStudents || 0
        },
        recentAssignments: recentAssignments || [],
        stuckStudents: stuckStudents || []
      };
    }

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}
