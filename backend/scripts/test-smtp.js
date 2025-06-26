const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  console.log('🧪 Testing SMTP Configuration...\n');
  
  console.log('SMTP Settings:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log(`Pass: ${process.env.SMTP_PASS ? '***configured***' : 'NOT SET'}`);
  console.log('');

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ SMTP credentials not configured in .env file');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('📧 Sending test email...');
    const testEmail = {
      from: `MerkPoll <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: '🧪 MerkPoll SMTP Test',
      html: `
        <h2>🗳️ MerkPoll SMTP Test</h2>
        <p>This is a test email to verify SMTP configuration.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>If you received this email, SMTP is working correctly! ✅</p>
      `,
      text: `
MerkPoll SMTP Test

This is a test email to verify SMTP configuration.
Time: ${new Date().toISOString()}

If you received this email, SMTP is working correctly!
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📮 Email sent to:', process.env.SMTP_USER);
    
  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Please check:');
      console.error('   1. Your email and password are correct');
      console.error('   2. For Gmail, use an App Password instead of your regular password');
      console.error('   3. Enable 2-factor authentication and generate an App Password');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n💡 Connection failed. Please check:');
      console.error('   1. Your internet connection');
      console.error('   2. SMTP host and port settings');
      console.error('   3. Firewall settings');
    }
  }
}

testSMTP();
