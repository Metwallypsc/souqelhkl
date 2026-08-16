import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import authOptions from "@/lib/auth";

export default async function SysAdminLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#f3f6f2]">
      <div className="mx-auto flex max-w-7xl gap-6">
        <AdminSidebar basePath="/sysadmin" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
