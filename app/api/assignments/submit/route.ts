import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { canSubmitAssignment } from '@/lib/permissions';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canSubmitAssignment(session.user.role_status as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const stageId = formData.get('stage_id') as string;
    const submissionText = formData.get('submission_text') as string;
    const file = formData.get('file') as File | null;

    if (!stageId || !submissionText) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查该阶段是否已有提交记录
    const { data: existingAssignments } = await supabase
      .from('assignments')
      .select('id, submission_count')
      .eq('user_id', session.user.id)
      .eq('stage_id', stageId)
      .order('created_at', { ascending: false })
      .limit(1);

    const submissionCount = existingAssignments?.length
      ? existingAssignments[0].submission_count + 1
      : 1;

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;

    // 如果有文件，上传到 Supabase Storage
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const storagePath = `assignments/${session.user.id}/${stageId}/${timestamp}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-files')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json(
          { error: '文件上传失败' },
          { status: 500 }
        );
      }

      // 获取公共 URL
      const { data: urlData } = supabase.storage
        .from('student-files')
        .getPublicUrl(storagePath);

      fileUrl = urlData.publicUrl;
      fileName = file.name;
      fileSize = file.size;
    }

    // 插入作业记录
    const { data: assignment, error: insertError } = await supabase
      .from('assignments')
      .insert({
        user_id: session.user.id,
        stage_id: stageId,
        submission_text: submissionText,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        submission_count: submissionCount,
        submitted_at: new Date().toISOString(),
        status: '待审核',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: '提交失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assignment,
    }, { status: 201 });

  } catch (error) {
    console.error('Assignment submission error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
