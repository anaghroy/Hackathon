export const verifyEmailTemplate = (verifyUrl, username) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
    </style>
  </head>
  <body style="margin:0;padding:0;background:#000000;font-family:'Inter', Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" style="background:#050505;border-radius:0;border:1px solid rgba(255, 255, 255, 0.08);overflow:hidden;">
            
            <tr>
              <td style="padding:30px;text-align:center;font-size:22px;color:#ffffff;border-bottom:1px solid rgba(255, 255, 255, 0.08);font-weight:600;letter-spacing:-0.02em;background:linear-gradient(to right, #000000, #050505);">
                ✨ CogniCode Verification
              </td>
            </tr>

            <tr>
              <td style="padding:40px 30px;color:rgba(255, 255, 255, 0.7);font-size:15px;line-height:1.6;">
                <h2 style="color:#ffffff;margin-top:0;font-size:20px;letter-spacing:-0.02em;">Welcome ${username || "there"}!</h2>

                <p>
                  Thank you for joining <strong>CogniCode</strong>. We're excited to help you build your next great project with AI.
                </p>
                <p>
                  Please verify your email address to activate your account and start deploying.
                </p>

                <div style="text-align:center;margin:40px 0;">
                  <a href="${verifyUrl}" 
                    style="background:#3676de;color:#ffffff;padding:16px 32px;text-decoration:none;border-radius:0;font-weight:600;display:inline-block;font-size:14px;letter-spacing:0.05em;text-transform:uppercase;">
                    Verify Email Address
                  </a>
                </div>

                <p>If you did not create an account, you can safely ignore this email.</p>

                <hr style="border:0;border-top:1px solid rgba(255, 255, 255, 0.08);margin:30px 0;" />

                <p style="font-size:12px;color:rgba(255, 255, 255, 0.5);word-break:break-all;line-height:1.5;text-align:center;">
                  If the button doesn't work, copy and paste this link into your browser:<br/><br/>
                  <a href="${verifyUrl}" style="color:#3676de;text-decoration:none;">${verifyUrl}</a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 30px;background:rgba(255,255,255,0.02);text-align:center;font-size:11px;color:rgba(255, 255, 255, 0.3);">
                &copy; ${new Date().getFullYear()} CogniCode. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
