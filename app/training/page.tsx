'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataBreathAnimation from '@/components/DataBreathAnimation';
import InterviewModal from '@/components/InterviewModal';
import Link from 'next/link';

export default function TrainingPage() {
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section with Deep Starry Background */}
        <section className="relative overflow-hidden" style={{ height: '90vh' }}>
          <DataBreathAnimation />

          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <div className="container-custom max-w-4xl text-center px-6">
              <div className="mb-6">
                <span className="text-sm md:text-base text-white/60 font-light tracking-widest uppercase">
                  免费孵化器
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-8 tracking-tight">
                加入明道矩阵
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-4 font-light">
                成为职业交易员，获得真实资金配置
              </p>
              <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-12 font-light max-w-2xl mx-auto">
                我们提供系统化培训，让你从零基础到稳定盈利
              </p>

              <div className="animate-bounce mt-16">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-6 h-6 text-white/50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                  <span className="text-sm text-white/50 font-light">向下滚动探索</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 核心优势 */}
        <section className="section-spacing bg-white">
          <div className="container-custom max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-sm text-accent font-medium tracking-widest uppercase mb-4">为什么选择我们</p>
              <h2 className="heading-lg">核心优势</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 bg-neutral-50 border border-neutral-100 hover:border-accent transition-colors">
                <div className="mb-6">
                  <div className="text-5xl font-serif font-light text-accent">100%</div>
                </div>
                <h3 className="text-xl font-medium mb-4">免费培训</h3>
                <p className="text-neutral-600 leading-relaxed">
                  无需任何前期费用，我们提供完整的系统化培训。只有当你成功盈利后，我们才从利润中分成。
                </p>
              </div>

              <div className="text-center p-8 bg-neutral-50 border border-neutral-100 hover:border-accent transition-colors">
                <div className="mb-6">
                  <div className="text-5xl font-serif font-light text-accent">60-90%</div>
                </div>
                <h3 className="text-xl font-medium mb-4">高额分润</h3>
                <p className="text-neutral-600 leading-relaxed">
                  行业领先的分润比例，你的努力获得最大回报。
                </p>
              </div>

              <div className="text-center p-8 bg-neutral-50 border border-neutral-100 hover:border-accent transition-colors">
                <div className="mb-6">
                  <div className="text-3xl font-serif font-light text-accent">$100K-$2M</div>
                </div>
                <h3 className="text-xl font-medium mb-4">真实资金配置</h3>
                <p className="text-neutral-600 leading-relaxed">
                  通过考核后获得真实资金管理权限
                </p>
              </div>

              <div className="text-center p-8 bg-neutral-50 border border-neutral-100 hover:border-accent transition-colors">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-3xl">👨‍🏫</span>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-4">专业导师指导</h3>
                <p className="text-neutral-600 leading-relaxed">
                  经验丰富的交易员一对一指导
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 系统化培训体系 */}
        <section className="section-spacing bg-primary text-white">
          <div className="container-custom max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
                  系统化培训体系
                </h2>
                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  从基础理论到实战操作，完整的培训路径，确保每个阶段都有明确的目标和考核标准。我们的培训体系涵盖技术分析、基本面分析、风险管理、交易心理学等核心模块，通过理论学习、模拟交易、实盘考核的渐进式培养，帮助你建立完整的交易系统。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl font-serif font-light mb-2">30+</div>
                  <div className="text-sm text-white/70">课程模块</div>
                </div>
                <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl font-serif font-light mb-2">1:1</div>
                  <div className="text-sm text-white/70">导师指导</div>
                </div>
                <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl font-serif font-light mb-2">24/7</div>
                  <div className="text-sm text-white/70">社群支持</div>
                </div>
                <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-4xl font-serif font-light mb-2">100%</div>
                  <div className="text-sm text-white/70">实战导向</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 培训路径 */}
        <section className="section-spacing">
          <div className="container-custom max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4">培训路径</h2>
              <p className="text-xl text-neutral-600">
                30天系统化培训，5个阶段逐步晋升，从新手到职业交易员
              </p>
            </div>

            <div className="space-y-8">
              {/* 阶段1 */}
              <div className="flex gap-6 md:gap-8 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent">
                    <span className="text-2xl font-serif font-light text-accent">01</span>
                  </div>
                </div>
                <div className="flex-1 pb-8 border-b border-neutral-200">
                  <div className="mb-2">
                    <span className="text-sm text-accent font-medium">阶段 · 第1-10天</span>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">基础理论学习</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    学习外汇市场基础知识、技术分析、风险管理等核心概念
                  </p>
                </div>
              </div>

              {/* 阶段2 */}
              <div className="flex gap-6 md:gap-8 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent">
                    <span className="text-2xl font-serif font-light text-accent">02</span>
                  </div>
                </div>
                <div className="flex-1 pb-8 border-b border-neutral-200">
                  <div className="mb-2">
                    <span className="text-sm text-accent font-medium">阶段 · 第11-20天</span>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">模拟交易实践</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    在模拟账户中应用所学知识，培养交易纪律和策略执行能力
                  </p>
                </div>
              </div>

              {/* 阶段3 */}
              <div className="flex gap-6 md:gap-8 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent">
                    <span className="text-2xl font-serif font-light text-accent">03</span>
                  </div>
                </div>
                <div className="flex-1 pb-8 border-b border-neutral-200">
                  <div className="mb-2">
                    <span className="text-sm text-accent font-medium">阶段 · 第21-30天</span>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">盈利考核</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    在模拟账户中证明盈利能力，达到10%盈利目标，验证交易系统有效性
                  </p>
                </div>
              </div>

              {/* 阶段4 */}
              <div className="flex gap-6 md:gap-8 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent">
                    <span className="text-2xl font-serif font-light text-accent">04</span>
                  </div>
                </div>
                <div className="flex-1 pb-8 border-b border-neutral-200">
                  <div className="mb-2">
                    <span className="text-sm text-accent font-medium">阶段 · 第31-60天</span>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">小额实盘</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    使用小额真实资金交易，固化交易系统，适应真实市场心理压力
                  </p>
                </div>
              </div>

              {/* 阶段5 */}
              <div className="flex gap-6 md:gap-8 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center border-2 border-accent">
                    <span className="text-2xl font-serif font-light text-white">05</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-sm text-accent font-medium">阶段 · 通过后</span>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">获得资金配置</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    成功通过考核，获得真实资金管理权限，开始职业交易生涯
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 申请要求 */}
        <section className="section-spacing bg-neutral-50">
          <div className="container-custom max-w-5xl">
            <h2 className="heading-lg mb-16 text-center">申请要求</h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* 不适合的人群 */}
              <div>
                <h3 className="text-2xl font-medium mb-8 text-neutral-800">不适合的人群</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm mt-1">✗</span>
                    <p className="text-neutral-600">寻求快速致富的人</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm mt-1">✗</span>
                    <p className="text-neutral-600">缺乏纪律性和执行力</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm mt-1">✗</span>
                    <p className="text-neutral-600">无法承受压力和挫折</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm mt-1">✗</span>
                    <p className="text-neutral-600">没有时间投入学习</p>
                  </div>
                </div>
              </div>

              {/* 理想候选人 */}
              <div>
                <h3 className="text-2xl font-medium mb-8 text-neutral-800">理想候选人</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm mt-1">✓</span>
                    <p className="text-neutral-600">愿意投入时间系统学习</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm mt-1">✓</span>
                    <p className="text-neutral-600">具备良好的自律能力</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm mt-1">✓</span>
                    <p className="text-neutral-600">能够承受压力和挫折</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm mt-1">✓</span>
                    <p className="text-neutral-600">追求长期稳定收益</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 数据统计 */}
        <section className="section-spacing bg-white">
          <div className="container-custom max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center p-6 border border-neutral-200">
                <div className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">2,500+</div>
                <div className="text-sm text-neutral-600">已培训学员</div>
              </div>
              <div className="text-center p-6 border border-neutral-200">
                <div className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">12%</div>
                <div className="text-sm text-neutral-600">通过率</div>
              </div>
              <div className="text-center p-6 border border-neutral-200">
                <div className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">30</div>
                <div className="text-sm text-neutral-600">平均培训周期（天）</div>
              </div>
              <div className="text-center p-6 border border-neutral-200">
                <div className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">$50K+</div>
                <div className="text-sm text-neutral-600">最高月收益</div>
              </div>
              <div className="text-center p-6 border border-neutral-200">
                <div className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">2</div>
                <div className="text-sm text-neutral-600">合作经纪商</div>
              </div>
              <div className="text-center p-6 border border-neutral-200">
                <div className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">2</div>
                <div className="text-sm text-neutral-600">自营交易公司</div>
              </div>
              <div className="text-center p-6 border border-neutral-200 md:col-span-2">
                <div className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">60-90%</div>
                <div className="text-sm text-neutral-600">分成比例</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-spacing-sm bg-primary text-white">
          <div className="container-custom max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
              准备好开启你的交易员生涯了吗？
            </h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              时间是唯一成本，淘汰是最大风险。准备就绪？预约面试。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowInterviewModal(true)}
                className="px-10 py-4 bg-white text-primary font-medium hover:bg-neutral-100 transition-colors inline-block"
              >
                预约面试
              </button>
              <Link
                href="/assessment"
                className="px-10 py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-primary transition-colors inline-block"
              >
                心理测试
              </Link>
            </div>
            <p className="text-sm text-white/50 mt-6">
              提示：每人仅有一次机会
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <InterviewModal isOpen={showInterviewModal} onClose={() => setShowInterviewModal(false)} />
    </>
  );
}
