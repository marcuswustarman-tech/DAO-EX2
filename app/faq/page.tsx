'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  {
    category: '关于明DAO',
    questions: [
      {
        q: '明DAO是一家什么样的公司？',
        a: '明DAO是一家专业的自营交易员孵化平台。我们通过严格的筛选和系统化的培训，在30个工作日内将具备潜质的新人培养成专业交易员，并为他们提供实盘资金和行业领先的利润分成。',
      },
      {
        q: '你们的通过率是多少？',
        a: '我们的整体通过率约为10-15%。我们坚持"培养极少数，劝返大多数"的理念，只选择真正适合成为职业交易员的人才。初步心理测评的通过率约为20%，完成30天孵化期并通过最终考核的比例约为50-60%。',
      },
      {
        q: '为什么通过率这么低？',
        a: '职业交易是一项极具挑战性的工作，需要极强的纪律性、情绪控制能力和耐心。我们的低通过率是对学员负责的表现——与其让不适合的人浪费时间和精力，不如在早期就进行严格筛选。',
      },
    ],
  },
  {
    category: '申请与筛选',
    questions: [
      {
        q: '申请流程是怎样的？',
        a: '1) 完成在线心理测评（30题，约8分钟）\n2) 测评通过后，联系我们的钉钉或邮箱进行深入沟通\n3) 面试通过后，进入30天孵化期\n4) 通过孵化期考核，获得实盘资金',
      },
      {
        q: '心理测评主要考察什么？',
        a: '我们的心理测评评估五大维度：风险承受力、纪律性、情绪稳定性、耐心与专注力、学习动机。每个维度必须达到70分以上，且没有任何维度低于50分。此外，任何体现"暴富心态"或"赌博心态"的答案都会导致直接淘汰。',
      },
      {
        q: '我需要有交易经验吗？',
        a: '不需要。我们更看重您的心理素质、学习能力和纪律性，而非过往经验。实际上，完全没有交易经验的"白纸"学员往往更容易培养，因为他们没有形成错误的交易习惯。',
      },
      {
        q: '如果被劝退，还能重新申请吗？',
        a: '可以，但需要通过捐赠重新申请。我们相信，真正想要成为职业交易员的人会珍惜每一次机会。',
      },
    ],
  },
  {
    category: '培训与考核',
    questions: [
      {
        q: '30天孵化期具体学什么？',
        a: '第1-5日：学习15个标准进场点和交易铁律\n第6-20日：在模拟盘练习，找到适合的交易品种，建立一致性\n第21-30日：连续10个交易日的盈利考核\n每晚20:00有团队复盘会议，导师会一对一指导。',
      },
      {
        q: '孵化期需要全职投入吗？',
        a: '是的。我们要求学员周一至周五13:30-21:30在线，并且拥有独立不被打扰的交易环境。这是成为职业交易员的必要投入。',
      },
      {
        q: '什么是"交易铁律"？',
        a: '交易铁律是我们平台的核心规则，包括但不限于：绝不移动止损、严格执行交易计划、严格控制回撤、不错单不漏单。任何违反铁律的行为都会被实时监控，严重者将被劝退。',
      },
      {
        q: '考核标准是什么？',
        a: '孵化期考核主要看操作一致性和纪律性，而非盈利金额。实盘阶段的风控要求是：日回撤<20%，周总回撤<30%。我们更关注长期稳定性，而非短期爆发力。',
      },
    ],
  },
  {
    category: '资金与分成',
    questions: [
      {
        q: '我需要自己出资吗？',
        a: '完全不需要。学员全程不需要任何出资。我们提供所有的培训和实盘资金。唯一的可选付费项目是云端交易环境（用于保证交易环境的稳定性和公平性）。',
      },
      {
        q: '实盘资金有多少？',
        a: '通过孵化期后，您会先获得小额实盘资金。经过20个工作日的稳定盈利后，资金量会阶梯式增长，最高可达$200,000。具体金额取决于您的盈利曲线和风控表现。',
      },
      {
        q: '利润分成比例是多少？',
        a: '60%-90%，具体比例取决于您的资金量和业绩表现。这是行业内极具竞争力的分成比例。',
      },
      {
        q: '什么时候能拿到分成？',
        a: '我们按周期结算分成（具体周期在合同中约定）。只要您的交易符合风控要求并产生盈利，就能获得相应分成。',
      },
    ],
  },
  {
    category: '工作与发展',
    questions: [
      {
        q: '成为职业交易员后的工作时间？',
        a: '进入大额资金矩阵后，工作时间和地点完全自由。您只需要严格遵守风控规则，按照自己的交易系统执行即可。这是职业交易员最大的优势之一。',
      },
      {
        q: '职业交易员的收入预期？',
        a: '这完全取决于您的交易水平和资金量。假设您管理$100,000资金，月收益率5%（保守估计），按70%分成计算，您的月收入为$3,500。随着资金量和技能的提升，收入会相应增长。',
      },
      {
        q: '有职业发展路径吗？',
        a: '有的。我们的终极目标是将交易员培养成具备基金经理潜力的专业人才。表现优异的交易员有机会晋升为导师、风控官，或管理更大规模的资金。',
      },
      {
        q: '可以同时为其他公司交易吗？',
        a: '这需要在合同中明确约定。通常情况下，为了避免利益冲突，我们要求交易员专注于平台资金的管理。',
      },
    ],
  },
  {
    category: '技术与支持',
    questions: [
      {
        q: '需要什么样的电脑配置？',
        a: 'Windows系统（推荐Windows 10或更高版本），稳定的网络连接，以及能够流畅运行交易软件的配置（一般的办公电脑即可）。',
      },
      {
        q: '使用什么交易平台？',
        a: '目前主要使用MT4/MT5进行外汇交易。加密货币交易会使用主流交易所的专业交易平台。我们会在培训中教授所有必要的软件使用技能。',
      },
      {
        q: '有技术支持吗？',
        a: '有的。我们有专门的技术支持团队，解决交易软件、网络连接等技术问题。此外，导师团队也会提供交易策略和心理方面的支持。',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Hero */}
        <section className="section-spacing-sm bg-white border-b border-neutral-200">
          <div className="container-custom max-w-4xl">
            <h1 className="heading-xl mb-6">常见问题</h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              关于明DAO自营交易员孵化计划的常见疑问解答
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-spacing">
          <div className="container-custom max-w-4xl">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16 last:mb-0">
                <h2 className="text-2xl font-medium mb-8 pb-3 border-b-2 border-accent">
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const isOpen = openIndex === `${categoryIndex}-${questionIndex}`;
                    return (
                      <div
                        key={questionIndex}
                        className="border border-neutral-200 bg-white overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full text-left p-6 flex justify-between items-start gap-4 hover:bg-neutral-50 transition-colors"
                        >
                          <span className="flex-1 font-medium text-lg">{faq.q}</span>
                          <svg
                            className={`flex-shrink-0 w-6 h-6 text-accent transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-[500px]' : 'max-h-0'
                          }`}
                        >
                          <div className="px-6 pb-6 text-neutral-600 leading-relaxed whitespace-pre-line">
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 联系CTA */}
        <section className="section-spacing-sm bg-neutral-50">
          <div className="container-custom max-w-3xl text-center">
            <h2 className="heading-md mb-6">还有其他问题？</h2>
            <p className="text-neutral-600 mb-8">
              如果您的问题没有在这里得到解答，欢迎直接联系我们
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">钉钉：</span>
                <span className="font-medium">iiu_z896deh8c</span>
              </div>
              <span className="hidden md:inline text-neutral-400">|</span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">邮箱：</span>
                <span className="font-medium">mojie_yc@outlook.com</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
