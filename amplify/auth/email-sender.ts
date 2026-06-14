type AuthEmailSenderConfig = {
  fromEmail: string;
  fromName?: string;
  replyTo?: string;
};

/**
 * Optional SES sender configuration for Cognito auth emails.
 *
 * When AUTH_EMAIL_FROM is unset, returns undefined and Cognito uses its default
 * sender (fine for sandbox/dev). Set these env vars at sandbox deploy time when
 * you have a verified SES identity.
 *
 * @see docs/email-setup.md
 */
export function getAuthEmailSenderConfig(): AuthEmailSenderConfig | undefined {
  const fromEmail = process.env.AUTH_EMAIL_FROM?.trim();
  if (!fromEmail) {
    return undefined;
  }

  const fromName =
    process.env.AUTH_EMAIL_FROM_NAME?.trim() || "Pool & Spa Command Center";
  const replyTo = process.env.AUTH_EMAIL_REPLY_TO?.trim();

  return {
    fromEmail,
    fromName,
    ...(replyTo ? { replyTo } : {}),
  };
}
