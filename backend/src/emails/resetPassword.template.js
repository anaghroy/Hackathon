export const resetPasswordTemplate = (resetUrl, username) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">
          <table width="600" style="background:#fff;border-radius:10px;overflow:hidden;">
            
            <tr>
              <td style="background:#000000;color:#fff;padding:20px;text-align:center;font-size:20px;">
                🔐 Reset Your Password
              </td>
            </tr>

            <tr>
              <td style="padding:30px;color:#333;">
                <h2>Hello ${username || "there"} 👋</h2>

                <p>
                  We received a request to reset your password.
                </p>

                <div style="text-align:center;margin:30px 0;">
                  <a href="${resetUrl}" 
                    style="background:#4f46e5;color:#fff;padding:12px 25px;text-decoration:none;border-radius:6px;">
                    Reset Password
                  </a>
                </div>

                <p>This link expires in <strong>10 minutes</strong>.</p>

                <p>If you didn’t request this, ignore this email.</p>

                <hr />

                <p style="font-size:12px;color:#888;">
                  ${resetUrl}
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
