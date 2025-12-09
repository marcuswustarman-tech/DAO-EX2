'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  isAdmin,
  canApplyInterview,
  isActiveStudent,
  canReviewAssignment,
  isTeamLeader
} from '@/lib/permissions';

export default function AppNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!session?.user) {
    return null;
  }

  const roleStatus = session.user.role_status as any;

  // 根据角色生成菜单项
  const getMenuItems = () => {
    const items = [
      { label: '首页', href: '/', show: true },
    ];

    // 准学员菜单
    if (canApplyInterview(roleStatus)) {
      items.push(
        { label: '申请面试', href: '/interview/apply', show: true },
      );
    }

    // 学员菜单
    if (isActiveStudent(roleStatus)) {
      items.push(
        { label: '学习中心', href: '/learning', show: true },
        { label: '我的作业', href: '/learning/assignments', show: true },
      );
    }

    // 团队长菜单
    if (isTeamLeader(roleStatus)) {
      items.push(
        { label: '面试管理', href: '/interview/manage', show: true },
        { label: '作业审核', href: '/assignments/review', show: true },
      );
    }

    // 管理员菜单
    if (isAdmin(roleStatus)) {
      items.push(
        { label: '管理后台', href: '/admin', show: true },
      );
    }

    return items.filter(item => item.show);
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-serif text-accent">明DAO</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 transition-colors ${
                  isActive(item.href)
                    ? 'text-accent bg-accent/10'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{session.user.name}</div>
                  <div className="text-xs text-neutral-500">{roleStatus}</div>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 shadow-lg">
                  <Link
                    href="/console"
                    className="block px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-700 border-t border-neutral-700"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 transition-colors ${
                  isActive(item.href)
                    ? 'text-accent bg-accent/10'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-neutral-800 mt-4 pt-4">
              <div className="px-4 py-2 text-sm text-neutral-500">
                {session.user.name} · {roleStatus}
              </div>
              <Link
                href="/console"
                className="block px-4 py-3 text-neutral-300 hover:bg-neutral-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                个人中心
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left px-4 py-3 text-neutral-300 hover:bg-neutral-800"
              >
                退出登录
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
