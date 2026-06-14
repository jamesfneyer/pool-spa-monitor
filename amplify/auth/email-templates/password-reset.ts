import { brand } from "./brand";
import { codeBlockHtml, wrapEmailLayout } from "./layout";
import { passwordResetPlainText } from "./plain-text";

export function passwordResetEmailSubject(): string {
  return brand.subjects.passwordReset;
}

export function passwordResetEmailHtml(codeParameter: string): string {
  const { colors } = brand;

  const bodyHtml = `
    <h1 style="margin:0 0 12px;color:${colors.foreground};font-size:22px;font-weight:600;line-height:1.3;text-align:center;">Reset your password</h1>
    <p style="margin:0 0 8px;color:${colors.muted};font-size:15px;line-height:1.6;text-align:center;">We received a request to reset the password for your account. Enter the code below on the forgot-password page along with your new password.</p>
    ${codeBlockHtml(codeParameter, "Reset code")}
    <p style="margin:0;color:${colors.muted};font-size:13px;line-height:1.5;text-align:center;">This code expires after a short time.</p>`;

  return wrapEmailLayout({
    preheader: `Your password reset code is ${codeParameter}`,
    title: passwordResetEmailSubject(),
    bodyHtml,
  });
}

export function passwordResetEmailPlainText(codeParameter: string): string {
  return passwordResetPlainText(codeParameter);
}
