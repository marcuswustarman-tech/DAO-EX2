'use client';

export default function MoJie101Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-4 text-slate-800">三封信</h1>
        <p className="text-center text-slate-600 mb-16 text-lg">Three Letters</p>

        {/* 第一封信 */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 border border-slate-200">
          <h2 className="text-3xl font-bold mb-8 text-slate-800 border-b-2 border-slate-200 pb-4">第一面</h2>
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
            <p className="text-xl font-semibold mb-6">亲爱的候选人：</p>

            <p>欢迎来到明道交易的招聘流程。我们很高兴您对加入我们团队表现出兴趣。</p>

            <p>明道交易是一家专注于金融市场交易和投资的专业机构。我们致力于为客户提供卓越的交易策略和风险管理服务。我们的团队由经验丰富的交易员、分析师和技术专家组成，共同追求卓越的投资回报。</p>

            <p className="font-semibold mt-8 mb-4">我们寻找的人才特质：</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>对金融市场充满热情，具有强烈的学习欲望</li>
              <li>具备出色的分析能力和逻辑思维</li>
              <li>能够在压力下保持冷静，做出理性决策</li>
              <li>具有团队合作精神，同时能够独立工作</li>
              <li>对数据敏感，善于发现市场机会</li>
            </ul>

            <p className="mt-8">我们的招聘流程包括多个阶段，旨在全面评估候选人的能力和潜力。每个阶段都是为了确保我们找到最适合的人才，同时也让您更好地了解我们的公司文化和工作环境。</p>

            <p className="font-semibold mt-8">招聘流程概述：</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>初步筛选：审核简历和基本资格</li>
              <li>在线评估：测试基础知识和技能</li>
              <li>第一轮面试：与HR团队进行初步交流</li>
              <li>技术面试：评估专业能力和技术水平</li>
              <li>最终面试：与高级管理层会面</li>
              <li>背景调查：核实工作经历和资质</li>
              <li>录用决定：发放offer并商讨入职事宜</li>
            </ol>

            <p className="mt-8">整个流程通常需要2-4周时间。我们会在每个阶段结束后及时与您沟通进展情况。</p>

            <p className="mt-8 font-semibold">下一步行动：</p>
            <p>请仔细阅读接下来的两封信，它们将为您提供更详细的信息和指导。如果您准备好继续这个过程，请按照第二封信中的说明进行操作。</p>

            <p className="mt-12 text-right">
              <span className="block">明道交易招聘团队</span>
              <span className="block text-slate-600">{new Date().getFullYear()}年</span>
            </p>
          </div>
        </div>

        {/* 第二封信 */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 border border-slate-200">
          <h2 className="text-3xl font-bold mb-8 text-slate-800 border-b-2 border-slate-200 pb-4">第二面</h2>
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
            <p className="text-xl font-semibold mb-6">关于面试准备的重要信息：</p>

            <p>恭喜您通过了初步筛选！现在，我们想为您提供一些关于如何准备面试的建议和指导。</p>

            <p className="font-semibold mt-8 mb-4">面试准备清单：</p>

            <div className="bg-slate-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-4">1. 了解公司</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>研究明道交易的历史、使命和价值观</li>
                <li>了解我们的主要业务领域和服务</li>
                <li>关注我们最近的新闻和市场动态</li>
                <li>熟悉我们的竞争对手和行业地位</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-4">2. 技术准备</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>复习金融市场基础知识</li>
                <li>准备讨论您的交易策略和投资理念</li>
                <li>熟悉常用的技术分析工具和指标</li>
                <li>准备案例分析和问题解决的例子</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-4">3. 行为面试准备</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>准备STAR方法（情境、任务、行动、结果）的回答</li>
                <li>思考您过去的成功案例和挑战</li>
                <li>准备讨论您的职业目标和发展规划</li>
                <li>思考为什么想加入明道交易</li>
              </ul>
            </div>

            <p className="font-semibold mt-8 mb-4">面试当天注意事项：</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>着装得体，展现专业形象</li>
              <li>提前15分钟到达（线上面试提前测试设备）</li>
              <li>准备好笔记本和笔，记录重要信息</li>
              <li>准备至少3个有深度的问题向面试官提问</li>
              <li>保持积极的态度和良好的肢体语言</li>
            </ul>

            <p className="mt-8 font-semibold">常见面试问题示例：</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>请介绍一下您自己和您的背景</li>
              <li>为什么对金融交易感兴趣？</li>
              <li>描述一次您在压力下做出重要决策的经历</li>
              <li>您如何看待风险管理？</li>
              <li>您的长期职业目标是什么？</li>
              <li>您如何处理失败和挫折？</li>
              <li>为什么选择明道交易？</li>
            </ol>

            <p className="mt-8">请记住，面试是双向的过程。我们在评估您的同时，您也在评估我们是否是您理想的工作场所。请充分利用这个机会了解我们的团队和文化。</p>

            <p className="mt-8 font-semibold">预约面试：</p>
            <p>请访问我们的面试预约系统，选择适合您的时间段。我们会在24小时内确认您的预约。</p>

            <p className="mt-12 text-right">
              <span className="block">祝您面试顺利！</span>
              <span className="block">明道交易人力资源部</span>
            </p>
          </div>
        </div>

        {/* 第三封信 - 筛选标准 */}
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200">
          <h2 className="text-3xl font-bold mb-8 text-slate-800 border-b-2 border-slate-200 pb-4">筛选标准</h2>
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
            <p className="text-xl font-semibold mb-6">明道交易人才筛选标准：</p>

            <p>为了确保我们选拔到最优秀的人才，我们制定了一套全面的筛选标准。这些标准涵盖了专业能力、个人素质和文化契合度等多个维度。</p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8 border-l-4 border-blue-500">
              <h3 className="font-bold text-xl mb-4 text-blue-900">核心能力要求</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-800">1. 专业知识（权重：30%）</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>金融市场基础知识扎实</li>
                    <li>了解各类金融工具和衍生品</li>
                    <li>熟悉技术分析和基本面分析</li>
                    <li>具备风险管理意识</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-800">2. 分析能力（权重：25%）</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>数据分析和解读能力</li>
                    <li>逻辑思维和推理能力</li>
                    <li>问题识别和解决能力</li>
                    <li>市场趋势判断能力</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-800">3. 心理素质（权重：20%）</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>压力承受能力</li>
                    <li>情绪控制能力</li>
                    <li>决策果断性</li>
                    <li>风险承受能力</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-800">4. 学习能力（权重：15%）</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>快速学习新知识的能力</li>
                    <li>自我提升的主动性</li>
                    <li>适应变化的灵活性</li>
                    <li>持续改进的意识</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-800">5. 团队协作（权重：10%）</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>沟通表达能力</li>
                    <li>团队合作精神</li>
                    <li>领导潜力</li>
                    <li>文化契合度</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500 mb-8">
              <h3 className="font-bold text-lg mb-4 text-amber-900">评分标准</h3>
              <div className="space-y-3">
                <p><span className="font-semibold">优秀（90-100分）：</span>全面超出预期，展现卓越能力</p>
                <p><span className="font-semibold">良好（80-89分）：</span>符合所有要求，表现出色</p>
                <p><span className="font-semibold">合格（70-79分）：</span>基本符合要求，有发展潜力</p>
                <p><span className="font-semibold">待提高（60-69分）：</span>部分符合要求，需要培训</p>
                <p><span className="font-semibold">不合格（60分以下）：</span>不符合基本要求</p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-4 text-green-900">录用决策流程</h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>所有面试官独立评分</li>
                <li>汇总各维度得分</li>
                <li>计算加权总分</li>
                <li>总分≥80分进入候选池</li>
                <li>招聘委员会综合评估</li>
                <li>最终录用决定</li>
              </ol>
            </div>

            <p className="mt-8 italic text-slate-600">
              注：以上标准仅供参考。我们相信每个人都有独特的优势和潜力。即使某些方面暂时不足，只要您展现出强烈的学习意愿和成长潜力，我们都愿意给予机会。
            </p>

            <p className="mt-12 text-center font-semibold text-lg text-slate-800">
              期待与优秀的您共同成长！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
