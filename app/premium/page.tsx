'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { canAccessPremiumContent } from '@/lib/permissions';

export default function PremiumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // 检查权限
  const hasAccess = canAccessPremiumContent(session.user.role as any);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-serif mb-6">付费专属内容</h1>
            <div className="bg-neutral-900 border border-neutral-800 p-12">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-2xl font-medium mb-4">权限不足</h2>
              <p className="text-neutral-400 mb-8">
                抱歉，您当前的等级为 <span className="text-accent">{session.user.role}</span>，
                需要升级为付费学员才能访问此内容。
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 有权限 - 显示占位内容
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif mb-8 text-center">付费专属内容</h1>

          <div className="bg-neutral-900 border border-neutral-800 p-12 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-2xl font-medium mb-4">欢迎，{session.user.name}</h2>
            <p className="text-neutral-400 mb-8">
              您当前的等级：<span className="text-accent">{session.user.role}</span>
            </p>

            <div className="border-t border-neutral-800 pt-8 mt-8">
              <h3 className="text-xl mb-4">专属内容开发中</h3>
              <p className="text-neutral-500 mb-6">
                以下功能即将上线：
              </p>
              <ul className="text-left max-w-md mx-auto space-y-3 text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="text-accent">▸</span>
                  高级交易策略课程
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">▸</span>
                  实时市场分析报告
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">▸</span>
                  专属交易工具和指标
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">▸</span>
                  一对一导师指导
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">▸</span>
                  内部交易社区访问权限
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
