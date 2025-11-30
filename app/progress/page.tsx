'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { canAccessProgress } from '@/lib/permissions';

interface Course {
  id: string;
  title: string;
  description: string;
  order_index: number;
  category: string;
  duration_minutes: number;
  userProgress: {
    status: string;
    progress: number;
  };
}

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProgress();
    }
  }, [session]);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      const data = await response.json();
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const completedCount = courses.filter((c) => c.userProgress.status === '已完成').length;
  const totalCount = courses.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '已完成':
        return '✅';
      case '学习中':
        return '🔄';
      default:
        return '⭕';
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case '已完成':
        return '查看';
      case '学习中':
        return '继续学习';
      default:
        return '开始学习';
    }
  };

  // 按分类分组
  const coursesByCategory = courses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif mb-8 text-center">我的学习进度</h1>

          {/* 总体进度 */}
          <div className="bg-neutral-900 border border-neutral-800 p-8 mb-8">
            <h2 className="text-2xl font-medium mb-4">整体进度</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="h-4 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-accent">{overallProgress}%</div>
            </div>
            <p className="text-neutral-400">
              已完成 {completedCount}/{totalCount} 门课程
            </p>
          </div>

          {/* 课程列表 */}
          {Object.entries(coursesByCategory).map(([category, categoryCourses]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-neutral-300">[{category}]</h3>
              <div className="space-y-4">
                {categoryCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getStatusIcon(course.userProgress.status)}</span>
                          <h4 className="text-lg font-medium">
                            第{course.order_index}课：{course.title}
                          </h4>
                        </div>
                        <p className="text-neutral-400 text-sm mb-3">{course.description}</p>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <span>⏱ {course.duration_minutes}分钟</span>
                          {course.userProgress.status === '学习中' && (
                            <span className="text-accent">进度: {course.userProgress.progress}%</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/courses/${course.id}`)}
                        className="px-6 py-2 bg-accent text-white hover:bg-accent/90 transition-colors whitespace-nowrap"
                      >
                        {getButtonText(course.userProgress.status)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="bg-neutral-900 border border-neutral-800 p-12 text-center">
              <p className="text-neutral-400">暂无课程</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
