'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 登录表单
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // 注册表单
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    contact: '',
    age: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username: loginData.username,
        password: loginData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('账号或密码错误');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (!registerData.contact || !registerData.age) {
      setError('请填写完整信息');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          contact: registerData.contact,
          age: parseInt(registerData.age),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 注册成功，自动登录
        const result = await signIn('credentials', {
          username: registerData.username,
          password: registerData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('注册成功，但登录失败，请手动登录');
          setIsLogin(true);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || '注册失败');
      }
    } catch (err) {
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* 左侧 - 品牌区 */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/20" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/" className="mb-12">
            <h1 className="text-6xl font-serif text-white mb-4">明道</h1>
            <p className="text-xl text-white/80">精准 · 专业 · 高效</p>
          </Link>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">完全免费培训</h3>
                <p className="text-white/70">30天系统化培训，无需支付任何学费</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">真实资金配置</h3>
                <p className="text-white/70">通过考核后获得$100K-$2M资金管理权限</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">高额利润分成</h3>
                <p className="text-white/70">60-90%分成比例，收益完全透明</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧 - 表单区 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* 移动端Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/">
              <h1 className="text-4xl font-serif text-white mb-2">明道</h1>
              <p className="text-neutral-400">精准 · 专业 · 高效</p>
            </Link>
          </div>

          {/* 切换按钮 */}
          <div className="flex gap-2 mb-8 bg-neutral-900 p-1 rounded">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-medium transition-colors ${
                isLogin
                  ? 'bg-accent text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-medium transition-colors ${
                !isLogin
                  ? 'bg-accent text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              注册
            </button>
          </div>

          {/* 登录表单 */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  账号
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入账号"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入密码"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-accent text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登录中...' : '登录'}
              </button>

              <div className="text-center text-sm text-neutral-500">
                还没有账号？
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-accent hover:text-accent/80 ml-1"
                >
                  立即注册
                </button>
              </div>
            </form>
          ) : (
            // 注册表单
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  账号 <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入账号"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  密码 <span className="text-accent">*</span>
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入密码"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  确认密码 <span className="text-accent">*</span>
                </label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请再次输入密码"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  联系方式 <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={registerData.contact}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      contact: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="邮箱或电话"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  年龄 <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  value={registerData.age}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, age: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="请输入年龄"
                  required
                  disabled={loading}
                  min="18"
                  max="100"
                />
              </div>

              {error && (
                <div className="text-accent text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '注册中...' : '注册'}
              </button>

              <div className="text-center text-sm text-neutral-500">
                已有账号？
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-accent hover:text-accent/80 ml-1"
                >
                  立即登录
                </button>
              </div>

              <div className="text-xs text-neutral-500 text-center">
                注册即表示您同意我们的服务条款和隐私政策
              </div>
            </form>
          )}

          {/* 返回首页 */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-neutral-500 hover:text-accent transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
