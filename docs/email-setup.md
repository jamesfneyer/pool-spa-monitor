# Auth email setup

Pool & Spa Command Center sends authentication emails through Amazon Cognito (signup verification, password reset, resend code, and admin invitations). Branded HTML templates live under `amplify/auth/email-templates/` and are applied via a `customMessage` Lambda trigger.

## Current dev / test mode (default)

By default, **no SES sender is configured**. Cognito sends from its built-in address (`no-reply@verificationemail.com`). This is fine for sandbox testing with yourself or a friend.

**Expectations:**

- Emails may land in spam — check the junk folder during testing.
- Cognito sandbox has a low daily send limit (50 emails/day).
- Template changes require redeploying the Amplify sandbox.

**Test the flows:**

1. Run `pnpm sandbox` and keep it running.
2. Run `pnpm dev:auth` in another terminal.
3. Sign up at `/signup` — confirm branded verification email.
4. Use `/forgot-password` — confirm branded reset email.

## Template maintenance

Edit files in `amplify/auth/email-templates/`:

| File | Used for |
|------|----------|
| `brand.ts` | App name, colors, subject lines |
| `layout.ts` | Shared HTML wrapper and code block |
| `verification.ts` | Sign-up and resend verification |
| `password-reset.ts` | Forgot-password flow |
| `invitation.ts` | Admin-created users |
| `plain-text.ts` | Plain-text helpers (reference; Cognito custom message sends HTML only) |

After changes, redeploy:

```bash
pnpm sandbox
```

Routing logic is in `amplify/auth/custom-message/handler.ts`.

## Production-ready sender (when you have a verified domain)

When you're ready to improve deliverability, switch Cognito to send through **Amazon SES** using a verified domain or email address.

### TODO: SES domain verification

1. Open [Amazon SES](https://console.aws.amazon.com/ses/) in the same region as your Cognito user pool (default: `us-east-1`).
2. Verify your sending domain **or** a single email address.
3. Request production access if you need to send to unverified recipients (move out of SES sandbox).

### TODO: DNS records (DKIM, SPF, DMARC)

For a verified domain, add the DNS records SES provides:

- **DKIM** — signing records from SES
- **SPF** — `v=spf1 include:amazonses.com ~all` (adjust for your DNS host)
- **DMARC** — start with `v=DMARC1; p=none; rua=mailto:you@yourdomain.com` and tighten policy later

These improve inbox placement and reduce spoofing.

### TODO: Configure Cognito custom email sender

Set environment variables **before** running `pnpm sandbox` (backend deploy-time vars, not `NEXT_PUBLIC_*`):

```bash
# Required when switching to SES
AUTH_EMAIL_FROM=noreply@yourdomain.com

# Optional
AUTH_EMAIL_FROM_NAME="Pool & Spa Command Center"
AUTH_EMAIL_REPLY_TO=support@yourdomain.com
```

Add them to your shell profile, a `.env` file loaded by your deploy workflow, or export them in the terminal where you run `pnpm sandbox`.

If `AUTH_EMAIL_FROM` is unset, the app omits the `senders` block and Cognito uses its default sender.

Implementation: `amplify/auth/email-sender.ts`

### TODO: Verify after SES setup

1. Redeploy: `pnpm sandbox`
2. Sign up with a real inbox and confirm delivery to the inbox (not spam).
3. Test forgot-password with the same address.
4. Monitor SES bounce/complaint metrics in the AWS console.

## Limitations

- **Custom Message trigger** sets HTML content only. Cognito does not send a separate plain-text MIME part through this path.
- For full MIME control (HTML + text, attachments, third-party providers), you'd need a [Custom Email Sender](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-email-sender.html) Lambda — out of scope for the current setup.
- Product emails (maintenance reminders, etc.) are not implemented yet.

## Related files

```
amplify/auth/
  resource.ts              # defineAuth + optional senders
  email-sender.ts          # AUTH_EMAIL_* env parsing
  custom-message/          # Lambda trigger
  email-templates/         # Branded HTML templates
```
