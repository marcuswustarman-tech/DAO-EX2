import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { isActiveStudent } from '@/lib/permissions';

export async function GET(
  request: Request,
  { params }: { params: { stageId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isActiveStudent(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { stageId } = params;

  try {
    const { data: materials, error } = await supabase
      .from('stage_materials')
      .select('*')
      .eq('stage_id', stageId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '获取学习资料失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ materials: materials || [] });

  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
