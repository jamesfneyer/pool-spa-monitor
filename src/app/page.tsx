import Link from "next/link";
import { Waves } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Waves className="h-7 w-7 text-primary" />
          <span className="text-lg font-semibold">Pool & Spa Command Center</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your pool and spa, beautifully organized
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Track water chemistry, log chemical doses, manage equipment warranties,
            and stay on top of maintenance — all in one calm homeowner dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login?redirect=/dashboard"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Open dashboard
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Sign in
            </Link>
          </div>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Everything in one place</CardTitle>
            <CardDescription>
              Built for saltwater pools and attached spas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Water test history with chemistry status badges</p>
            <p>Chemical dosing log and maintenance reminders</p>
            <p>Equipment inventory with warranty tracking</p>
            <p>Notes for seasonal changes and service visits</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
