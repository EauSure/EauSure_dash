import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // For development, use ethereal.email (fake SMTP)
  // For production, configure with your actual SMTP settings
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Fallback: console log for development
  return null;
};

// Send verification code email
export const sendVerificationEmail = async (email, name, code) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Email Service (Dev Mode)');
    console.log('==========================');
    console.log(`To: ${email}`);
    console.log(`Subject: Vérification de votre compte`);
    console.log(`Code de vérification: ${code}`);
    console.log('==========================');
    return { success: true, message: 'Email logged to console (dev mode)' };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@waterquality.com',
    to: email,
    subject: 'Vérification de votre compte - Water Quality IoT',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌊 Water Quality IoT</h1>
              <p>Bienvenue sur notre plateforme</p>
            </div>
            <div class="content">
              <h2>Bonjour ${name},</h2>
              <p>Merci de vous être inscrit sur notre plateforme de surveillance de la qualité de l'eau.</p>
              <p>Pour activer votre compte, veuillez utiliser le code de vérification ci-dessous :</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p><strong>Ce code est valide pendant 15 minutes.</strong></p>
              <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
              
              <div class="footer">
                <p>© 2026 Water Quality Monitoring System</p>
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  if (!transporter) {
    console.log('📧 Email Service (Dev Mode)');
    console.log('==========================');
    console.log(`To: ${email}`);
    console.log(`Subject: Réinitialisation du mot de passe`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('==========================');
    return { success: true, message: 'Email logged to console (dev mode)' };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@waterquality.com',
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Water Quality IoT',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Réinitialisation du mot de passe</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${name},</h2>
              <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
              <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important :</strong>
                <ul>
                  <li>Ce lien est valide pendant 1 heure</li>
                  <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                  <li>Ne partagez jamais ce lien avec qui que ce soit</li>
                </ul>
              </div>
              
              <p style="font-size: 12px; color: #666; margin-top: 20px;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
              </p>
              
              <div class="footer">
                <p>© 2026 Water Quality Monitoring System</p>
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: error.message };
  }
};
