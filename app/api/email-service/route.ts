import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: '邮件服务运行中',
    email: process.env.EMAIL_USER
  });
}

export async function POST(request: Request) {
  const { action } = await request.json();

  if (action === 'test') {
    return NextResponse.json({
      message: '测试成功',
      configured: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASSWORD
    });
  }

  return NextResponse.json({ error: '未知操作' }, { status: 400 });
}
