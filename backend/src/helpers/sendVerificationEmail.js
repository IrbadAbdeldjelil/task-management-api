const transporter = require('../config/mail.config.js');

module.exports.sendVerificationEmail = async (email, token) => {
  const link = `${process.env.API_URL}/api/v1/auth/verify-email?token=${token}`;
  
  try {
    const info = await transporter.sendMail({
      from: `"Task menagement system App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Task menagement system App account",
  html: `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Email verification</h2>
      <p>Hello, click the button below to activate your account:</p>
      <a href="${link}" 
         style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; 
                text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Verify Email
      </a>
      <p style="font-size: 12px; color: #666;">
        If the button doesn't work, copy this link: <br> ${link}
      </p>
      
    </div>
  `,
    });
    console.log('✅ Email sent:', info.messageId); // هذا السطر مهم
  } catch (err) {
    console.log('❌ Email send error:', err.message); // هنا يطلع السبب
    throw err;
  }
}