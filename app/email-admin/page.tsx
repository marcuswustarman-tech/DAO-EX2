'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [serviceStatus, setServiceStatus] = useState('未知');

  if (status === 'loading') {
    return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">加载中...</div>;
  }

  if (!session || session.user.role_status !== '团队长') {
    router.push('/console');
    return null;
  }

  const checkStatus = async () => {
    const res = await fetch('/api/email-service');
    const data = await res.json();
    setServiceStatus(data.configured ? '已配置' : '未配置');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push('/console')}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              ← 返回控制台
            </button>
          </div>

          <h1 className="text-4xl font-serif mb-8">邮件自动回复管理</h1>

          <div className="bg-neutral-900 border border-neutral-800 p-8 mb-6">
            <h2 className="text-2xl mb-4">服务状态</h2>
            <p className="mb-4">状态: {serviceStatus}</p>
            <button
              onClick={checkStatus}
              className="bg-accent text-white px-6 py-2 hover:bg-accent/80 transition-colors"
            >
              检查状态
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-8">
            <h2 className="text-2xl mb-4">配置说明</h2>
            <div className="space-y-4 text-neutral-300">
              <p>1. 获取 Outlook 应用专用密码：</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>访问 account.microsoft.com</li>
                <li>登录你的账号</li>
                <li>进入"安全" → "高级安全选项"</li>
                <li>找到"应用密码"，生成新密码</li>
              </ul>
              <p>2. 在 .env.local 中配置：</p>
              <pre className="bg-neutral-950 p-4 rounded">
EMAIL_USER=mojie_yc@outlook.com
EMAIL_PASSWORD=你的应用专用密码
              </pre>
              <p>3. 运行邮件服务：</p>
              <pre className="bg-neutral-950 p-4 rounded">
node email-service.js
              </pre>
              <p>4. 添加 PDF 文件路径到 email-service.js 的 pdfFiles 数组</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
