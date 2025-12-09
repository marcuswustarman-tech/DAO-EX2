'use client';

import { useState, useEffect } from 'react';
import DataBreathAnimation from '@/components/DataBreathAnimation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InterviewModal from '@/components/InterviewModal';
import Link from 'next/link';

export default function HomePage() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setTitleVisible(true);
    }, 500);
    return () => clearTimeout(titleTimer);
  }, []);

  const handleEnter = () => {
    setShowContent(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // 学员数据
  const testimonials = [
    { name: '张同学', role: '职业交易员', date: '2024-10', content: '在明道学习的30天是我人生的转折点。从完全不懂交易到通过考核,整个过程非常系统和专业。现在我每个月都能稳定盈利，真正实现了财务自由。' },
    { name: '李同学', role: '独立交易员', date: '2024-09', content: '之前在其他平台学了很久都没有成果，来到明道后才发现什么是真正的交易培训。规则清晰，考核标准明确，老师耐心指导。通过考核后拿到资金，现在已经盈利20%+。' },
    { name: '王同学', role: '基金经理', date: '2024-08', content: '明道最大的优势是实战性强。不是教你理论，而是直接教你怎么在市场上赚钱。我用了25个工作日通过考核，现在管理着6位数的资金，分成比例高达80%。' },
    { name: '陈同学', role: '职业交易员', date: '2024-11', content: '起初我也怀疑过这个模式，但实际体验后发现确实是在培养真正的交易员。考核标准严格但合理，通过后的支持也很到位。现在每天只需要盯盘几小时，收入却比以前上班高多了。' },
    { name: '刘同学', role: '独立交易员', date: '2024-07', content: '作为一个90后，我在明道找到了真正适合自己的职业。30天的培训虽然辛苦，但收获巨大。现在我可以在世界任何地方工作，时间和地点完全自由。' },
    { name: '赵同学', role: '职业交易员', date: '2024-06', content: '明道的筛选机制很严格，但正因如此，通过的人都是真正有潜力的。我很庆幸自己坚持下来了。现在回头看，那45天的投入是我做过最值得的决定。' },
    { name: '杨同学', role: '职业交易员', date: '2024-05', content: '我是从传统金融行业转行过来的。在明道学到的实战技能比我在银行5年学到的还多。这里没有废话，只有干货和结果导向的培训。' },
    { name: '周同学', role: '独立交易员', date: '2024-04', content: '最让我感动的是团队长的耐心指导。每次交易失误都会详细分析原因，帮我建立正确的交易思维。30天培训结束后，我完全掌握了盈利的方法。' },
    { name: '吴同学', role: '职业交易员', date: '2024-03', content: '明道给了我第二次职业生涯的机会。之前在互联网公司996，现在做交易时间自由，收入还翻倍了。最重要的是找到了真正热爱的事业。' },
    { name: '郑同学', role: '基金经理', date: '2024-02', content: '心理测评环节非常关键，它帮我认清了自己的优劣势。培训过程针对性很强，通过考核后我管理着7位数资金，月收入稳定在5位数以上。' },
    { name: '孙同学', role: '独立交易员', date: '2024-01', content: '从面试到培训到考核，每个环节都能看出明道的专业性。这不是培训班，而是真正的交易员孵化器。我用20个工作日通过考核，现在每月稳定盈利。' },
    { name: '钱同学', role: '职业交易员', date: '2023-12', content: '最大的收获是学会了风险管理和资金管理。以前总是重仓梭哈，现在懂得了稳健盈利的重要性。通过考核后拿到资金支持，压力小了很多。' },
  ];

  if (showContent) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen">
          {/* 英雄区 */}
          <section className="relative overflow-hidden bg-primary" style={{ minHeight: '100vh' }}>
            <DataBreathAnimation />

            <div className="relative z-10 h-full flex flex-col items-center justify-center min-h-screen py-32">
              <div className="container-custom max-w-5xl text-center">
                <h1 className="hero-title text-7xl md:text-8xl lg:text-9xl text-white mb-8 tracking-tight">
                  明道
                </h1>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="text-xl md:text-2xl text-white/80">精准</span>
                  <span className="text-white/40">·</span>
                  <span className="text-xl md:text-2xl text-white/80">专业</span>
                  <span className="text-white/40">·</span>
                  <span className="text-xl md:text-2xl text-white/80">高效</span>
                </div>
                <p className="text-2xl md:text-3xl text-white font-medium mb-16">
                  免费培养 真正的外汇交易专家
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  <Link href="/training" className="px-10 py-4 bg-white text-primary font-medium hover:bg-neutral-100 transition-colors">
                    了解外汇培训
                  </Link>
                  <Link href="/auth" className="px-10 py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-primary transition-colors">
                    进入交易系统
                  </Link>
                </div>

                <div className="animate-bounce mt-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-white/50">Scroll to Explore</p>
                    <svg className="w-6 h-6 text-white/50" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 全方位对比 */}
          <section className="section-spacing bg-white">
            <div className="container-custom max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-4">全方位对比</h2>
                <p className="text-xl text-neutral-600">明道 vs 市场上的其他选择，一目了然的优势对比</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-300">
                      <th className="text-left p-4 font-medium text-neutral-700">对比项目</th>
                      <th className="text-center p-4 font-bold text-accent bg-accent/5">明道</th>
                      <th className="text-center p-4 font-medium text-neutral-600">自营机构</th>
                      <th className="text-center p-4 font-medium text-neutral-600">传统机构</th>
                      <th className="text-center p-4 font-medium text-neutral-600">卖指标</th>
                      <th className="text-center p-4 font-medium text-neutral-600">个人工作室</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">培训费用</td>
                      <td className="p-4 text-center bg-accent/5"><span className="text-accent font-bold">完全免费<br/>无学费考核费</span></td>
                      <td className="p-4 text-center text-neutral-600">高额学费</td>
                      <td className="p-4 text-center text-neutral-600">购买费</td>
                      <td className="p-4 text-center text-neutral-600">加盟费</td>
                      <td className="p-4 text-center text-neutral-600">按协议</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">培养模式</td>
                      <td className="p-4 text-center bg-accent/5"><span className="text-accent font-bold">小团队孵化</span></td>
                      <td className="p-4 text-center text-neutral-600">无培训</td>
                      <td className="p-4 text-center text-neutral-600">大班课</td>
                      <td className="p-4 text-center text-neutral-600">无指导</td>
                      <td className="p-4 text-center text-neutral-600">师徒制</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">社群支持</td>
                      <td className="p-4 text-center bg-accent/5"><span className="text-accent font-bold">24/7</span></td>
                      <td className="p-4 text-center text-neutral-600">论坛</td>
                      <td className="p-4 text-center text-neutral-600">有限时段</td>
                      <td className="p-4 text-center text-neutral-600">N/A</td>
                      <td className="p-4 text-center text-neutral-600">小群组</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">利润分成</td>
                      <td className="p-4 text-center bg-accent/5"><span className="text-accent font-bold">60-90%</span></td>
                      <td className="p-4 text-center text-neutral-600">60-90%</td>
                      <td className="p-4 text-center text-neutral-600">N/A</td>
                      <td className="p-4 text-center text-neutral-600">N/A</td>
                      <td className="p-4 text-center text-neutral-600">看情况</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">资金规模</td>
                      <td className="p-4 text-center bg-accent/5"><span className="text-accent font-bold">$100K-$2M<br/>✓</span></td>
                      <td className="p-4 text-center text-neutral-600">$10K-$200K<br/>✓</td>
                      <td className="p-4 text-center text-neutral-600">✗</td>
                      <td className="p-4 text-center text-neutral-600">✗</td>
                      <td className="p-4 text-center text-neutral-600">看情况</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">培养周期</td>
                      <td className="p-4 text-center bg-accent/5"><span className="text-accent font-bold">30-60天<br/>5阶段</span></td>
                      <td className="p-4 text-center text-neutral-600">1-3月</td>
                      <td className="p-4 text-center text-neutral-600">6-12月</td>
                      <td className="p-4 text-center text-neutral-600">N/A</td>
                      <td className="p-4 text-center text-neutral-600">不确定</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">实盘经验</td>
                      <td className="p-4 text-center bg-accent/5"><span className="text-accent font-bold">✓<br/>100%实战</span></td>
                      <td className="p-4 text-center text-neutral-600">△<br/>规则多</td>
                      <td className="p-4 text-center text-neutral-600">△</td>
                      <td className="p-4 text-center text-neutral-600">✗</td>
                      <td className="p-4 text-center text-neutral-600">看水平</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 职业晋升之路 */}
          <section className="section-spacing bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-4">职业晋升之路</h2>
                <p className="text-xl text-neutral-600">从新手到顶级交易员的完整培养体系</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 阶段1 */}
                <div className="bg-white p-6 border-l-4 border-accent">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-accent">01</span>
                    <span className="text-sm text-neutral-500">3天</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">规则学习</h3>
                  <p className="text-neutral-600 text-sm">姿势标准化，军事化管理，基础规则掌握</p>
                </div>

                {/* 阶段2 */}
                <div className="bg-white p-6 border-l-4 border-accent">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-accent">02</span>
                    <span className="text-sm text-neutral-500">15天</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">盈利练习</h3>
                  <p className="text-neutral-600 text-sm">心态稳定训练，灵动性强化，领悟力提升</p>
                </div>

                {/* 阶段3 */}
                <div className="bg-white p-6 border-l-4 border-accent">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-accent">03</span>
                    <span className="text-sm text-neutral-500">10天</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">盈利考核</h3>
                  <p className="text-neutral-600 text-sm">不漏单，不错单，不亏损。严格考核。</p>
                </div>

                {/* 阶段4 */}
                <div className="bg-white p-6 border-l-4 border-accent">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-accent">04</span>
                    <span className="text-sm text-neutral-500">20天</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">小额实盘</h3>
                  <p className="text-neutral-600 text-sm">日回撤≤5%，总回撤≤10%，系统固化。</p>
                </div>

                {/* 阶段5 */}
                <div className="bg-accent text-white p-6">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold">05</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">大额矩阵</h3>
                  <p className="text-white/90 text-sm mb-4">无限扩展</p>
                  <div className="space-y-1 text-sm">
                    <p>资金: $2M+</p>
                    <p>分成: 60% - 90%</p>
                  </div>
                </div>

                {/* 阶段6-9 */}
                <div className="bg-white p-6 border-l-4 border-primary">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-primary">06</span>
                    <span className="text-sm text-neutral-500">3个月</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">5分钟级别</h3>
                  <p className="text-neutral-600 text-sm">单向交易，级别升级。</p>
                </div>

                <div className="bg-white p-6 border-l-4 border-primary">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-primary">07</span>
                    <span className="text-sm text-neutral-500">6个月</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">15分钟级别</h3>
                  <p className="text-neutral-600 text-sm">多空双向交易。</p>
                </div>

                <div className="bg-white p-6 border-l-4 border-primary">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-primary">08</span>
                    <span className="text-sm text-neutral-500">1年</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">1小时级别</h3>
                  <p className="text-neutral-600 text-sm">多空双向交易，技术大成。</p>
                </div>

                <div className="bg-white p-6 border-l-4 border-primary lg:col-span-3">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold text-primary">09</span>
                    <span className="text-sm text-neutral-500">2年</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">4H/日级别</h3>
                  <p className="text-neutral-600 text-sm">顶级交易员，财富自由。</p>
                </div>
              </div>
            </div>
          </section>

          {/* 学员感言 */}
          <section className="section-spacing bg-white overflow-hidden">
            <div className="container-custom max-w-7xl mb-16">
              <div className="text-center">
                <h2 className="heading-lg mb-4">学员感言 & 收益展示</h2>
                <p className="text-xl text-neutral-600">来自真实学员的反馈与实盘收益截图</p>
              </div>
            </div>

            {/* 滚动展示 */}
            <div className="relative">
              <div className="flex gap-6 animate-scroll" style={{
                animation: 'scroll 60s linear infinite'
              }}>
                {/* 第一组 */}
                {testimonials.map((testimonial, index) => (
                  <div key={`first-${index}`} className="flex-shrink-0 w-80 bg-white border border-neutral-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-neutral-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{testimonial.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">{testimonial.date}</span>
                      <span className="text-xs text-accent font-medium">Verified Profit ✓</span>
                    </div>
                  </div>
                ))}
                {/* 第二组（重复用于无限滚动） */}
                {testimonials.map((testimonial, index) => (
                  <div key={`second-${index}`} className="flex-shrink-0 w-80 bg-white border border-neutral-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-neutral-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{testimonial.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">{testimonial.date}</span>
                      <span className="text-xs text-accent font-medium">Verified Profit ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 官方合作伙伴 */}
          <section className="section-spacing bg-neutral-50">
            <div className="container-custom max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="heading-lg mb-4">官方合作伙伴</h2>
                <p className="text-xl text-neutral-600">与全球领先的金融机构和平台建立战略合作伙伴关系</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-40">
                {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                  <div key={i} className="flex items-center justify-center p-6 bg-white border border-neutral-200">
                    <span className="text-neutral-400 text-sm">Partner {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 支持免费培训 */}
          <section className="section-spacing bg-white">
            <div className="container-custom max-w-5xl">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-4">支持免费培训</h2>
                <p className="text-xl text-neutral-600">我们提供完全免费的专业培训服务，您的捐赠将帮助我们持续为更多人提供高质量的培训</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 bg-neutral-50 border-l-4 border-accent">
                  <span className="text-sm text-accent font-medium">01 // 免费服务</span>
                  <h3 className="text-xl font-bold mt-3 mb-2">系统化培训课程</h3>
                  <p className="text-neutral-600 text-sm mb-3">30天完整的培训体系，从基础到实战，全部免费提供，无需支付任何学费</p>
                  <span className="text-xs text-accent">完整培训权限 →</span>
                </div>

                <div className="p-6 bg-neutral-50 border-l-4 border-accent">
                  <span className="text-sm text-accent font-medium">02 // 支持我们</span>
                  <h3 className="text-xl font-bold mt-3 mb-2">专业导师指导</h3>
                  <p className="text-neutral-600 text-sm mb-3">一对一导师指导，专业教练陪跑，帮助你快速成长，所有服务完全免费</p>
                  <span className="text-xs text-accent">S+</span>
                </div>

                <div className="p-6 bg-neutral-50 border-l-4 border-accent">
                  <span className="text-sm text-accent font-medium">03 // 社区贡献</span>
                  <h3 className="text-xl font-bold mt-3 mb-2">真实资金配置</h3>
                  <p className="text-neutral-600 text-sm mb-3">通过考核后获得真实资金管理权限，开启职业交易员生涯，无需自己投入资金</p>
                  <span className="text-xs text-accent">帮助更多人</span>
                </div>
              </div>

              <div className="max-w-2xl mx-auto bg-primary text-white p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">您的捐赠用途</h3>
                <p className="text-center text-white/80 mb-8">帮助我们持续为更多人提供免费培训</p>

                <div className="bg-white/10 p-6 mb-6">
                  <p className="text-sm mb-2">建议捐赠金额</p>
                  <p className="text-4xl font-bold mb-2">$1299</p>
                  <p className="text-sm text-white/60">+ $5.00 / 天</p>
                  <p className="text-xs text-white/50 mt-3">金额每日自动增加 $5</p>
                </div>

                <div className="bg-white/10 p-6">
                  <p className="text-sm mb-3">钱包地址 (USDT/USDC)</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="TVHj21ExdhdUS42Zx9KwqcxCDBKebqWwV7"
                      readOnly
                      className="flex-1 bg-white/5 border border-white/20 px-4 py-2 text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard('TVHj21ExdhdUS42Zx9KwqcxCDBKebqWwV7')}
                      className="px-6 py-2 bg-accent hover:bg-accent-light transition-colors"
                    >
                      {copiedAddress ? '已复制' : '复制'}
                    </button>
                  </div>
                  <p className="text-xs text-white/50 mt-2">USDT TRC20</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section-spacing-sm bg-accent text-white">
            <div className="container-custom max-w-4xl text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                立即开启交易员职业生涯
              </h2>
              <p className="text-xl mb-4">准备好开启你的外汇交易员生涯了吗？</p>
              <p className="text-lg text-white/80 mb-10">
                时间是唯一成本，淘汰是最大风险。准备就绪？预约面试。通过即入训。
              </p>

              <div className="grid md:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-white/70">完全免费培训</p>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-white/70">30天系统学习</p>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-white/70">通过即获资金</p>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-white/70">60-90%高分成</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link
                  href="/assessment"
                  className="px-10 py-4 bg-white text-accent font-bold hover:bg-neutral-100 transition-colors"
                >
                  立即心理测试
                </Link>
                <button
                  onClick={() => setShowInterviewModal(true)}
                  className="px-10 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-accent transition-colors"
                >
                  预约面试
                </button>
              </div>

              <p className="text-sm text-white/60 mb-10">请在充分了解并确认自己符合全部条件后再申请</p>

              {/* 数据统计 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">2,500+</div>
                  <div className="text-xs text-white/70">已培训学员</div>
                </div>
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">12%</div>
                  <div className="text-xs text-white/70">通过率</div>
                </div>
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">30</div>
                  <div className="text-xs text-white/70">平均培训周期（天）</div>
                </div>
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">$50K+</div>
                  <div className="text-xs text-white/70">最高月收益</div>
                </div>
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">2</div>
                  <div className="text-xs text-white/70">合作经纪商</div>
                </div>
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">2</div>
                  <div className="text-xs text-white/70">自营交易公司</div>
                </div>
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">60-90%</div>
                  <div className="text-xs text-white/70">分成比例</div>
                </div>
                <div className="bg-white/10 p-4">
                  <div className="text-3xl font-bold mb-1">45</div>
                  <div className="text-xs text-white/70">试用期（天）</div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <InterviewModal isOpen={showInterviewModal} onClose={() => setShowInterviewModal(false)} />

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </>
    );
  }

  // 首屏动画页面
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <DataBreathAnimation />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1
          className={`hero-title text-7xl md:text-8xl lg:text-9xl text-white tracking-wider transition-all duration-[2000ms] ${
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
