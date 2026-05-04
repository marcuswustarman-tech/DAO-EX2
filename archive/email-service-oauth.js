require('dotenv').config({ path: '.env.local' });
const { Client } = require('@microsoft/microsoft-graph-client');
const { ConfidentialClientApplication } = require('@azure/msal-node');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// PDF 文件路径
const pdfFiles = [
  'C:\\Users\\marcu\\Desktop\\网站建设\\DAO\\DAO-EX2\\筛选.pdf',
  'C:\\Users\\marcu\\Desktop\\网站建设\\DAO\\DAO-EX2\\第一面.pdf',
  'C:\\Users\\marcu\\Desktop\\网站建设\\DAO\\DAO-EX2\\第二面 .pdf'
];

// Azure AD 配置
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  }
};

const cca = new ConfidentialClientApplication(msalConfig);

// 获取访问令牌
async function getAccessToken() {
  const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
  };
  const response = await cca.acquireTokenByClientCredential(tokenRequest);
  return response.accessToken;
}

// 创建 Graph 客户端
async function getGraphClient() {
  const accessToken = await getAccessToken();
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
}

// 检查邮件
async function checkEmail() {
  try {
    const client = await getGraphClient();

    // 获取未读邮件
    const messages = await client
      .api(`/users/${process.env.EMAIL_USER}/messages`)
      .filter('isRead eq false')
      .select('subject,bodyPreview,from,id')
      .top(10)
      .get();

    console.log(`检查到 ${messages.value.length} 封未读邮件`);

    for (const message of messages.value) {
      const subject = message.subject || '';
      const body = message.bodyPreview || '';
      const from = message.from.emailAddress.address;

      // 检查是否包含关键词
      if (subject.includes('mojie1101') || body.includes('mojie1101')) {
        console.log(`检测到关键词，发送自动回复给: ${from}`);
        await sendAutoReply(from, client);

        // 标记为已读
        await client.api(`/users/${process.env.EMAIL_USER}/messages/${message.id}`).patch({
          isRead: true
        });
      }
    }
  } catch (error) {
    console.error('检查邮件失败:', error.message);
  }
}

// 发送自动回复
async function sendAutoReply(to, client) {
  try {
    // 读取 PDF 文件并转换为 base64
    const attachments = pdfFiles
      .filter(file => fs.existsSync(file))
      .map(file => ({
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: path.basename(file),
        contentBytes: fs.readFileSync(file).toString('base64')
      }));

    const message = {
      subject: '明DAO - 自动回复',
      body: {
        contentType: 'HTML',
        content: '<p>感谢您的邮件！</p><p>这是您请求的资料，请查收附件。</p>'
      },
      toRecipients: [
        {
          emailAddress: {
            address: to
          }
        }
      ],
      attachments: attachments
    };

    await client.api(`/users/${process.env.EMAIL_USER}/sendMail`).post({
      message: message
    });

    console.log(`自动回复已发送给: ${to}`);
  } catch (error) {
    console.error('发送邮件失败:', error.message);
  }
}

// 每 60 秒检查一次
setInterval(checkEmail, 60000);
console.log('邮件监控服务已启动（OAuth2）...');
checkEmail();
