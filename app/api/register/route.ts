import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hash } from 'bcryptjs';

// 生成随机用户名（格式：student + 8位随机数字）
function generateUsername(): string {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `student${randomNum}`;
}

// 生成随机密码（8位字母数字组合）
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, phone, email } = body;

    // 验证必填字段
    if (!name || !age || !phone || !email) {
      return NextResponse.json(
        { error: '所有字段都是必填项' },
        { status: 400 }
      );
    }

    // 验证年龄
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      return NextResponse.json(
        { error: '年龄必须在18-100之间' },
        { status: 400 }
      );
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: '手机号格式不正确' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 检查手机号是否已存在
    const { data: existingPhone } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingPhone) {
      return NextResponse.json(
        { error: '该手机号已被注册' },
        { status: 400 }
      );
    }

    // 生成唯一的用户名（最多尝试10次）
    let username = '';
    let attempts = 0;
    let isUnique = false;

    while (!isUnique && attempts < 10) {
      username = generateUsername();
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: '生成用户名失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 生成随机密码
    const password = generatePassword();

    // 加密密码
    const password_hash = await hash(password, 10);

    // 插入新用户
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        password_hash,
        role_status: '准学员',
        age: ageNum,
        phone,
        contact: email,
        registered_at: new Date().toISOString(),
        interview_status: '未申请',
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: '注册失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 返回用户名和明文密码（仅此一次）
    return NextResponse.json({
      success: true,
      username,
      password,
      name,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
