'use client';

import { useState } from 'react';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InterviewModal({ isOpen, onClose }: InterviewModalProps) {
  if (!isOpen) return null;

  const handleEmailClick = () => {
    window.location.href = 'mailto:mojie_yc@outlook.com?subject=mojie101';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white max-w-md w-full p-8 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 内容 */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-3xl font-serif font-bold text-primary mb-3">预约面试</h3>
            <p className="text-neutral-600">
              点击下方按钮将打开邮件客户端，发送预约申请
            </p>
          </div>

          <div className="mb-6 p-6 bg-neutral-50 border-l-4 border-accent">
            <p className="text-sm text-neutral-700 mb-2">
              <strong>收件人：</strong> mojie_yc@outlook.com
            </p>
            <p className="text-sm text-neutral-700">
              <strong>邮件主题：</strong> mojie101
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleEmailClick}
              className="w-full px-8 py-4 bg-accent text-white font-medium hover:bg-accent-light transition-colors"
            >
              打开邮件客户端
            </button>
            <button
              onClick={onClose}
              className="w-full px-8 py-4 border-2 border-neutral-300 text-neutral-700 font-medium hover:border-neutral-400 transition-colors"
            >
              取消
            </button>
          </div>

          <p className="mt-6 text-xs text-neutral-500">
            提示：请在邮件中详细说明您的情况和预约意向
          </p>
        </div>
      </div>
    </div>
  );
}
