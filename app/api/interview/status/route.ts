import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { data: application } = await supabase
      .from('interview_applications')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    return NextResponse.json({
      hasApplication: !!application,
      application: application || null,
    });

  } catch (error) {
    console.error('Error checking interview status:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
