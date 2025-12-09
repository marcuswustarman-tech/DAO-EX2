'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isActiveStudent } from '@/lib/permissions';
import AppNavbar from '@/components/AppNavbar';
import ProgressBar from '@/components/ProgressBar';

interface Stage {
  id: string;
  stage_number: number;
  stage_name: string;
  description: string;
  has_courses: boolean;
}

interface StageProgress {
  id: string;
  stage_id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
}

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export default function LearningPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stages, setStages] = useState<Stage[]>([]);
  const [progress, setProgress] = useState<Record<string, StageProgress>>({});
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/console');
    } else if (session?.user && !isActiveStudent(session.user.role_status as any)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user && isActiveStudent(session.user.role_status as any)) {
      fetchLearningData();
    }
  }, [session]);

  const fetchLearningData = async () => {
    try {
      const response = await fetch('/api/learning/stages');
      const data = await response.json();
      if (data.stages) {
        setStages(data.stages);
        setProgress(data.progress || {});

        // 找到当前应该学习的阶段
        const currentStageData = findCurrentStage(data.stages, data.progress || {});
        setCurrentStage(currentStageData);

        if (currentStageData) {
          fetchMaterials(currentStageData.id);
        }
      }
    } catch (error) {
      console.error('Error fetching learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const findCurrentStage = (stagesList: Stage[], progressMap: Record<string, StageProgress>) => {
    // 找到第一个未完成的阶段
    for (const stage of stagesList) {
      const stageProgress = progressMap[stage.id];
      if (!stageProgress || stageProgress.status !== '已完成') {
        return stage;
      }
    }
    // 如果全部完成，返回最后一个阶段
    return stagesList[stagesList.length - 1] || null;
  };

  const fetchMaterials = async (stageId: string) => {
    try {
      const response = await fetch(`/api/learning/materials/${stageId}`);
      const data = await response.json();
      if (data.materials) {
        setMaterials(data.materials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleStartStage = async (stageId: string) => {
    try {
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: stageId }),
      });

      if (response.ok) {
        fetchLearningData();
      }
    } catch (error) {
      console.error('Error starting stage:', error);
    }
  };

  const getStageStatus = (stage: Stage): { status: string; color: string } => {
    const stageProgress = progress[stage.id];
    if (!stageProgress) {
      return { status: '未开始', color: 'text-neutral-500' };
    }
    if (stageProgress.status === '已完成') {
      return { status: '已完成', color: 'text-green-400' };
    }
    if (stageProgress.status === '进行中') {
      return { status: '进行中', color: 'text-accent' };
    }
    return { status: '未开始', color: 'text-neutral-500' };
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

  if (!session?.user || !isActiveStudent(session.user.role_status as any)) {
    return null;
  }

  const completedCount = stages.filter(s => progress[s.id]?.status === '已完成').length;

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header with Progress */}
            <div className="mb-8">
              <h1 className="text-4xl font-serif mb-4">我的学习</h1>
              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <ProgressBar
                  current={completedCount}
                  total={stages.length}
                  showLabel={true}
                  size="lg"
                />
              </div>
            </div>

          {/* 学习进度概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stages.map((stage) => {
              const { status: statusText, color } = getStageStatus(stage);
              const isCurrent = currentStage?.id === stage.id;

              return (
                <div
                  key={stage.id}
                  className={`bg-neutral-900 border ${
                    isCurrent ? 'border-accent' : 'border-neutral-800'
                  } p-6 cursor-pointer hover:bg-neutral-800/50 transition-colors`}
                  onClick={() => {
                    setCurrentStage(stage);
                    fetchMaterials(stage.id);
                  }}
                >
                  <div className="text-sm text-neutral-500 mb-2">
                    阶段 {stage.stage_number}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{stage.stage_name}</h3>
                  <div className={`text-sm ${color}`}>{statusText}</div>
                </div>
              );
            })}
          </div>

          {/* 当前阶段详情 */}
          {currentStage && (
            <div className="bg-neutral-900 border border-neutral-800 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif mb-2">
                    阶段 {currentStage.stage_number}: {currentStage.stage_name}
                  </h2>
                  <p className="text-neutral-400">{currentStage.description}</p>
                </div>
                {!progress[currentStage.id] && (
                  <button
                    onClick={() => handleStartStage(currentStage.id)}
                    className="px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-colors whitespace-nowrap"
                  >
                    开始学习
                  </button>
                )}
              </div>

              {/* 学习资料 */}
              {materials.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">学习资料</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="bg-neutral-950 border border-neutral-700 p-4 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-medium mb-1">{material.title}</h4>
                          {material.description && (
                            <p className="text-sm text-neutral-400 mb-2">
                              {material.description}
                            </p>
                          )}
                          <div className="text-xs text-neutral-500">
                            {material.file_name} • 上传于{' '}
                            {new Date(material.uploaded_at).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                        <a
                          href={material.file_url}
                          download
                          className="px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors text-sm whitespace-nowrap"
                        >
                          下载
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {materials.length === 0 && progress[currentStage.id] && (
                <div className="text-center text-neutral-500 py-8">
                  暂无学习资料
                </div>
              )}

              {/* 提交作业按钮 */}
              {progress[currentStage.id] && progress[currentStage.id].status === '进行中' && (
                <div className="mt-8 pt-8 border-t border-neutral-800">
                  <button
                    onClick={() => router.push(`/learning/submit?stage=${currentStage.id}`)}
                    className="w-full px-6 py-4 bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
                  >
                    提交本阶段作业
                  </button>
                </div>
              )}
            </div>
          )}

          {!currentStage && stages.length === 0 && (
            <div className="bg-neutral-900 border border-neutral-800 p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-medium mb-4">暂无学习内容</h2>
              <p className="text-neutral-400">
                请联系团队长了解更多信息
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
