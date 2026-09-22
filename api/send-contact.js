import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, company, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'First name, last name, email and message are required' });
  }

  const fullName = `${firstName} ${lastName}`;
  const currentDate = new Date().toLocaleString();

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Professional HTML email template (no emojis)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #f9f9f9;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: #0a3d20;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .header p {
          margin: 8px 0 0;
          opacity: 0.85;
          font-size: 14px;
        }
        .content {
          padding: 25px;
          background: white;
        }
        .field {
          margin-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 12px;
        }
        .field-label {
          font-weight: 600;
          color: #0a3d20;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 4px;
        }
        .field-value {
          font-size: 15px;
          color: #222222;
          margin-top: 4px;
          word-wrap: break-word;
        }
        .message-box {
          background: #f4f8f4;
          padding: 15px;
          border-radius: 6px;
          border-left: 3px solid #0a3d20;
          margin-top: 8px;
        }
        .footer {
          background: #f0f0f0;
          padding: 12px 25px;
          text-align: center;
          font-size: 11px;
          color: #777777;
          border-top: 1px solid #e0e0e0;
        }
        .badge {
          display: inline-block;
          background: #eef4ee;
          color: #0a3d20;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
        a {
          color: #0a3d20;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p>from yunipakistan.com</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Name</div>
            <div class="field-value">${fullName}</div>
          </div>
          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value"><a href="mailto:${email}">${email}</a></div>
          </div>
          ${phone ? `<div class="field">
            <div class="field-label">Phone</div>
            <div class="field-value">${phone}</div>
          </div>` : ''}
          ${company ? `<div class="field">
            <div class="field-label">Company</div>
            <div class="field-value">${company}</div>
          </div>` : ''}
          <div class="field">
            <div class="field-label">Message</div>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>
          <div style="text-align: center; margin-top: 25px;">
            <span class="badge">Submitted on ${currentDate}</span>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent from your website's contact form. Reply directly to respond to ${fullName}.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"YuniPakistan Contact" <${process.env.GMAIL_USER}>`,
    replyTo: email,
    to: process.env.GMAIL_USER,
    subject: `${fullName}`,  // Subject is the person's full name
    text: `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nCompany: ${company || 'Not provided'}\nMessage:\n${message}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}