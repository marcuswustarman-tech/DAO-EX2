'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppNavbar from '@/components/AppNavbar';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dashboard API error:', response.status, response.statusText, errorText);
        setError(`加载失败 (${response.status}): ${response.statusText}`);
        setLoading(false);
        return;
      }
      const data = await response.json();
      console.log('Dashboard data:', data);
      if (data.error) {
        setError(data.error);
      } else {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('网络错误，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <AppNavbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-neutral-400">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <AppNavbar />
        <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-red-400">{error}</div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardData();
            }}
            className="px-6 py-2 bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!session?.user || !dashboardData) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <AppNavbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-neutral-400">暂无Dashboard权限</div>
        </div>
      </div>
    );
  }

  const { user, permissions, interviewApplication, learning, management } = dashboardData;

  return (
    <div className="min-h-screen bg-neutral-950">
      <AppNavbar />
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* 返回按钮 */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/console')}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                ← 返回控制台
              </button>
            </div>

            {/* 欢迎区域 */}
            <div className="mb-8">
              <h1 className="text-3xl font-serif mb-2">
                👋 欢迎{permissions.canAccessLearning ? '回来' : ''}，{user.name}
              </h1>
              <p className="text-neutral-400 text-lg">
                <span className="text-accent font-medium">{user.roleStatus}</span>
                {learning && (
                  <>
                    {' '}· 学习进度 <span className="text-accent font-medium">{learning.progress.percentage}%</span>
                    {' '}· 学习天数 <span className="text-accent font-medium">{learning.stats.learningDays}</span>天
                  </>
                )}
              </p>
            </div>

            {/* 准学员：面试申请 */}
            {permissions.canApplyInterview && (
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-accent/30 p-8 mb-8 rounded-lg shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl">🎯</span>
                  <h2 className="text-2xl font-bold">下一步：申请面试</h2>
                </div>
                <p className="text-neutral-300 text-lg mb-6">
                  完成面试申请，开启您的交易员之路
                </p>
                {!interviewApplication ? (
                  <Link
                    href="/interview/apply"
                    className="inline-block px-8 py-4 bg-accent text-black font-bold text-lg hover:bg-accent/90 transition-all transform hover:scale-105 rounded-lg shadow-lg"
                  >
                    立即申请面试 →
                  </Link>
                ) : (
                  <div className="bg-neutral-950 border border-neutral-700 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">
                        {interviewApplication.result === '待定' ? '⏳' :
                         interviewApplication.result === '通过' ? '✅' : '❌'}
                      </span>
                      <div>
                        <div className="font-bold text-lg">
                          面试申请状态：
                          <span className={`ml-2 ${
                            interviewApplication.result === '待定' ? 'text-yellow-400' :
                            interviewApplication.result === '通过' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {interviewApplication.result}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-400 mt-1">
                          申请时间：{new Date(interviewApplication.created_at).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                    </div>
                    {interviewApplication.result === '待定' && (
                      <p className="text-neutral-400">
                        您的面试申请正在审核中，请耐心等待团队长的回复。
                      </p>
                    )}
                    {interviewApplication.result === '通过' && (
                      <p className="text-green-400">
                        恭喜！您的面试申请已通过，团队长将很快与您联系安排面试时间。
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 学员：当前学习阶段 */}
            {permissions.canAccessLearning && learning?.currentStage && (
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-accent/30 p-8 mb-8 rounded-lg shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl">🎯</span>
                  <h2 className="text-2xl font-bold">当前学习阶段</h2>
                </div>
                <div>
                  <div className="mb-6">
                    <div className="text-sm text-neutral-400 mb-2">
                      阶段 {learning.currentStage.stage_number}
                    </div>
                    <div className="text-3xl font-bold mb-3 text-accent">{learning.currentStage.stage_name}</div>
                    <p className="text-neutral-300 text-lg mb-4">{learning.currentStage.description}</p>
                    {learning.currentStage.progress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-400">进度</span>
                          <span className="text-accent font-medium">{learning.currentStage.progress.progress || 0}%</span>
                        </div>
                        <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${learning.currentStage.progress.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href="/learning"
                      className="flex-1 px-8 py-4 bg-accent text-black font-bold text-lg hover:bg-accent/90 transition-all transform hover:scale-105 text-center rounded-lg shadow-lg"
                    >
                      继续学习 →
                    </Link>
                    {learning.currentStage.progress?.status === '进行中' && (
                      <Link
                        href={`/learning/submit?stage=${learning.currentStage.id}`}
                        className="px-8 py-4 border-2 border-accent text-accent font-bold text-lg hover:bg-accent/10 transition-all text-center rounded-lg"
                      >
                        提交作业
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 学员和团队长：主要内容区 */}
            {(permissions.canAccessLearning || permissions.isTeamLeader) && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* 学员：学习材料 */}
                {permissions.canAccessLearning && (
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span>📚</span>
                      学习材料
                    </h3>

                    {learning?.currentStage && (
                      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-2 border-blue-500/50 p-5 rounded-lg mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🏠</span>
                          <h4 className="text-lg font-bold text-blue-300">培训会议室</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">房间名称：</span>
                            <span className="text-white font-mono bg-neutral-950 px-3 py-1 rounded">Trading-Room-{learning.currentStage.stage_number}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">密码：</span>
                            <span className="text-white font-mono bg-neutral-950 px-3 py-1 rounded">****</span>
                          </div>
                          <button className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                            显示密码
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Link href="/learning" className="block p-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">📹</span>
                            <span className="font-medium">视频教程</span>
                          </div>
                          <span className="text-accent">查看 →</span>
                        </div>
                      </Link>
                      <Link href="/learning" className="block p-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">📄</span>
                            <span className="font-medium">学习文档</span>
                          </div>
                          <span className="text-accent">查看 →</span>
                        </div>
                      </Link>
                      <Link href="/learning" className="block p-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">📝</span>
                            <span className="font-medium">练习题</span>
                          </div>
                          <span className="text-accent">查看 →</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* 学员：待办事项 */}
                {permissions.canAccessLearning && (
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span>📝</span>
                      待办事项
                    </h3>
                    {learning?.pendingAssignments && learning.pendingAssignments.length > 0 ? (
                      <div className="space-y-3">
                        {learning.pendingAssignments.map((stage: any) => (
                          <div key={stage.id} className="p-4 bg-orange-900/20 border-2 border-orange-500/50 rounded-lg">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">⚠️</span>
                              <div className="flex-1">
                                <div className="font-bold text-orange-300 mb-1">{stage.stage_name}</div>
                                <div className="text-sm text-neutral-300 mb-3">请完成本阶段作业</div>
                                <Link
                                  href={`/learning/submit?stage=${stage.id}`}
                                  className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded transition-colors"
                                >
                                  立即提交 →
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <span className="text-5xl mb-3 block">✅</span>
                        <p className="text-neutral-400">暂无待办事项</p>
                        <p className="text-sm text-neutral-500 mt-2">继续保持！</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 团队长：待审核作业 */}
                {permissions.isTeamLeader && (
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span>📝</span>
                        最新待审核作业
                      </h3>
                      <Link href="/assignments/review" className="text-sm text-accent hover:text-accent/80">
                        查看全部 →
                      </Link>
                    </div>
                    {management?.recentAssignments && management.recentAssignments.length > 0 ? (
                      <div className="space-y-3">
                        {management.recentAssignments.map((assignment: any) => (
                          <div key={assignment.id} className="p-3 bg-neutral-950 border border-neutral-700 rounded">
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
                )}

                {/* 团队长：需要关注的学员 */}
                {permissions.isTeamLeader && (
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <span className="text-yellow-500">⚠️</span>
                      需要关注的学员
                    </h3>
                    {management?.stuckStudents && management.stuckStudents.length > 0 ? (
                      <div className="space-y-3">
                        {management.stuckStudents.map((student: any) => (
                          <div key={student.id} className="p-3 bg-neutral-950 border border-yellow-500/20 rounded">
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
                )}
              </div>
            )}

            {/* 团队长：数据概览 */}
            {permissions.isTeamLeader && management && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Link href="/assignments/review" className="bg-neutral-900 border border-neutral-800 p-6 hover:border-accent transition-colors rounded-lg">
                  <div className="text-4xl font-bold text-accent mb-2">{management.stats.pendingAssignments}</div>
                  <div className="text-sm text-neutral-400">待审核作业</div>
                </Link>
                <Link href="/interview/manage" className="bg-neutral-900 border border-neutral-800 p-6 hover:border-accent transition-colors rounded-lg">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">{management.stats.pendingInterviews}</div>
                  <div className="text-sm text-neutral-400">待处理面试</div>
                </Link>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-green-400 mb-2">{management.stats.totalStudents}</div>
                  <div className="text-sm text-neutral-400">在读学员</div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{management.stats.prospectiveStudents}</div>
                  <div className="text-sm text-neutral-400">准学员</div>
                </div>
              </div>
            )}

            {/* 底部区域：统计和通知 */}
            {permissions.canAccessLearning && learning && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span>📊</span>
                    我的统计
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-accent mb-2">{learning.stats.learningDays}</div>
                      <div className="text-sm text-neutral-400">学习天数</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-green-400 mb-2">{learning.stats.completedAssignments}</div>
                      <div className="text-sm text-neutral-400">完成作业</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span>📨</span>
                    最新通知
                  </h3>
                  {learning.recentReviews && learning.recentReviews.length > 0 ? (
                    <div className="space-y-3">
                      {learning.recentReviews.map((review: any) => (
                        <div key={review.id} className="flex items-start gap-3 p-4 bg-neutral-950 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors">
                          <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                            review.status === '已通过' ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium mb-1">
                              {review.stage.stage_name} 作业审核
                              <span className={`ml-2 ${review.status === '已通过' ? 'text-green-400' : 'text-red-400'}`}>
                                {review.status === '已通过' ? '✅ 已通过' : '❌ 需要修改'}
                              </span>
                            </div>
                            <div className="text-sm text-neutral-500">
                              {new Date(review.submitted_at).toLocaleDateString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-4xl mb-3 block">📭</span>
                      <p className="text-neutral-400">暂无通知</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 准学员：了解更多 */}
            {permissions.canApplyInterview && !permissions.canAccessLearning && (
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>📚</span>
                  了解更多
                </h3>
                <div className="space-y-3">
                  <Link href="/mojie101" className="block p-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">查看招聘流程（三封信）</span>
                      <span className="text-accent">查看 →</span>
                    </div>
                  </Link>
                  <Link href="/#faq" className="block p-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">常见问题解答</span>
                      <span className="text-accent">查看 →</span>
                    </div>
                  </Link>
                  <Link href="/#contact" className="block p-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">联系我们</span>
                      <span className="text-accent">查看 →</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
