'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isTeamLeader } from '@/lib/permissions';

interface InterviewApplication {
  id: string;
  user_id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  applied_at: string;
  interview_time: string | null;
  meeting_number: string | null;
  interview_notes: string | null;
  result: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export default function InterviewManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<InterviewApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<InterviewApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  const [formData, setFormData] = useState({
    interview_time: '',
    meeting_number: '',
    interview_notes: '',
    result: '待定',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    } else if (session?.user && !isTeamLeader(session.user.role_status as any)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user && isTeamLeader(session.user.role_status as any)) {
      fetchApplications();
    }
  }, [session]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/interview/manage');
      const data = await response.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (app: InterviewApplication) => {
    setEditingApp(app);
    setFormData({
      interview_time: app.interview_time || '',
      meeting_number: app.meeting_number || '',
      interview_notes: app.interview_notes || '',
      result: app.result || '待定',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      const response = await fetch(`/api/interview/manage/${editingApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchApplications();
        setEditingApp(null);
        alert('更新成功！');
      } else {
        const data = await response.json();
        alert(data.error || '更新失败');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('更新失败');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (!session?.user || !isTeamLeader(session.user.role_status as any)) {
    return null;
  }

  const filteredApplications = filterStatus === '全部'
    ? applications
    : applications.filter(app => app.result === filterStatus);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-serif">面试管理</h1>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              返回管理后台
            </button>
          </div>

          {/* 筛选器 */}
          <div className="mb-6 flex gap-2">
            {['全部', '待定', '通过', '未通过'].map((status) => (
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

          {/* 申请列表 */}
          <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-neutral-400 font-normal">姓名</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">年龄</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">手机号</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">邮箱</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">申请时间</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">面试时间</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">结果</th>
                  <th className="text-left p-4 text-neutral-400 font-normal">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="p-4">{app.name}</td>
                    <td className="p-4 text-neutral-400">{app.age}</td>
                    <td className="p-4 text-neutral-400">{app.phone}</td>
                    <td className="p-4 text-neutral-400">{app.email}</td>
                    <td className="p-4 text-neutral-400">
                      {new Date(app.applied_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="p-4 text-neutral-400">
                      {app.interview_time
                        ? new Date(app.interview_time).toLocaleString('zh-CN')
                        : '未设置'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-sm ${
                        app.result === '通过' ? 'bg-green-500/20 text-green-400' :
                        app.result === '未通过' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {app.result}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => startEdit(app)}
                        className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        管理
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredApplications.length === 0 && (
              <div className="p-12 text-center text-neutral-500">
                暂无面试申请
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 编辑弹窗 */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-medium mb-6">管理面试申请：{editingApp.name}</h2>

            {/* 申请人信息 */}
            <div className="bg-neutral-950 border border-neutral-700 p-4 mb-6">
              <h3 className="text-lg font-medium mb-3 text-accent">申请人信息</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-neutral-500">姓名：</span>
                  <span>{editingApp.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500">年龄：</span>
                  <span>{editingApp.age}</span>
                </div>
                <div>
                  <span className="text-neutral-500">手机号：</span>
                  <span>{editingApp.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-500">邮箱：</span>
                  <span>{editingApp.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">申请时间：</span>
                  <span>{new Date(editingApp.applied_at).toLocaleString('zh-CN')}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">面试时间</label>
                <input
                  type="datetime-local"
                  value={formData.interview_time}
                  onChange={(e) => setFormData({ ...formData, interview_time: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">腾讯会议号</label>
                <input
                  type="text"
                  value={formData.meeting_number}
                  onChange={(e) => setFormData({ ...formData, meeting_number: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent"
                  placeholder="请输入会议号"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">面试备注</label>
                <textarea
                  value={formData.interview_notes}
                  onChange={(e) => setFormData({ ...formData, interview_notes: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent h-32"
                  placeholder="请输入面试相关备注、须知等信息"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">面试结果</label>
                <select
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent"
                >
                  <option>待定</option>
                  <option>通过</option>
                  <option>未通过</option>
                </select>
              </div>

              <div className="text-sm text-neutral-500 bg-neutral-950 p-4 border border-neutral-800">
                <p className="mb-2">⚠️ 操作说明：</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>设置面试时间和会议号后，系统将通过邮件通知申请人</li>
                  <li>标记为"通过"后，申请人将自动升级为"学员"</li>
                  <li>标记为"未通过"后，申请人状态保持"准学员"</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90"
                >
                  保存更新
                </button>
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
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
