import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { canApplyInterview } from '@/lib/permissions';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canApplyInterview(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, age, phone, email } = body;

    // 验证必填字段
    if (!name || !age || !phone || !email) {
      return NextResponse.json(
        { error: '所有字段都是必填项' },
        { status: 400 }
      );
    }

    // 检查是否已经申请过
    const { data: existing } = await supabase
      .from('interview_applications')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: '您已经提交过面试申请' },
        { status: 400 }
      );
    }

    // 创建面试申请
    const { data: application, error: insertError } = await supabase
      .from('interview_applications')
      .insert({
        user_id: session.user.id,
        name,
        age: parseInt(age),
        phone,
        email,
        applied_at: new Date().toISOString(),
        result: '待定',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: '申请失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 更新用户的interview_status
    await supabase
      .from('users')
      .update({ interview_status: '待审核' })
      .eq('id', session.user.id);

    return NextResponse.json({
      success: true,
      application,
    }, { status: 201 });

  } catch (error) {
    console.error('Interview application error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
