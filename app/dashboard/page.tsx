'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppNavbar from '@/components/AppNavbar';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="text-neutral-400">加载中...</div>
        </div>
      </>
    );
  }

  if (!session?.user || !dashboardData) {
    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="text-neutral-400">暂无Dashboard权限</div>
        </div>
      </>
    );
  }

  // 学员Dashboard
  if (dashboardData.type === 'student') {
    const { progress, currentStage, pendingAssignments, recentReviews, stats } = dashboardData;

    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-neutral-950 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {/* 欢迎区域 */}
              <div className="mb-8">
                <h1 className="text-3xl font-serif mb-2">
                  欢迎回来，{session.user.name}
                </h1>
                <p className="text-neutral-400">
                  当前等级：<span className="text-accent">{session.user.role_status}</span> ·
                  学习进度：<span className="text-accent">{progress.percentage}%</span>
                </p>
              </div>

              {/* 学习进度卡片 */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium">学习进度</h2>
                  <Link href="/learning" className="text-sm text-accent hover:text-accent/80">
                    查看详情 →
                  </Link>
                </div>
                <ProgressBar
                  current={progress.completed}
                  total={progress.total}
                  showLabel={true}
                  size="lg"
                />
                <div className="mt-4 flex items-center gap-8 text-sm text-neutral-400">
                  <div>
                    <span className="text-2xl font-bold text-white">{progress.completed}</span>
                    <span className="ml-1">/ {progress.total} 阶段已完成</span>
                  </div>
                </div>
              </div>

              {/* 主要内容区 */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* 当前学习阶段 */}
                <div className="bg-neutral-900 border border-neutral-800 p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <span className="text-accent">📚</span>
                    当前学习阶段
                  </h3>
                  {currentStage ? (
                    <div>
                      <div className="text-sm text-neutral-500 mb-1">
                        阶段 {currentStage.stage_number}
                      </div>
                      <div className="text-xl font-medium mb-2">{currentStage.stage_name}</div>
                      <p className="text-sm text-neutral-400 mb-4">{currentStage.description}</p>
                      <div className="flex gap-3">
                        <Link
                          href="/learning"
                          className="px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors text-sm"
                        >
                          继续学习
                        </Link>
                        {currentStage.progress?.status === '进行中' && (
                          <Link
                            href={`/learning/submit?stage=${currentStage.id}`}
                            className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors text-sm"
                          >
                            提交作业
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-500">暂无进行中的阶段</p>
                  )}
                </div>

                {/* 待提交作业 */}
                <div className="bg-neutral-900 border border-neutral-800 p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">📝</span>
                    待提交作业
                  </h3>
                  {pendingAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {pendingAssignments.map((stage: any) => (
                        <div key={stage.id} className="p-3 bg-neutral-950 border border-neutral-700">
                          <div className="font-medium mb-1">{stage.stage_name}</div>
                          <div className="text-sm text-neutral-400 mb-3">请完成本阶段作业</div>
                          <Link
                            href={`/learning/submit?stage=${stage.id}`}
                            className="inline-block px-3 py-1 bg-accent text-white hover:bg-accent/90 text-sm"
                          >
                            立即提交
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500">暂无待提交作业</p>
                  )}
                </div>
              </div>

              {/* 底部区域 */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* 我的统计 */}
                <div className="bg-neutral-900 border border-neutral-800 p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <span>📊</span>
                    我的统计
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-accent">{stats.learningDays}</div>
                      <div className="text-sm text-neutral-500">学习天数</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">{stats.completedAssignments}</div>
                      <div className="text-sm text-neutral-500">完成作业</div>
                    </div>
                  </div>
                </div>

                {/* 最新通知 */}
                <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <span>📨</span>
                    最新通知
                  </h3>
                  {recentReviews.length > 0 ? (
                    <div className="space-y-3">
                      {recentReviews.map((review: any) => (
                        <div key={review.id} className="flex items-start gap-3 p-3 bg-neutral-950 border border-neutral-700">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            review.status === '已通过' ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {review.stage.stage_name} 作业审核
                              {review.status === '已通过' ? '已通过' : '需要修改'}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {new Date(review.submitted_at).toLocaleDateString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500">暂无通知</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 团队长Dashboard
  if (dashboardData.type === 'team_leader') {
    const { stats, recentAssignments, stuckStudents } = dashboardData;

    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-neutral-950 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {/* 欢迎区域 */}
              <div className="mb-8">
                <h1 className="text-3xl font-serif mb-2">
                  团队长控制台
                </h1>
                <p className="text-neutral-400">
                  数据概览 · {session.user.name}
                </p>
              </div>

              {/* 数据概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Link href="/assignments/review" className="bg-neutral-900 border border-neutral-800 p-6 hover:border-accent transition-colors">
                  <div className="text-4xl font-bold text-accent mb-2">{stats.pendingAssignments}</div>
                  <div className="text-sm text-neutral-400">待审核作业</div>
                </Link>
                <Link href="/interview/manage" className="bg-neutral-900 border border-neutral-800 p-6 hover:border-accent transition-colors">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">{stats.pendingInterviews}</div>
                  <div className="text-sm text-neutral-400">待处理面试</div>
                </Link>
                <div className="bg-neutral-900 border border-neutral-800 p-6">
                  <div className="text-4xl font-bold text-green-400 mb-2">{stats.totalStudents}</div>
                  <div className="text-sm text-neutral-400">在读学员</div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{stats.prospectiveStudents}</div>
                  <div className="text-sm text-neutral-400">准学员</div>
                </div>
              </div>

              {/* 主要内容区 */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* 待审核作业 */}
                <div className="bg-neutral-900 border border-neutral-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <span>📝</span>
                      最新待审核作业
                    </h3>
                    <Link href="/assignments/review" className="text-sm text-accent hover:text-accent/80">
                      查看全部 →
                    </Link>
                  </div>
                  {recentAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {recentAssignments.map((assignment: any) => (
                        <div key={assignment.id} className="p-3 bg-neutral-950 border border-neutral-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{assignment.user.username}</div>
                            <div className="text-xs text-neutral-500">
                              第{assignment.submission_count}次提交
                            </div>
                          </div>
                          <div className="text-sm text-neutral-400 mb-2">{assignment.stage.stage_name}</div>
                          <div className="text-xs text-neutral-500">
                            {new Date(assignment.submitted_at).toLocaleString('zh-CN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500">暂无待审核作业</p>
                  )}
                </div>

                {/* 需要关注的学员 */}
                <div className="bg-neutral-900 border border-neutral-800 p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    需要关注的学员
                  </h3>
                  {stuckStudents.length > 0 ? (
                    <div className="space-y-3">
                      {stuckStudents.map((student: any) => (
                        <div key={student.id} className="p-3 bg-neutral-950 border border-yellow-500/20">
                          <div className="font-medium mb-1">{student.user.username}</div>
                          <div className="text-sm text-neutral-400 mb-2">
                            {student.stage.stage_name} 停滞中
                          </div>
                          <div className="text-xs text-yellow-500">
                            已停滞 {Math.floor((Date.now() - new Date(student.started_at).getTime()) / (1000 * 60 * 60 * 24))} 天
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500">所有学员进展正常</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
