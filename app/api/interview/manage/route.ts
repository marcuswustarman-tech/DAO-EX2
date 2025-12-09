import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isTeamLeader } from '@/lib/permissions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isTeamLeader(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { data: applications, error } = await supabase
      .from('interview_applications')
      .select('*')
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '获取面试申请失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
