import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SetupGuard } from "@/components/setup/setup-guard";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <SetupGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </SetupGuard>
    </RequireAuth>
  );
}
