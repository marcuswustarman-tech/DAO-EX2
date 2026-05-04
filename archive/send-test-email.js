require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // 发给自己
      subject: '测试邮件 mojie1101',
      text: '这是一封测试邮件，包含关键词 mojie1101',
      html: '<p>这是一封测试邮件，包含关键词 <strong>mojie1101</strong></p>'
    });

    console.log('✓ 测试邮件已发送到:', process.env.EMAIL_USER);
    console.log('等待 60 秒后检查是否收到自动回复...');
  } catch (error) {
    console.error('✗ 发送失败:', error.message);
  }
}

sendTestEmail();
