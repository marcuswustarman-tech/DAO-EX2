require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testSMTP() {
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
    await transporter.verify();
    console.log('✓ SMTP 连接成功！');
    console.log('邮箱:', process.env.EMAIL_USER);
  } catch (error) {
    console.error('✗ SMTP 连接失败:', error.message);
  }
}

testSMTP();
