import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { canReviewAssignment } from '@/lib/permissions';
import { sendAssignmentReviewEmail } from '@/lib/email-notifications';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canReviewAssignment(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { result, comment } = body;

    if (!result || !comment) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 获取作业信息
    const { data: assignment, error: fetchError } = await supabase
      .from('assignments')
      .select('*, user_id, stage_id')
      .eq('id', id)
      .single();

    if (fetchError || !assignment) {
      return NextResponse.json(
        { error: '未找到作业' },
        { status: 404 }
      );
    }

    // 更新作业状态
    const newStatus = result === '通过' ? '已通过' : '未通过';
    const { error: updateError } = await supabase
      .from('assignments')
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.user.id,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: '更新作业状态失败' },
        { status: 500 }
      );
    }

    // 插入审核评论
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        assignment_id: id,
        reviewer_id: session.user.id,
        result: newStatus,
        comment,
      });

    if (reviewError) {
      console.error('Database insert error:', reviewError);
    }

    // 如果通过，更新阶段进度
    if (result === '通过') {
      const { error: progressError } = await supabase
        .from('stage_progress')
        .update({
          status: '已完成',
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', assignment.user_id)
        .eq('stage_id', assignment.stage_id);

      if (progressError) {
        console.error('Progress update error:', progressError);
      }
    }

    // 发送邮件通知
    try {
      // 获取用户和阶段信息用于邮件
      const { data: userData } = await supabase
        .from('users')
        .select('username, contact')
        .eq('id', assignment.user_id)
        .single();

      const { data: stageData } = await supabase
        .from('learning_stages')
        .select('stage_name')
        .eq('id', assignment.stage_id)
        .single();

      if (userData?.contact && stageData?.stage_name) {
        await sendAssignmentReviewEmail({
          email: userData.contact,
          username: userData.username,
          stageName: stageData.stage_name,
          result: newStatus,
          comment,
        });
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // 邮件发送失败不影响主流程
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error reviewing assignment:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
