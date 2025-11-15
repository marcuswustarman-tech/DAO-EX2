'use client';

import { useState, useEffect } from 'react';
import DataBreathAnimation from '@/components/DataBreathAnimation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 标题渐显
    const titleTimer = setTimeout(() => {
      setTitleVisible(true);
    }, 500);

    return () => clearTimeout(titleTimer);
  }, []);

  const handleEnter = () => {
    setShowContent(true);
  };

  if (showContent) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen">

        {/* 主要内容区 */}
        <section className="section-spacing pt-32">
          <div className="container-custom">
            <div className="max-w-4xl">
              <h1 className="heading-xl mb-8 animate-fade-in">
                从混沌中捕捉确定性
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 mb-12 leading-relaxed">
                30个工作日，我们从大量申请者中筛选出极少数（10-15%）具备顶尖交易员潜质的人才，
                通过系统化、纪律严明的科学方法，让合适的新人达到专家级交易水准。
              </p>
              <div className="flex gap-6">
                <Link href="/assessment" className="btn-primary">
                  开始申请
                </Link>
                <Link href="/about" className="btn-outline">
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 核心价值 */}
        <section className="section-spacing bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-1 bg-accent"></div>
                <h3 className="heading-sm">精准筛选</h3>
                <p className="text-neutral-600 leading-relaxed">
                  通过严格的心理测评和面试，我们只选择那些真正适合成为职业交易员的人才。
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-1 bg-accent"></div>
                <h3 className="heading-sm">快速成才</h3>
                <p className="text-neutral-600 leading-relaxed">
                  30个工作日系统化训练，让合适的人才快速掌握专业交易技能，避开常见错误。
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-1 bg-accent"></div>
                <h3 className="heading-sm">合作共赢</h3>
                <p className="text-neutral-600 leading-relaxed">
                  提供最高$200,000资金支持，60%-90%利润分成，建立长期合作伙伴关系。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 培养流程 */}
        <section className="section-spacing">
          <div className="container-custom">
            <h2 className="heading-lg mb-16 text-center">培养流程</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                {
                  day: '第1-5日',
                  title: '规则学习',
                  desc: '学习15个标准进场点，通过线上考核。未通过者劝退。',
                },
                {
                  day: '第6-20日',
                  title: '盈利练习',
                  desc: '在模拟盘找到适合的交易品种，严格按规则练习，做到不错单、不漏单、不亏损。',
                },
                {
                  day: '第21-30日',
                  title: '盈利考核',
                  desc: '连续10个交易日保持操作一致性并通过考核。',
                },
                {
                  day: '实盘阶段',
                  title: '职业交易员',
                  desc: '获得实盘资金，享受60%-90%利润分成，工作时间自由。',
                },
              ].map((step, index) => (
                <div key={index} className="flex gap-8 items-start group">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-sm font-medium text-accent">{step.day}</span>
                  </div>
                  <div className="flex-1 pb-8 border-b border-neutral-200 group-last:border-0">
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-neutral-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </main>
        <Footer />
      </>
    );
  }

  // 首屏动画页面
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <DataBreathAnimation />

      {/* 明DAO标题 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1
          className={`text-7xl md:text-8xl lg:text-9xl font-serif font-light text-white tracking-wider transition-all duration-[2000ms] ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          明DAO
        </h1>

        {titleVisible && (
          <>
            <button
              onClick={handleEnter}
              className="mt-16 px-10 py-4 border border-white text-white font-light tracking-wider hover:bg-white hover:text-black transition-all duration-300 animate-fade-in"
            >
              进入平台
            </button>

            <div className="absolute bottom-12 animate-bounce">
              <svg
                className="w-6 h-6 text-white opacity-50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
