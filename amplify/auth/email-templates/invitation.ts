import { brand } from "./brand";
import { wrapEmailLayout } from "./layout";
import { invitationPlainText } from "./plain-text";

export function invitationEmailSubject(): string {
  return brand.subjects.invitation;
}

export function invitationEmailHtml(usernameParameter: string, codeParameter: string): string {
  const { colors } = brand;

  const bodyHtml = `
    <h1 style="margin:0 0 12px;color:${colors.foreground};font-size:22px;font-weight:600;line-height:1.3;text-align:center;">You're invited</h1>
    <p style="margin:0 0 20px;color:${colors.muted};font-size:15px;line-height:1.6;text-align:center;">An account has been created for you. Sign in with the credentials below. You'll be asked to set a new password on first sign-in.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px;">
      <tr>
        <td style="background-color:${colors.codeBackground};border-radius:8px;padding:16px 20px;border:1px solid ${colors.border};">
          <p style="margin:0 0 12px;color:${colors.muted};font-size:13px;line-height:1.5;"><strong style="color:${colors.foreground};">Username:</strong> ${usernameParameter}</p>
          <p style="margin:0;color:${colors.muted};font-size:13px;line-height:1.5;"><strong style="color:${colors.foreground};">Temporary password:</strong> <span style="font-family:'Courier New',Courier,monospace;font-weight:700;color:${colors.primary};">${codeParameter}</span></p>
        </td>
      </tr>
    </table>`;

  return wrapEmailLayout({
    preheader: `Your temporary password is ${codeParameter}`,
    title: invitationEmailSubject(),
    bodyHtml,
  });
}

export function invitationEmailPlainText(usernameParameter: string, codeParameter: string): string {
  return invitationPlainText(usernameParameter, codeParameter);
}
