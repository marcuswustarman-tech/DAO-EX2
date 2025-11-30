'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataBreathAnimation from '@/components/DataBreathAnimation';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Hero Section with Deep Starry Background */}
        <section className="relative overflow-hidden" style={{ height: '70vh' }}>
          {/* 深邃星空背景 */}
          <DataBreathAnimation />

          {/* 内容叠加层 */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <div className="container-custom max-w-4xl text-center">
              <h1 className="heading-xl mb-8 text-white drop-shadow-lg">关于明DAO</h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md">
                培养极少数，劝返大多数
              </p>
            </div>
          </div>
        </section>

        {/* 核心理念 */}
        <section className="section-spacing">
          <div className="container-custom max-w-5xl">
            <div className="mb-20">
              <h2 className="heading-lg mb-12">我们的理念</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <div className="w-12 h-1 bg-accent mb-6"></div>
                  <h3 className="text-2xl font-medium mb-4">严格筛选</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    我们深知，并非所有人都适合成为职业交易员。通过科学的心理测评和严格的面试流程，
                    我们只选择那些真正具备交易员潜质的人才——通过率仅为10-15%。
                  </p>
                </div>
                <div>
                  <div className="w-12 h-1 bg-accent mb-6"></div>
                  <h3 className="text-2xl font-medium mb-4">系统培养</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    30个工作日的系统化培训，我们传授的不仅是交易技巧，更是一套经过验证的交易哲学。
                    我们教会学员如何规避常见的心理陷阱，建立稳定的交易系统。
                  </p>
                </div>
                <div>
                  <div className="w-12 h-1 bg-accent mb-6"></div>
                  <h3 className="text-2xl font-medium mb-4">严格纪律</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    我们坚持"交易铁律"：不移动止损、严格执行交易计划、控制回撤。
                    任何违反铁律的行为都会被实时监控，严重者将被劝退。这不是严苛，而是对学员负责。
                  </p>
                </div>
                <div>
                  <div className="w-12 h-1 bg-accent mb-6"></div>
                  <h3 className="text-2xl font-medium mb-4">长期合作</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    通过考核的交易员将获得我们提供的实盘资金（最高$200,000），
                    享受60%-90%的利润分成。我们寻找的不是短期合作者，而是能够共同成长的长期伙伴。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 培养流程详解 */}
        <section className="section-spacing bg-neutral-50">
          <div className="container-custom max-w-5xl">
            <h2 className="heading-lg mb-12 text-center">培养流程</h2>

            <div className="space-y-16">
              {/* 阶段0 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block px-4 py-2 bg-accent text-white text-sm font-medium">
                    筛选阶段
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium mb-4">初步筛选</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    完成在线心理测评，通过后预约面试。我们会评估您的风险承受力、纪律性、
                    情绪稳定性、耐心与专注力以及学习动机。只有真正适合的人才能进入孵化阶段。
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>5大维度、30道问题的专业心理测评</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>所有维度必须达到70分以上</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>通过率：10-15%</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 阶段1 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-medium">
                    第1-5日
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium mb-4">规则学习</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    学习15个标准进场点，理解每个进场点背后的市场逻辑和风险控制原则。
                    通过线上考核后方可进入下一阶段。未通过者将被劝退。
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>系统学习15个标准进场点</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>理解交易铁律和风险控制原则</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>通过线上考核</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 阶段2 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-medium">
                    第6-20日
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium mb-4">盈利练习</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    在模拟盘中找到1-3个适合自己的交易品种，严格按照规则进行练习。
                    目标是做到不错单、不漏单、不亏损。每日20:00参加团队复盘会议。
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>模拟盘练习，找到适合的交易品种</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>严格遵守交易规则，建立一致性</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>每日复盘，导师一对一指导</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 阶段3 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-medium">
                    第21-30日
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium mb-4">盈利考核</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    连续10个交易日保持操作一致性，严格执行交易计划，通过考核后进入实盘阶段。
                    未通过者将被劝退，可通过捐赠重新申请。
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>连续10个交易日操作一致性考核</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>严格的风控指标：不能触碰任何交易铁律</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>导师团队综合评估</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 阶段4 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block px-4 py-2 bg-accent text-white text-sm font-medium">
                    实盘阶段
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium mb-4">职业交易员</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    获得小额实盘资金，经过20个工作日的稳定盈利后，逐步晋升至大额资金矩阵。
                    享受60%-90%的利润分成，工作时间自由，真正成为职业交易员。
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>小额实盘起步，风控要求极其严格（日回撤&lt;20%，周总回撤&lt;30%）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>曲线稳定后，资金量阶梯式增长，最高$200,000</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>利润分成60%-90%，工作时间和地点自由</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 我们寻找什么样的人 */}
        <section className="section-spacing">
          <div className="container-custom max-w-4xl">
            <h2 className="heading-lg mb-12 text-center">我们寻找什么样的人</h2>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-medium">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">大专学历以上，35岁以下</h4>
                  <p className="text-sm text-neutral-600">具备基础的学习能力和理解能力</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-medium">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">认真、细心、耐心</h4>
                  <p className="text-sm text-neutral-600">交易需要极高的专注度和细致度</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-medium">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">性格内向稳重</h4>
                  <p className="text-sm text-neutral-600">避免情绪化决策，保持理性</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-medium">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">纪律严明且执行力强</h4>
                  <p className="text-sm text-neutral-600">能够严格遵守交易规则</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-medium">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">能连续投入30个工作日</h4>
                  <p className="text-sm text-neutral-600">约45天的全职投入</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-medium">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">独立不被打扰的交易环境</h4>
                  <p className="text-sm text-neutral-600">Windows电脑和稳定的网络</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-neutral-100 border-l-4 border-accent">
              <h4 className="font-medium mb-3">我们明确排除的人群：</h4>
              <ul className="space-y-2 text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>抱有"暴富"或"快速致富"心态的人</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>将交易视为赌博的人</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>无法承受连续亏损的人</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>缺乏纪律性和执行力的人</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-spacing-sm bg-primary text-white">
          <div className="container-custom max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
              准备好接受挑战了吗？
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              只有极少数人能够通过我们的筛选和培养流程。<br />
              如果您认为自己就是那个人，现在就开始测评。
            </p>
            <a href="/assessment" className="inline-block px-10 py-4 bg-white text-primary font-medium hover:bg-neutral-100 transition-colors">
              开始心理测评
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
