'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/permissions';

export default function ConsolePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('账号或密码错误');
      } else {
        // 登录成功，刷新页面
        window.location.reload();
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 加载中
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  // 已登录 - 显示个人信息
  if (session?.user) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-serif mb-8 text-center">控制台</h1>

            <div className="bg-neutral-900 border border-neutral-800 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-medium mb-4">个人信息</h2>
                <div className="space-y-3 text-neutral-300">
                  <div className="flex">
                    <span className="w-24 text-neutral-500">账号：</span>
                    <span>{session.user.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-neutral-500">等级：</span>
                    <span className="text-accent">{session.user.role}</span>
                  </div>
                </div>
              </div>

              {/* 团队长专属：学员后台控制系统入口 */}
              {isAdmin(session.user.role as any) && (
                <div className="mt-8 pt-8 border-t border-neutral-800">
                  <button
                    onClick={() => router.push('/admin')}
                    className="w-full px-6 py-4 bg-accent text-white font-medium hover:bg-accent/90 transition-colors mb-4"
                  >
                    进入学员后台控制系统
                  </button>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-neutral-800">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 未登录 - 显示登录表单
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-serif mb-8 text-center">控制台登录</h1>

        <div className="bg-neutral-900 border border-neutral-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm text-neutral-400 mb-2">
                账号
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="请输入账号"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-neutral-400 mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="请输入密码"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-accent text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            请输入您的账号和密码
          </div>
        </div>
      </div>
    </div>
  );
}
