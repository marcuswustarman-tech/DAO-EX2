import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// 示例博客文章（后续可以从数据库或CMS获取）
const blogPosts = [
  {
    id: 1,
    title: '为什么95%的散户交易员都会失败？',
    excerpt: '探讨散户交易员失败的五大核心原因：缺乏系统、情绪化交易、过度杠杆、不切实际的期望以及缺乏风险管理。',
    category: '交易心理',
    date: '2024-11-10',
    readTime: '8分钟',
  },
  {
    id: 2,
    title: '职业交易员的一天：纪律与耐心的艺术',
    excerpt: '深入了解一位成功职业交易员的日常作息、交易准备、执行流程和复盘习惯。真实记录如何将交易变成一门专业技艺。',
    category: '职业发展',
    date: '2024-11-08',
    readTime: '10分钟',
  },
  {
    id: 3,
    title: '风险管理：交易中最被低估的技能',
    excerpt: '为什么止损是交易的生命线？如何设置合理的止损位？如何计算仓位大小？本文深入解析风险管理的核心原则。',
    category: '风险管理',
    date: '2024-11-05',
    readTime: '12分钟',
  },
  {
    id: 4,
    title: '从混沌到秩序：建立你的交易系统',
    excerpt: '一个有效的交易系统包含哪些要素？如何从市场噪声中识别真正的交易信号？系统化交易的完整指南。',
    category: '交易系统',
    date: '2024-11-03',
    readTime: '15分钟',
  },
  {
    id: 5,
    title: '外汇市场vs加密货币市场：职业交易员如何选择？',
    excerpt: '对比两大市场的特点、风险、机会和适合人群。帮助你找到最适合自己的交易市场。',
    category: '市场分析',
    date: '2024-11-01',
    readTime: '10分钟',
  },
  {
    id: 6,
    title: '情绪控制：交易中的隐形杀手',
    excerpt: '恐惧、贪婪、报复性交易...如何识别和克服这些常见的情绪陷阱？顶级交易员的心理训练方法。',
    category: '交易心理',
    date: '2024-10-28',
    readTime: '9分钟',
  },
  {
    id: 7,
    title: '自营交易公司如何评估和培养交易员？',
    excerpt: '揭秘自营交易公司的选拔标准、培训流程和考核机制。了解行业内幕，为成为职业交易员做好准备。',
    category: '职业发展',
    date: '2024-10-25',
    readTime: '11分钟',
  },
  {
    id: 8,
    title: '复盘的力量：每日15分钟如何改变你的交易',
    excerpt: '系统化复盘的具体方法、关键问题和常见陷阱。优秀交易员与普通交易员的最大差距往往在盘后。',
    category: '交易技巧',
    date: '2024-10-22',
    readTime: '8分钟',
  },
  {
    id: 9,
    title: '仓位管理：决定长期盈利的关键变量',
    excerpt: '固定仓位 vs 动态仓位？如何根据账户大小和风险承受力计算最优仓位？实战案例分析。',
    category: '风险管理',
    date: '2024-10-20',
    readTime: '10分钟',
  },
  {
    id: 10,
    title: '为什么耐心是交易员最重要的品质？',
    excerpt: '好的交易员懂得等待。探讨耐心在交易中的作用，以及如何培养和保持这种品质。',
    category: '交易心理',
    date: '2024-10-18',
    readTime: '7分钟',
  },
];

const categories = ['全部', '交易心理', '风险管理', '职业发展', '交易系统', '交易技巧', '市场分析'];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Hero */}
        <section className="section-spacing-sm bg-white border-b border-neutral-200">
          <div className="container-custom max-w-5xl">
            <h1 className="heading-xl mb-6">知识中心</h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              深入了解交易的本质，掌握成为职业交易员的核心技能
            </p>
          </div>
        </section>

        {/* 分类筛选 */}
        <section className="section-spacing-sm">
          <div className="container-custom max-w-5xl">
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-5 py-2 text-sm border transition-colors ${
                    cat === '全部'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 文章列表 */}
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white border border-neutral-200 p-8 hover:border-primary transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-500">{post.date}</span>
                    <span className="text-xs text-neutral-500">• {post.readTime}</span>
                  </div>

                  <h2 className="text-2xl font-medium mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-neutral-600 leading-relaxed mb-6">{post.excerpt}</p>

                  <div className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors">
                    <span className="text-sm font-medium">阅读全文</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </article>
              ))}
            </div>

            {/* 分页（占位） */}
            <div className="mt-16 flex justify-center gap-2">
              <button className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-primary transition-colors">
                上一页
              </button>
              <button className="px-4 py-2 bg-primary text-white">1</button>
              <button className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-primary transition-colors">
                2
              </button>
              <button className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-primary transition-colors">
                3
              </button>
              <button className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-primary transition-colors">
                下一页
              </button>
            </div>
          </div>
        </section>

        {/* 订阅CTA */}
        <section className="section-spacing-sm bg-neutral-50">
          <div className="container-custom max-w-3xl text-center">
            <h2 className="heading-md mb-6">获取更新</h2>
            <p className="text-neutral-600 mb-8">
              订阅我们的newsletter，第一时间获取最新的交易见解和培训资讯
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary px-8">
                订阅
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
