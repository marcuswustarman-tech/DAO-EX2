'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  order_index: number;
  category: string;
  duration_minutes: number;
  content: string;
}

interface Progress {
  status: string;
  progress: number;
}

export default function CoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && params.id) {
      fetchCourse();
    }
  }, [session, params.id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`);
      const data = await response.json();
      if (data.course) {
        setCourse(data.course);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: '已完成', progress: 100 }),
      });

      if (response.ok) {
        // 刷新数据
        await fetchCourse();
        alert('课程已标记为完成！');
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (!session?.user || !course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <button
            onClick={() => router.push('/progress')}
            className="mb-8 text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← 返回学习进度
          </button>

          {/* 课程标题 */}
          <div className="mb-8">
            <div className="text-sm text-neutral-500 mb-2">{course.category}</div>
            <h1 className="text-4xl font-serif mb-4">
              第{course.order_index}课：{course.title}
            </h1>
            <p className="text-neutral-400 text-lg">{course.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-neutral-500">
              <span>⏱ 预计时长：{course.duration_minutes}分钟</span>
              {progress && (
                <span className="text-accent">
                  状态：{progress.status} {progress.status === '学习中' && `(${progress.progress}%)`}
                </span>
              )}
            </div>
          </div>

          {/* 课程内容区域 - 占位 */}
          <div className="bg-neutral-900 border border-neutral-800 p-12 mb-8">
            <h2 className="text-2xl font-medium mb-6 text-center">课程内容区域</h2>

            <div className="text-center text-neutral-400 mb-8">
              <div className="text-6xl mb-6">📚</div>
              <p className="mb-4">课程内容开发中...</p>
              <p className="text-sm text-neutral-500">此区域将用于展示：</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4 text-neutral-500">
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">▸</span>
                <div>
                  <strong className="text-neutral-300">视频课程</strong>
                  <p className="text-sm">高清教学视频，支持倍速播放和字幕</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">▸</span>
                <div>
                  <strong className="text-neutral-300">课件资料</strong>
                  <p className="text-sm">PDF文档、图表、案例分析等学习资料</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">▸</span>
                <div>
                  <strong className="text-neutral-300">练习题</strong>
                  <p className="text-sm">巩固知识点的练习题和实战模拟</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">▸</span>
                <div>
                  <strong className="text-neutral-300">课程测验</strong>
                  <p className="text-sm">检验学习成果的测试题目</p>
                </div>
              </div>
            </div>

            {/* 课程内容文本预留 */}
            {course.content && (
              <div className="mt-8 pt-8 border-t border-neutral-800">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: course.content }} />
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            {progress?.status !== '已完成' && (
              <button
                onClick={handleMarkAsComplete}
                className="flex-1 px-8 py-4 bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
              >
                标记为已完成
              </button>
            )}
            {progress?.status === '已完成' && (
              <div className="flex-1 px-8 py-4 bg-green-900 text-green-100 font-medium text-center border border-green-700">
                ✅ 已完成
              </div>
            )}
            <button
              onClick={() => router.push('/progress')}
              className="px-8 py-4 border border-neutral-700 text-neutral-300 hover:bg-neutral-900 transition-colors"
            >
              返回进度
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
