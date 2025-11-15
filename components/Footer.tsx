import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white section-spacing-sm">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-xl md:text-2xl font-serif mb-4">明DAO</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              培养极少数，劝返大多数。<br />
              我们致力于发现和培养真正的交易天才。
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="text-neutral-400 hover:text-white transition-colors">
                  开始测评
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-400 hover:text-white transition-colors">
                  知识中心
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-white transition-colors">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">联系方式</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>钉钉：iiu_z896deh8c</li>
              <li>邮箱：mojie_yc@outlook.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400">
              &copy; 2024 明DAO. 保留所有权利。
            </p>
            <p className="text-xs text-neutral-500">
              风险提示：交易存在风险，过往业绩不代表未来表现
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
