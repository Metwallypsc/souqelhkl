import prisma from "@/lib/prisma";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function SysAdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-700">إدارة الحسابات</p>
          <h1 className="text-3xl font-black text-slate-900">صفحة المستخدمين</h1>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{users.length} مستخدم</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-bold">الاسم</th>
              <th className="px-4 py-3 font-bold">اسم المستخدم</th>
              <th className="px-4 py-3 font-bold">البريد</th>
              <th className="px-4 py-3 font-bold">الهاتف</th>
              <th className="px-4 py-3 font-bold">الدور</th>
              <th className="px-4 py-3 font-bold">الحالة</th>
              <th className="px-4 py-3 font-bold">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-bold text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.username ?? "-"}</td>
                <td className="px-4 py-3 text-slate-600">{user.email ?? "-"}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {user.isActive ? "نشط" : "معطل"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/sysadmin/users/${user.id}`} className="font-bold text-emerald-700 hover:text-emerald-900">عرض</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
