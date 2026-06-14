"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { configureAmplify, isAmplifySandboxReady } from "@/lib/amplify/configure";
import { useAuth } from "./auth-provider";

export function SignupForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sandboxReady = isAmplifySandboxReady();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      configureAmplify();
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      configureAmplify();
      await confirmSignUp({ username: email, confirmationCode: code });
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{step === "signup" ? "Create account" : "Confirm email"}</CardTitle>
        <CardDescription>
          {step === "signup"
            ? "Start tracking your pool and spa"
            : "Enter the verification code sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "signup" ? (
          <form onSubmit={handleSignup} className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading || !sandboxReady} className="w-full">
              {loading ? "Creating..." : "Sign up"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading || !sandboxReady} className="w-full">
              {loading ? "Confirming..." : "Confirm"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
