require('dotenv').config({ path: '.env.local' });
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 邮箱配置
const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: 'imap.zoho.com',
  port: 993,
  tls: true,
  authTimeout: 10000,
  tlsOptions: { rejectUnauthorized: false }
};

// SMTP 配置
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// PDF 文件路径
const pdfFiles = [
  'C:\\Users\\marcu\\Desktop\\网站建设\\DAO\\DAO-EX2\\筛选.pdf',
  'C:\\Users\\marcu\\Desktop\\网站建设\\DAO\\DAO-EX2\\第一面.pdf',
  'C:\\Users\\marcu\\Desktop\\网站建设\\DAO\\DAO-EX2\\第二面 .pdf'
];

// 检查邮件
function checkEmail() {
  console.log('正在连接 IMAP...');
  const imap = new Imap(imapConfig);

  imap.once('ready', () => {
    console.log('IMAP 连接成功！');
    imap.openBox('INBOX', false, (err, box) => {
      if (err) throw err;

      // 搜索未读邮件
      imap.search(['UNSEEN'], (err, results) => {
        if (err) throw err;
        if (!results || !results.length) {
          console.log('没有新邮件');
          imap.end();
          return;
        }

        console.log(`发现 ${results.length} 封未读邮件`);
        const fetch = imap.fetch(results, { bodies: '' });

        fetch.on('message', (msg) => {
          msg.on('body', (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error('解析邮件失败:', err);
                return;
              }

              const subject = parsed.subject || '';
              const text = parsed.text || '';
              const from = parsed.from.value[0].address;

              console.log(`检查邮件 - 发件人: ${from}, 标题: ${subject}`);

              // 检查是否包含关键词 mojie1101
              if (subject.includes('mojie1101') || text.includes('mojie1101')) {
                console.log(`检测到关键词，发送自动回复给: ${from}`);
                await sendAutoReply(from);
              } else {
                console.log('未包含关键词 mojie1101');
              }
            });
          });
        });

        fetch.once('end', () => {
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP 错误:', err);
  });

  imap.connect();
}

// 发送自动回复
async function sendAutoReply(to) {
  try {
    const attachments = pdfFiles
      .filter(file => fs.existsSync(file))
      .map(file => ({
        filename: path.basename(file),
        path: file
      }));

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: '明DAO - 自动回复',
      text: '感谢您的邮件！这是您请求的资料。',
      html: '<p>感谢您的邮件！</p><p>这是您请求的资料，请查收附件。</p>',
      attachments: attachments
    });

    console.log(`自动回复已发送给: ${to}`);
  } catch (error) {
    console.error('发送邮件失败:', error);
  }
}

// 每 60 秒检查一次
setInterval(checkEmail, 60000);
console.log('邮件监控服务已启动...');
checkEmail();
