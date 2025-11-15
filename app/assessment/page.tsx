'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  assessmentQuestions,
  calculateDimensionScores,
  hasRedFlagAnswers,
  isPassed,
} from '@/lib/assessment';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const question = assessmentQuestions[currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(newAnswers);

    // 自动进入下一题
    if (currentQuestion < assessmentQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // 显示结果
      setTimeout(() => {
        setShowResults(true);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const dimensionScores = calculateDimensionScores(answers);
    const hasRedFlag = hasRedFlagAnswers(answers);
    const passed = isPassed(dimensionScores, hasRedFlag);

    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              {passed ? (
                <>
                  <div className="inline-block w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="heading-lg mb-4">恭喜通过初步筛选！</h1>
                  <p className="text-xl text-neutral-600 mb-8">
                    您的综合评估显示，您具备成为优秀交易员的潜质。
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-block w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-neutral-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h1 className="heading-lg mb-4">测评结果</h1>
                  <p className="text-xl text-neutral-600 mb-8">
                    问卷显示您可能并不适合，建议与您的团队长深入沟通。
                  </p>
                </>
              )}
            </div>

            {/* 维度得分 */}
            <div className="bg-white border border-neutral-200 p-8 mb-8">
              <h2 className="text-2xl font-medium mb-6">各维度评分</h2>
              <div className="space-y-6">
                {Object.entries(dimensionScores).map(([dimension, score]) => (
                  <div key={dimension}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{dimension}</span>
                      <span
                        className={`text-lg font-semibold ${
                          score >= 70
                            ? 'text-green-600'
                            : score >= 50
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {score}分
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score >= 70
                            ? 'bg-green-500'
                            : score >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 下一步 */}
            {passed && (
              <div className="bg-neutral-50 border border-neutral-200 p-8 text-center">
                <h2 className="text-2xl font-medium mb-6">下一步</h2>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  请添加我的钉钉进行深入沟通：<br />
                  <strong className="text-primary">钉钉号：iiu_z896deh8c</strong><br />
                  <strong className="text-primary">邮箱：mojie_yc@outlook.com</strong><br />
                  <br />
                  添加时请发送代码：<strong className="text-accent">mojie101</strong><br />
                  我会向你发送三封信。
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btn-outline"
                >
                  返回首页
                </button>
              </div>
            )}

            {!passed && (
              <div className="text-center">
                <button
                  onClick={() => router.push('/')}
                  className="btn-outline"
                >
                  返回首页
                </button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container-custom max-w-3xl">
          {/* 进度条 */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-neutral-600">
                问题 {currentQuestion + 1} / {assessmentQuestions.length}
              </span>
              <span className="text-sm text-neutral-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 维度标签 */}
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
              {question.dimension}
            </span>
          </div>

          {/* 问题 */}
          <h2 className="text-2xl md:text-3xl font-light mb-12 leading-relaxed">
            {question.question}
          </h2>

          {/* 选项 */}
          <div className="space-y-4 mb-12">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-6 border-2 transition-all duration-200 hover:border-primary ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-neutral-300'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-full h-full text-white p-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 text-base">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 text-sm border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
            >
              上一题
            </button>

            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(answers).length < assessmentQuestions.length}
              className="px-6 py-2 text-sm bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
            >
              查看结果
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
