import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";

export default async function SysAdminEditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return <div className="p-6">المستخدم غير موجود</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <p className="text-sm font-bold text-emerald-700">تعديل الحساب</p>
        <h1 className="text-3xl font-black text-slate-900">تحديث بيانات المستخدم</h1>
      </div>

      <form
        action={async function saveUser(formData: FormData) {
          "use server";
          const userId = formData.get("userId") as string;
          const name = (formData.get("name") || "").toString();
          const email = (formData.get("email") || "").toString();
          const phone = (formData.get("phone") || "").toString();
          const role = (formData.get("role") || "CUSTOMER").toString();
          const isActive = formData.get("isActive") === "on";

          if (!userId || !name || !phone) {
            throw new Error("الاسم والهاتف مطلوبان");
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              name,
              email: email || undefined,
              phone,
              role: role as any,
              isActive,
            },
          });

          revalidatePath("/sysadmin/users");
        }}
        className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="userId" value={user.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-bold text-slate-700">
            الاسم
            <input name="name" defaultValue={user.name} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm" />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            البريد الإلكتروني
            <input name="email" defaultValue={user.email ?? ""} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm" />
          </label>
          <label className="block text-sm font-bold text-slate-700 md:col-span-2">
            الهاتف
            <input name="phone" defaultValue={user.phone} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm" />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            الدور
            <select name="role" defaultValue={user.role} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm">
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="VENDOR">VENDOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked={user.isActive} className="h-4 w-4" />
            الحساب نشط
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white">حفظ التغييرات</button>
          <a href={`/sysadmin/users/${user.id}`} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700">إلغاء</a>
        </div>
      </form>
    </div>
  );
}
