import { brand } from "./brand";

export type EmailLayoutOptions = {
  preheader: string;
  title: string;
  bodyHtml: string;
};

export function wrapEmailLayout({ preheader, title, bodyHtml }: EmailLayoutOptions): string {
  const { appName, tagline, colors } = brand;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${colors.background};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${colors.background};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background-color:${colors.card};border-radius:12px;overflow:hidden;border:1px solid ${colors.border};">
          <tr>
            <td style="background-color:${colors.primary};padding:28px 32px;text-align:center;">
              <p style="margin:0;color:${colors.primaryForeground};font-size:22px;font-weight:600;line-height:1.3;">${escapeHtml(appName)}</p>
              <p style="margin:8px 0 0;color:${colors.primaryForeground};font-size:13px;line-height:1.4;opacity:0.92;">${escapeHtml(tagline)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:${colors.codeBackground};padding:20px 32px;text-align:center;border-top:1px solid ${colors.border};">
              <p style="margin:0 0 8px;color:${colors.muted};font-size:12px;line-height:1.5;">If you didn't request this email, you can safely ignore it.</p>
              <p style="margin:0;color:${colors.muted};font-size:12px;line-height:1.5;">&copy; ${new Date().getFullYear()} ${escapeHtml(appName)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function codeBlockHtml(codeParameter: string, label = "Your code"): string {
  const { colors } = brand;

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
    <tr>
      <td align="center" style="background-color:${colors.codeBackground};border-radius:8px;padding:24px;border:1px solid ${colors.border};">
        <p style="margin:0 0 8px;color:${colors.muted};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(label)}</p>
        <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:700;color:${colors.primary};letter-spacing:6px;line-height:1.2;">${codeParameter}</p>
      </td>
    </tr>
  </table>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
