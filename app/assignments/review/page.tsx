'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { canReviewAssignment } from '@/lib/permissions';

interface Assignment {
  id: string;
  user_id: string;
  stage_id: string;
  submission_text: string;
  file_url: string | null;
  file_name: string | null;
  submission_count: number;
  submitted_at: string;
  status: string;
  user: {
    username: string;
  };
  stage: {
    stage_name: string;
  };
}

interface Review {
  id: string;
  result: string;
  comment: string;
  created_at: string;
}

export default function ReviewAssignmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingAssignment, setReviewingAssignment] = useState<Assignment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('待审核');

  const [reviewForm, setReviewForm] = useState({
    result: '通过',
    comment: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    } else if (session?.user && !canReviewAssignment(session.user.role_status as any)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user && canReviewAssignment(session.user.role_status as any)) {
      fetchAssignments();
    }
  }, [session]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments/review');
      const data = await response.json();
      if (data.assignments) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const startReview = (assignment: Assignment) => {
    setReviewingAssignment(assignment);
    setReviewForm({
      result: '通过',
      comment: '',
    });
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingAssignment) return;

    try {
      const response = await fetch(`/api/assignments/review/${reviewingAssignment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });

      if (response.ok) {
        await fetchAssignments();
        setReviewingAssignment(null);
        alert('审核完成！');
      } else {
        const data = await response.json();
        alert(data.error || '审核失败');
      }
    } catch (error) {
      console.error('Error reviewing assignment:', error);
      alert('审核失败');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (!session?.user || !canReviewAssignment(session.user.role_status as any)) {
    return null;
  }

  const filteredAssignments = filterStatus === '全部'
    ? assignments
    : assignments.filter(a => a.status === filterStatus);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-serif">作业审核</h1>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              返回管理后台
            </button>
          </div>

          {/* 筛选器 */}
          <div className="mb-6 flex gap-2">
            {['全部', '待审核', '已通过', '未通过'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 ${
                  filterStatus === status
                    ? 'bg-accent text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                } transition-colors`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* 作业列表 */}
          <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-neutral-400 font-normal">学员</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">阶段</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">提交次数</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">提交时间</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">附件</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">状态</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="p-4">{assignment.user.username}</td>
                    <td className="p-4 text-neutral-400">{assignment.stage.stage_name}</td>
                    <td className="p-4 text-neutral-400">第 {assignment.submission_count} 次</td>
                    <td className="p-4 text-neutral-400">
                      {new Date(assignment.submitted_at).toLocaleString('zh-CN')}
                    </td>
                    <td className="p-4">
                      {assignment.file_url ? (
                        <a
                          href={assignment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          {assignment.file_name}
                        </a>
                      ) : (
                        <span className="text-neutral-500 text-sm">无附件</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-sm ${
                        assignment.status === '已通过' ? 'bg-green-500/20 text-green-400' :
                        assignment.status === '未通过' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => startReview(assignment)}
                        className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAssignments.length === 0 && (
              <div className="p-12 text-center text-neutral-500">
                暂无{filterStatus !== '全部' ? filterStatus : ''}作业
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 审核弹窗 */}
      {reviewingAssignment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 max-w-4xl w-full p-8 my-8">
            <h2 className="text-2xl font-medium mb-6">审核作业</h2>

            {/* 学员信息 */}
            <div className="bg-neutral-950 border border-neutral-700 p-4 mb-6">
              <h3 className="text-lg font-medium mb-3 text-accent">学员信息</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-neutral-500">学员：</span>
                  <span>{reviewingAssignment.user.username}</span>
                </div>
                <div>
                  <span className="text-neutral-500">阶段：</span>
                  <span>{reviewingAssignment.stage.stage_name}</span>
                </div>
                <div>
                  <span className="text-neutral-500">提交次数：</span>
                  <span>第 {reviewingAssignment.submission_count} 次</span>
                </div>
                <div>
                  <span className="text-neutral-500">提交时间：</span>
                  <span>{new Date(reviewingAssignment.submitted_at).toLocaleString('zh-CN')}</span>
                </div>
              </div>
            </div>

            {/* 作业内容 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">作业内容</h3>
              <div className="bg-neutral-950 border border-neutral-700 p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-300">
                  {reviewingAssignment.submission_text}
                </pre>
              </div>
            </div>

            {/* 附件 */}
            {reviewingAssignment.file_url && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">附件</h3>
                <div className="bg-neutral-950 border border-neutral-700 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{reviewingAssignment.file_name}</div>
                    <div className="text-sm text-neutral-500">
                      {reviewingAssignment.file_url.includes('supabase') ? 'Supabase 存储' : '外部链接'}
                    </div>
                  </div>
                  <a
                    href={reviewingAssignment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors text-sm"
                  >
                    打开文件
                  </a>
                </div>
              </div>
            )}

            {/* 审核表单 */}
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">审核结果 *</label>
                <select
                  value={reviewForm.result}
                  onChange={(e) => setReviewForm({ ...reviewForm, result: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent"
                  required
                >
                  <option>通过</option>
                  <option>未通过</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">审核评论 *</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent h-32"
                  placeholder="请输入审核意见和反馈..."
                  required
                />
              </div>

              <div className="text-sm text-neutral-500 bg-neutral-950 p-4 border border-neutral-800">
                <p className="mb-2">⚠️ 审核说明：</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>标记为"通过"后，学员将收到邮件通知</li>
                  <li>标记为"未通过"后，学员可以重新提交</li>
                  <li>审核评论将显示给学员，请给出建设性反馈</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90"
                >
                  提交审核
                </button>
                <button
                  type="button"
                  onClick={() => setReviewingAssignment(null)}
                  className="flex-1 px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
