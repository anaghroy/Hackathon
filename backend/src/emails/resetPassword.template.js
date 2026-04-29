export const resetPasswordTemplate = (resetUrl, username) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#000000;font-family:'Inter', Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" style="background:#050505;border-radius:8px;border:1px solid rgba(255, 255, 255, 0.08);overflow:hidden;">
            
            <tr>
              <td style="padding:30px;text-align:center;font-size:20px;color:#ffffff;border-bottom:1px solid rgba(255, 255, 255, 0.08);font-weight:600;letter-spacing:-0.02em;">
                🔐 Reset Your Password
              </td>
            </tr>

            <tr>
              <td style="padding:40px 30px;color:rgba(255, 255, 255, 0.7);font-size:15px;line-height:1.6;">
                <h2 style="color:#ffffff;margin-top:0;font-size:20px;letter-spacing:-0.02em;">Hello ${username || "there"} 👋</h2>

                <p>
                  We received a request to reset your password.
                </p>

                <div style="text-align:center;margin:40px 0;">
                  <a href="${resetUrl}" 
                    style="background:#3676de;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:4px;font-weight:600;display:inline-block;font-size:15px;">
                    Reset Password
                  </a>
                </div>

                <p>This link expires in <strong style="color:#ffffff;">10 minutes</strong>.</p>

                <p>If you didn’t request this, ignore this email.</p>

                <hr style="border:0;border-top:1px solid rgba(255, 255, 255, 0.08);margin:30px 0;" />

                <p style="font-size:12px;color:rgba(255, 255, 255, 0.5);word-break:break-all;line-height:1.5;">
                  If the button doesn't work, copy and paste this link into your browser:<br/><br/>
                  <a href="${resetUrl}" style="color:#3676de;text-decoration:none;">${resetUrl}</a>
                </p>
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
