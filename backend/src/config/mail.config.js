const { createTransport } = require('nodemailer');

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4 /* ipv4 */
});

// اختبر الاتصال أول ما السيرفر يشتغل
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP Error:', error.message);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

module.exports = transporter;