import nodemailer from 'nodemailer';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

// 发送邮件的基础函数
async function sendEmail({ to, subject, html }: EmailTemplate) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`邮件已发送至: ${to}`);
    return { success: true };
  } catch (error) {
    console.error('发送邮件失败:', error);
    return { success: false, error };
  }
}

// 面试安排通知
export async function sendInterviewScheduledEmail(data: {
  email: string;
  name: string;
  interviewTime: string;
  meetingNumber: string;
  notes?: string;
}) {
  const { email, name, interviewTime, meetingNumber, notes } = data;

  const subject = '明DAO - 面试安排通知';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #d4a574; font-size: 24px; margin-bottom: 20px;">面试安排通知</h1>

        <p style="color: #333; line-height: 1.6;">尊敬的 ${name}，</p>

        <p style="color: #333; line-height: 1.6;">您好！您的面试已安排，详情如下：</p>

        <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #d4a574; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong>面试时间：</strong>${new Date(interviewTime).toLocaleString('zh-CN')}</p>
          <p style="margin: 8px 0;"><strong>腾讯会议号：</strong>${meetingNumber}</p>
        </div>

        ${notes ? `
        <div style="background-color: #fff8f0; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #666;"><strong>面试须知：</strong></p>
          <p style="margin: 10px 0 0 0; color: #666; white-space: pre-wrap;">${notes}</p>
        </div>
        ` : ''}

        <p style="color: #333; line-height: 1.6; margin-top: 20px;">请准时参加面试，祝您面试顺利！</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; text-align: center;">
          明DAO 学员培训管理系统<br>
          此邮件由系统自动发送，请勿直接回复
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

// 面试结果通知
export async function sendInterviewResultEmail(data: {
  email: string;
  name: string;
  result: string;
}) {
  const { email, name, result } = data;

  const isPassed = result === '通过';
  const subject = `明DAO - 面试结果通知`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: ${isPassed ? '#10b981' : '#ef4444'}; font-size: 24px; margin-bottom: 20px;">面试结果通知</h1>

        <p style="color: #333; line-height: 1.6;">尊敬的 ${name}，</p>

        <div style="background-color: ${isPassed ? '#f0fdf4' : '#fef2f2'}; padding: 20px; border-left: 4px solid ${isPassed ? '#10b981' : '#ef4444'}; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; color: ${isPassed ? '#10b981' : '#ef4444'};">
            <strong>${isPassed ? '✓ 恭喜您，面试通过！' : '✗ 很遗憾，本次面试未通过'}</strong>
          </p>
        </div>

        ${isPassed ? `
        <p style="color: #333; line-height: 1.6;">您已成为明DAO的正式学员，可以开始学习课程了！</p>

        <p style="color: #333; line-height: 1.6; margin-top: 20px;">
          <strong>接下来的步骤：</strong><br>
          1. 登录学习系统<br>
          2. 查看学习阶段和资料<br>
          3. 按要求完成各阶段作业<br>
          4. 保持与团队长的沟通
        </p>
        ` : `
        <p style="color: #333; line-height: 1.6;">感谢您对明DAO的关注，欢迎您在准备更充分后再次申请。</p>
        `}

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; text-align: center;">
          明DAO 学员培训管理系统<br>
          此邮件由系统自动发送，请勿直接回复
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

// 作业审核结果通知
export async function sendAssignmentReviewEmail(data: {
  email: string;
  username: string;
  stageName: string;
  result: string;
  comment: string;
}) {
  const { email, username, stageName, result, comment } = data;

  const isPassed = result === '已通过';
  const subject = `明DAO - 作业审核结果通知`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #d4a574; font-size: 24px; margin-bottom: 20px;">作业审核结果</h1>

        <p style="color: #333; line-height: 1.6;">学员 ${username}，您好！</p>

        <p style="color: #333; line-height: 1.6;">您提交的<strong>${stageName}</strong>作业已审核完成。</p>

        <div style="background-color: ${isPassed ? '#f0fdf4' : '#fef2f2'}; padding: 20px; border-left: 4px solid ${isPassed ? '#10b981' : '#ef4444'}; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 18px; color: ${isPassed ? '#10b981' : '#ef4444'};">
            <strong>${isPassed ? '✓ 审核通过' : '✗ 需要修改'}</strong>
          </p>
        </div>

        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #666;"><strong>团队长反馈：</strong></p>
          <p style="margin: 0; color: #333; white-space: pre-wrap; line-height: 1.6;">${comment}</p>
        </div>

        ${isPassed ? `
        <p style="color: #333; line-height: 1.6;">恭喜您完成本阶段学习！请继续下一阶段的学习。</p>
        ` : `
        <p style="color: #333; line-height: 1.6;">请根据反馈修改后重新提交作业。</p>
        `}

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; text-align: center;">
          明DAO 学员培训管理系统<br>
          此邮件由系统自动发送，请勿直接回复
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}
