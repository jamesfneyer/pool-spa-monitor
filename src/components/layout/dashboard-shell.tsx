"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">
        <AppSidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          userEmail={user?.signInDetails?.loginId ?? user?.username ?? null}
          onSignOut={() => void signOut()}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
