import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";
import { DEFAULT_SYSADMIN_PASSWORD, getSystemAdminPassword, updateAdminPassword } from "@/lib/admin-credentials";

async function changeAdminPassword(formData: FormData) {
  "use server";
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const currentPassword = (formData.get("currentPassword") || "").toString();
  const newPassword = (formData.get("newPassword") || "").toString();
  const confirmPassword = (formData.get("confirmPassword") || "").toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("جميع الحقول مطلوبة");
  }
  if (newPassword !== confirmPassword) {
    throw new Error("تأكيد كلمة المرور غير متطابق");
  }

  await updateAdminPassword(session.user.id, currentPassword, newPassword);
  revalidatePath("/sysadmin/settings");
}

export default async function SysAdminSettingsPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <p className="text-sm font-bold text-emerald-700">إعدادات المدير</p>
        <h1 className="text-3xl font-black text-slate-900">تحديث كلمة مرور المدير</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-900">معلومات الوصول</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="font-bold text-slate-700">اسم المستخدم الأساسي</div>
              <div className="mt-1">sysadmin</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="font-bold text-slate-700">كلمة المرور المبدئية</div>
              <div className="mt-1 break-all font-mono text-xs">{getSystemAdminPassword() === DEFAULT_SYSADMIN_PASSWORD ? "SysAdmin@2026!" : "تم ضبطها عبر متغيرات البيئة"}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="font-bold text-slate-700">المسار</div>
              <div className="mt-1">/sysadmin</div>
            </div>
          </div>
        </div>

        <form action={changeAdminPassword} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-black text-slate-900">تغيير كلمة المرور</h2>
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              كلمة المرور الحالية
              <input type="password" name="currentPassword" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-emerald-500" placeholder="أدخل كلمة المرور الحالية" />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              كلمة المرور الجديدة
              <input type="password" name="newPassword" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-emerald-500" placeholder="8 أحرف على الأقل" />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              تأكيد كلمة المرور الجديدة
              <input type="password" name="confirmPassword" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-emerald-500" placeholder="كرر كلمة المرور الجديدة" />
            </label>
            <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-500">حفظ كلمة المرور</button>
          </div>
        </form>
      </div>
    </div>
  );
}
