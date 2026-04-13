import { getSession } from "@/core/usecases/authService";
import { DashboardLayout } from "@/presentation/components/layouts/DashboardLayout";
import { redirect } from "next/navigation";

export default async function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Guard: If no session, redirect to login (middleware already does this, but double check is safe)
  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout role={session.role as string} userName={session.name as string}>
      {children}
    </DashboardLayout>
  );
}
