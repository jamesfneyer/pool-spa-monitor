/** Brand constants for auth emails (hex equivalents of src/app/globals.css teal palette). */
export const brand = {
  appName: "Pool & Spa Command Center",
  tagline: "Your pool and spa, beautifully organized",
  colors: {
    primary: "#0e7490",
    primaryDark: "#0c637a",
    primaryForeground: "#f0fdfa",
    background: "#f4f9fb",
    card: "#ffffff",
    foreground: "#1e3a4a",
    muted: "#5c7280",
    border: "#d7e8ef",
    codeBackground: "#e8f4f8",
  },
  subjects: {
    verification: "Confirm your Pool & Spa Command Center account",
    verificationResend: "Your new verification code",
    passwordReset: "Reset your Pool & Spa Command Center password",
    invitation: "You've been invited to Pool & Spa Command Center",
    attributeVerify: "Verify your email address",
  },
  /** Placeholder until a support address is configured for production. */
  supportEmail: "support@example.com",
} as const;
