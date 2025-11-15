import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
      <div className="container-custom py-4 md:py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl md:text-3xl font-serif font-light tracking-tight hover:text-accent transition-colors">
            明DAO
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/about" className="text-sm font-light hover:text-accent transition-colors">
              关于我们
            </Link>
            <Link href="/assessment" className="text-sm font-light hover:text-accent transition-colors">
              开始测评
            </Link>
            <Link href="/blog" className="text-sm font-light hover:text-accent transition-colors">
              知识中心
            </Link>
            <Link href="/faq" className="text-sm font-light hover:text-accent transition-colors">
              常见问题
            </Link>
          </div>

          {/* 移动导航（简化版） */}
          <div className="md:hidden">
            <Link href="/assessment" className="text-sm font-medium text-accent">
              开始测评
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
