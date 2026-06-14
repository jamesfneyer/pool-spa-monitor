import { brand } from "./brand";

export function verificationPlainText(codeParameter: string, isResend: boolean): string {
  const intro = isResend
    ? "Here is your new verification code for Pool & Spa Command Center."
    : "Thanks for signing up for Pool & Spa Command Center.";

  return `${intro}

Your verification code is: ${codeParameter}

Enter this code in the app to confirm your email address. The code expires after a short time.

If you didn't create an account, you can ignore this email.

— ${brand.appName}`;
}

export function passwordResetPlainText(codeParameter: string): string {
  return `You requested a password reset for Pool & Spa Command Center.

Your reset code is: ${codeParameter}

Enter this code on the forgot-password page along with your new password. The code expires after a short time.

If you didn't request a reset, you can ignore this email.

— ${brand.appName}`;
}

export function invitationPlainText(usernameParameter: string, codeParameter: string): string {
  return `You've been invited to Pool & Spa Command Center.

Sign in with:
  Username: ${usernameParameter}
  Temporary password: ${codeParameter}

You'll be asked to set a new password on first sign-in.

— ${brand.appName}`;
}

export function attributeVerifyPlainText(codeParameter: string): string {
  return `Verify your email address for Pool & Spa Command Center.

Your verification code is: ${codeParameter}

If you didn't request this, you can ignore this email.

— ${brand.appName}`;
}
