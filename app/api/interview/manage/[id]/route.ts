import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isTeamLeader } from '@/lib/permissions';
import { sendInterviewScheduledEmail, sendInterviewResultEmail } from '@/lib/email-notifications';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isTeamLeader(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { interview_time, meeting_number, interview_notes, result } = body;

    // 获取当前申请信息
    const { data: currentApp, error: fetchError } = await supabase
      .from('interview_applications')
      .select('*, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !currentApp) {
      return NextResponse.json(
        { error: '未找到面试申请' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (interview_time !== undefined) updateData.interview_time = interview_time;
    if (meeting_number !== undefined) updateData.meeting_number = meeting_number;
    if (interview_notes !== undefined) updateData.interview_notes = interview_notes;

    // 如果结果改变，记录审核信息
    if (result !== undefined && result !== currentApp.result) {
      updateData.result = result;
      updateData.reviewed_at = new Date().toISOString();
      updateData.reviewed_by = session.user.id;

      // 根据面试结果更新用户状态
      if (result === '通过') {
        // 升级为正式学员
        await supabase
          .from('users')
          .update({
            role_status: '学员',
            interview_status: '已通过'
          })
          .eq('id', currentApp.user_id);
      } else if (result === '未通过') {
        // 保持准学员状态
        await supabase
          .from('users')
          .update({
            interview_status: '未通过'
          })
          .eq('id', currentApp.user_id);
      }
    }

    // 更新面试申请
    const { data: application, error: updateError } = await supabase
      .from('interview_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: '更新失败' },
        { status: 500 }
      );
    }

    // 发送邮件通知
    try {
      // 如果设置了面试时间，发送面试安排通知
      if (interview_time && interview_time !== currentApp.interview_time) {
        await sendInterviewScheduledEmail({
          email: currentApp.email,
          name: currentApp.name,
          interviewTime: interview_time,
          meetingNumber: meeting_number || '',
          notes: interview_notes || undefined,
        });
      }

      // 如果结果改变，发送面试结果通知
      if (result !== undefined && result !== currentApp.result && result !== '待定') {
        await sendInterviewResultEmail({
          email: currentApp.email,
          name: currentApp.name,
          result,
        });
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // 邮件发送失败不影响主流程
    }

    return NextResponse.json({ application });

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
