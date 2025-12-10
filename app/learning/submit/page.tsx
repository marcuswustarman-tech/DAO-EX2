'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { canSubmitAssignment } from '@/lib/permissions';

const ALLOWED_FILE_TYPES = [
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
];

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

function SubmitAssignmentForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageId = searchParams.get('stage');

  const [submissionText, setSubmissionText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    } else if (session?.user && !canSubmitAssignment(session.user.role_status as any)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!stageId) {
      router.push('/learning');
    }
  }, [stageId, router]);

  const validateFile = (file: File): string | null => {
    // 检查文件类型
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return '只支持 Word、Excel、PPT 格式文件';
    }

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      return '文件大小不能超过 3MB';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setFileError(error);
        setFile(null);
        e.target.value = '';
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!submissionText.trim()) {
        setError('请填写作业内容');
        setLoading(false);
        return;
      }

      // 如果有文件，先验证
      if (file) {
        const fileValidation = validateFile(file);
        if (fileValidation) {
          setError(fileValidation);
          setLoading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('stage_id', stageId || '');
      formData.append('submission_text', submissionText);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '提交失败，请稍后重试');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (!session?.user || !canSubmitAssignment(session.user.role_status as any)) {
    return null;
  }

  // 成功页面
  if (success) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-900 border border-neutral-800 p-12 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-3xl font-serif mb-4">作业提交成功</h1>
              <p className="text-neutral-400 mb-8">
                您的作业已提交，等待团队长审核。审核结果将通过邮件通知您。
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/learning')}
                  className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
                >
                  返回学习中心
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setSubmissionText('');
                    setFile(null);
                  }}
                  className="w-full px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  再次提交
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 提交表单
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push('/learning')}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              ← 返回学习中心
            </button>
          </div>

          <h1 className="text-4xl font-serif mb-2">提交作业</h1>
          <p className="text-neutral-400 mb-8">
            完成本阶段的学习作业
          </p>

          <div className="bg-neutral-900 border border-neutral-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="submission" className="block text-sm text-neutral-400 mb-2">
                  作业内容 *
                </label>
                <textarea
                  id="submission"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors h-64 resize-y"
                  placeholder="请输入您的作业内容..."
                  required
                  disabled={loading}
                />
                <div className="text-xs text-neutral-500 mt-1">
                  {submissionText.length} 字符
                </div>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm text-neutral-400 mb-2">
                  附件（可选）
                </label>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-accent file:text-white file:cursor-pointer hover:file:bg-accent/90"
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  disabled={loading}
                />
                <div className="text-xs text-neutral-500 mt-1">
                  支持 Word、Excel、PPT 格式，单个文件不超过 3MB
                </div>
                {fileError && (
                  <div className="text-accent text-sm mt-2">{fileError}</div>
                )}
                {file && !fileError && (
                  <div className="text-sm text-green-400 mt-2">
                    ✓ 已选择：{file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </div>
                )}
              </div>

              {error && (
                <div className="text-accent text-sm bg-accent/10 border border-accent/20 p-3">
                  {error}
                </div>
              )}

              <div className="text-xs text-neutral-500 bg-neutral-950 p-4 border border-neutral-800">
                <p className="mb-2">📝 提交须知：</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>请认真完成作业，确保内容完整准确</li>
                  <li>如文件过大或格式特殊，请通过邮件发送</li>
                  <li>可以多次提交，每次提交会覆盖之前的内容</li>
                  <li>团队长审核后会通过邮件通知您</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '提交中...' : '提交作业'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubmitAssignmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    }>
      <SubmitAssignmentForm />
    </Suspense>
  );
}
