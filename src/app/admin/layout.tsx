import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    // redirect to sign in if not admin
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#f3f6f2]">
      <div className="mx-auto flex max-w-7xl gap-6">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
