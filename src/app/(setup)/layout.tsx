import Link from "next/link";
import { RequireAuth } from "@/components/auth/require-auth";
import { Waves } from "lucide-react";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
            <Waves className="size-5 text-primary" />
            <Link href="/dashboard" className="text-sm font-semibold">
              Pool &amp; Spa Command Center
            </Link>
            <span className="text-sm text-muted-foreground">· Setup</span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
