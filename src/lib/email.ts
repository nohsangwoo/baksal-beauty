import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendGmailEmail({ to, subject, text, html }: SendEmailInput) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER 또는 GMAIL_APP_PASSWORD 환경변수가 설정되지 않았습니다.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  return transporter.sendMail({
    from: `"BAKSAL BEAUTY" <${user}>`,
    to,
    subject,
    text,
    html,
    replyTo: user,
  });
}

export function createInquiryReplyEmailHtml({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  const escapedName = escapeHtml(name);
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
    <div style="margin:0;background:#1f1715;padding:32px;font-family:Arial,'Noto Sans KR',sans-serif;color:#fff8ef;">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,248,239,.18);border-radius:8px;background:#0d0b0c;padding:32px;">
        <p style="margin:0 0 12px;color:#dec47b;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">BAKSAL BEAUTY</p>
        <h1 style="margin:0 0 24px;font-size:28px;line-height:1.35;color:#fff8ef;">${escapedName}님 문의 답변드립니다.</h1>
        <div style="font-size:16px;line-height:1.8;color:#d9d0c9;">${escapedMessage}</div>
        <hr style="border:0;border-top:1px solid rgba(255,248,239,.14);margin:32px 0;" />
        <p style="margin:0;color:#b6aaa6;font-size:13px;line-height:1.7;">
          본 메일은 BAKSAL BEAUTY 상담 문의에 대한 답변입니다. 추가 문의가 필요하시면 본 메일로 회신해 주세요.
        </p>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
