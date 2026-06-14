"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { confirmResetPassword, resetPassword } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { configureAmplify, isAmplifySandboxReady } from "@/lib/amplify/configure";

type Step = "request" | "confirm";

function mapAuthError(err: unknown, fallback: string): string {
  const message = err instanceof Error ? err.message : fallback;
  if (message.includes("CodeMismatchException")) {
    return "Invalid verification code. Check the code and try again.";
  }
  if (message.includes("ExpiredCodeException")) {
    return "Verification code expired. Request a new code and try again.";
  }
  if (message.includes("InvalidPasswordException")) {
    return "Password does not meet requirements. Use at least 8 characters.";
  }
  if (message.includes("LimitExceededException")) {
    return "Too many attempts. Wait a few minutes and try again.";
  }
  return message;
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<Step>("request");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sandboxReady = isAmplifySandboxReady();

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      configureAmplify();
      await resetPassword({ username: email });
      setInfo("If an account exists for that email, we sent a verification code.");
      setStep("confirm");
    } catch (err) {
      setError(mapAuthError(err, "Could not send reset code"));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      configureAmplify();
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: password,
      });
      router.push("/login?reset=success");
    } catch (err) {
      setError(mapAuthError(err, "Password reset failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{step === "request" ? "Reset password" : "Set new password"}</CardTitle>
        <CardDescription>
          {step === "request"
            ? "Enter your email and we will send a verification code"
            : "Enter the code from your email and choose a new password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "request" ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading || !sandboxReady} className="w-full">
              {loading ? "Sending..." : "Send verification code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            {info ? <p className="text-sm text-muted-foreground">{info}</p> : null}
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading || !sandboxReady} className="w-full">
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
          {" · "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Create account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
