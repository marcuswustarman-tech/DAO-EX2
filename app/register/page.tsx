'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
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
  const [credentials, setCredentials] = useState({ username: '', password: '' });

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

      // 验证手机号格式（简单验证）
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

      const response = await fetch('/api/register', {
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
        setError(data.error || '注册失败，请稍后重试');
        setLoading(false);
        return;
      }

      // 注册成功
      setCredentials({
        username: data.username,
        password: data.password,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 成功页面
  if (success) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-neutral-900 border border-neutral-800 p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-serif mb-2">注册成功！</h1>
              <p className="text-neutral-400">您的账号已创建</p>
            </div>

            <div className="bg-neutral-950 border border-neutral-700 p-6 mb-6">
              <h2 className="text-lg font-medium mb-4 text-accent">请妥善保管您的登录信息</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-neutral-500 mb-1">账号</div>
                  <div className="text-lg font-mono">{credentials.username}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500 mb-1">密码</div>
                  <div className="text-lg font-mono">{credentials.password}</div>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mt-4">
                ⚠️ 请截图或记录此信息，此密码不会再次显示
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/console')}
                className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
              >
                前往登录
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
    );
  }

  // 注册表单
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ← 返回首页
          </button>
        </div>

        <h1 className="text-4xl font-serif mb-2 text-center">准学员注册</h1>
        <p className="text-neutral-400 text-center mb-8">
          填写您的信息以开始申请
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
              <p className="mb-2">⚠️ 注册须知：</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>注册后将自动生成账号和密码</li>
                <li>请务必记录您的登录信息</li>
                <li>准学员账号可以申请面试</li>
                <li>通过面试后将升级为正式学员</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '提交注册'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            已有账号？
            <button
              onClick={() => router.push('/console')}
              className="text-accent hover:text-accent/80 ml-2"
            >
              前往登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
