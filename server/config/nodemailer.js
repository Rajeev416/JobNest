import nodemailer from 'nodemailer';
import dns from 'dns';
import 'dotenv/config';

// Force Node.js to resolve DNS to IPv4 addresses first
// Render's free tier blocks outbound IPv6 connections
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendApplicationStatusEmail = async (userEmail, userName, companyName, jobTitle, status) => {
  // Skip if email credentials are not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email skipped: EMAIL_USER or EMAIL_PASS not set in environment variables");
    return false;
  }

  try {
    const isAccepted = status.toLowerCase() === 'accepted';
    
    const subject = isAccepted 
      ? `Good News! Update on your application for ${jobTitle} at ${companyName}`
      : `Update on your application for ${jobTitle} at ${companyName}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: ${isAccepted ? '#10b981' : '#3b82f6'};">
          ${isAccepted ? 'Congratulations!' : 'Application Update'}
        </h2>
        <p style="font-size: 16px; color: #333;">Hi ${userName},</p>
        <p style="font-size: 16px; color: #444; line-height: 1.5;">
          Your application status for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been updated to:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; padding: 10px 20px; background-color: ${isAccepted ? '#d1fae5' : '#fee2e2'}; color: ${isAccepted ? '#065f46' : '#991b1b'}; border-radius: 20px; font-weight: bold; font-size: 18px;">
            ${status.toUpperCase()}
          </span>
        </div>
        <p style="font-size: 16px; color: #444; line-height: 1.5;">
          ${isAccepted 
            ? 'The recruitment team was impressed with your profile. They will be in touch with you shortly regarding the next steps in the process.' 
            : 'Although your profile is impressive, the company has decided to move forward with other candidates at this time. We encourage you to keep applying to other roles that match your skills!'}
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 14px; color: #666;">
          Best regards,<br>
          <strong>JobNest Team</strong>
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"JobNest Portal" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
};
