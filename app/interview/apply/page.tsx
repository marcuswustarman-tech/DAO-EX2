'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { canApplyInterview } from '@/lib/permissions';

export default function InterviewApplicationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    } else if (session?.user && !canApplyInterview(session.user.role_status as any)) {
      router.push('/');
    }
  }, [status, session, router]);

  // 检查是否已申请过
  useEffect(() => {
    if (session?.user) {
      checkExistingApplication();
      loadUserProfile();
    }
  }, [session]);

  const checkExistingApplication = async () => {
    try {
      const response = await fetch('/api/interview/status');
      const data = await response.json();
      if (data.hasApplication) {
        setAlreadyApplied(true);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      if (data.user) {
        setFormData({
          name: data.user.username || '',
          age: data.user.age?.toString() || '',
          phone: data.user.phone || '',
          email: data.user.contact || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 验证年龄
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 100) {
        setError('请输入有效的年龄（18-100岁）');
        setLoading(false);
        return;
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('请输入有效的手机号码');
        setLoading(false);
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('请输入有效的邮箱地址');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/interview/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          phone: formData.phone,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '申请失败，请稍后重试');
        setLoading(false);
        return;
      }

      // 申请成功
      setSuccess(true);
    } catch (err) {
      console.error('Application error:', err);
      setError('申请失败，请稍后重试');
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

  if (!session?.user || !canApplyInterview(session.user.role_status as any)) {
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
              <h1 className="text-3xl font-serif mb-4">面试申请已提交</h1>
              <p className="text-neutral-400 mb-8">
                我们已收到您的面试申请，团队长将尽快审核并安排面试时间。
              </p>
              <div className="bg-neutral-950 border border-neutral-700 p-6 mb-8 text-left">
                <h2 className="text-lg font-medium mb-4 text-accent">接下来的步骤：</h2>
                <ul className="space-y-3 text-neutral-300">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">1.</span>
                    <span>团队长将审核您的申请信息</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">2.</span>
                    <span>审核通过后，团队长会设置面试时间并通过邮件通知您</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">3.</span>
                    <span>请查收邮件并准时参加面试</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">4.</span>
                    <span>面试通过后，您将成为正式学员</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/console')}
                  className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
                >
                  返回控制台
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 已申请页面
  if (alreadyApplied) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.push('/console')}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                ← 返回控制台
              </button>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-12 text-center">
              <div className="text-6xl mb-6">📋</div>
              <h1 className="text-3xl font-serif mb-4">您已提交过面试申请</h1>
              <p className="text-neutral-400 mb-8">
                您的面试申请正在审核中，请耐心等待团队长安排面试时间。
              </p>
              <button
                onClick={() => router.push('/console')}
                className="px-8 py-3 bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                返回控制台
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 申请表单
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push('/console')}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              ← 返回控制台
            </button>
          </div>

          <h1 className="text-4xl font-serif mb-2">面试申请</h1>
          <p className="text-neutral-400 mb-8">
            填写您的信息以申请面试
          </p>

          <div className="bg-neutral-900 border border-neutral-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-neutral-400 mb-2">
                  姓名 *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入您的真实姓名"
                  required
                  disabled={loading}
                  minLength={2}
                  maxLength={20}
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm text-neutral-400 mb-2">
                  年龄 *
                </label>
                <input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入您的年龄"
                  required
                  disabled={loading}
                  min={18}
                  max={100}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-neutral-400 mb-2">
                  手机号 *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入您的手机号码"
                  required
                  disabled={loading}
                  pattern="^1[3-9]\d{9}$"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-neutral-400 mb-2">
                  邮箱 *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入您的邮箱地址"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-accent text-sm bg-accent/10 border border-accent/20 p-3">
                  {error}
                </div>
              )}

              <div className="text-xs text-neutral-500 bg-neutral-950 p-4 border border-neutral-800">
                <p className="mb-2">📝 面试须知：</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>提交申请后，团队长将审核您的信息</li>
                  <li>审核通过后会通过邮件通知面试时间</li>
                  <li>请保持邮箱和手机畅通</li>
                  <li>面试通过后将升级为正式学员</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '提交中...' : '提交申请'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
