import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";

async function updateUserRole(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;
  if (!userId || !role) return;
  await prisma.user.update({ where: { id: userId }, data: { role } as any });
  revalidatePath("/sysadmin/users");
}

async function toggleActive(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  if (!userId) return;
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (!current) return;
  await prisma.user.update({ where: { id: userId }, data: { isActive: !current.isActive } });
  revalidatePath("/sysadmin/users");
}

async function deleteUser(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  if (!userId) return;
  const session: any = await getServerSession(authOptions as any);
  if (session?.user?.id === userId) {
    throw new Error("لا يمكن حذف الحساب الذي تستخدمه حالياً");
  }
  const ordersCount = await prisma.order.count({ where: { customerId: userId } });
  if (ordersCount > 0) {
    throw new Error("لا يمكن حذف المستخدم لأنه لديه طلبات مرتبطة");
  }
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/sysadmin/users");
}

export default async function SysAdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return <div className="p-6">المستخدم غير موجود</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-700">تفاصيل الحساب</p>
          <h1 className="text-3xl font-black text-slate-900">إدارة المستخدم</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-3xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-slate-500">الاسم</div>
            <div className="mt-1 font-black text-slate-900">{user.name}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">اسم المستخدم</div>
            <div className="mt-1 font-black text-slate-900">{user.username ?? "-"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">البريد الإلكتروني</div>
            <div className="mt-1 font-black text-slate-900">{user.email ?? "-"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">الهاتف</div>
            <div className="mt-1 font-black text-slate-900">{user.phone}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">الدور</div>
            <div className="mt-1 font-black text-slate-900">{user.role}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">الحالة</div>
            <div className="mt-1 font-black text-slate-900">{user.isActive ? "نشط" : "معطل"}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <form action={updateUserRole} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2">
            <input type="hidden" name="userId" value={user.id} />
            <select name="role" defaultValue={user.role} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="VENDOR">VENDOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white">حفظ الدور</button>
          </form>

          <form action={toggleActive}>
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900">
              {user.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
            </button>
          </form>

          <form action={deleteUser}>
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white">حذف المستخدم</button>
          </form>
        </div>
      </div>
    </div>
  );
}
