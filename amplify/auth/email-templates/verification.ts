import { brand } from "./brand";
import { codeBlockHtml, wrapEmailLayout } from "./layout";
import { verificationPlainText } from "./plain-text";

type VerificationEmailOptions = {
  codeParameter: string;
  isResend?: boolean;
};

export function verificationEmailSubject(isResend = false): string {
  return isResend ? brand.subjects.verificationResend : brand.subjects.verification;
}

export function verificationEmailHtml({ codeParameter, isResend = false }: VerificationEmailOptions): string {
  const { colors } = brand;
  const heading = isResend ? "Your new verification code" : "Confirm your email";
  const intro = isResend
    ? "Use the code below to finish verifying your email address."
    : "Thanks for signing up! Enter the code below to activate your account and start tracking your pool and spa.";

  const bodyHtml = `
    <h1 style="margin:0 0 12px;color:${colors.foreground};font-size:22px;font-weight:600;line-height:1.3;text-align:center;">${heading}</h1>
    <p style="margin:0 0 8px;color:${colors.muted};font-size:15px;line-height:1.6;text-align:center;">${intro}</p>
    ${codeBlockHtml(codeParameter)}
    <p style="margin:0;color:${colors.muted};font-size:13px;line-height:1.5;text-align:center;">This code expires after a short time.</p>`;

  return wrapEmailLayout({
    preheader: isResend
      ? `Your new verification code is ${codeParameter}`
      : `Confirm your account with code ${codeParameter}`,
    title: verificationEmailSubject(isResend),
    bodyHtml,
  });
}

export function verificationEmailPlainText(options: VerificationEmailOptions): string {
  return verificationPlainText(options.codeParameter, options.isResend ?? false);
}

export function attributeVerifyEmailSubject(): string {
  return brand.subjects.attributeVerify;
}

export function attributeVerifyEmailHtml(codeParameter: string): string {
  const { colors } = brand;

  const bodyHtml = `
    <h1 style="margin:0 0 12px;color:${colors.foreground};font-size:22px;font-weight:600;line-height:1.3;text-align:center;">Verify your email</h1>
    <p style="margin:0 0 8px;color:${colors.muted};font-size:15px;line-height:1.6;text-align:center;">Enter the code below to confirm your new email address.</p>
    ${codeBlockHtml(codeParameter)}
    <p style="margin:0;color:${colors.muted};font-size:13px;line-height:1.5;text-align:center;">This code expires after a short time.</p>`;

  return wrapEmailLayout({
    preheader: `Your verification code is ${codeParameter}`,
    title: attributeVerifyEmailSubject(),
    bodyHtml,
  });
}
