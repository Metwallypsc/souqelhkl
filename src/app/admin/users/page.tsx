import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div>
      <h1 className="text-2xl font-black mb-4">إدارة المستخدمين</h1>
      <div className="rounded-md border border-field-100 bg-white p-4">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-2">الاسم</th>
              <th className="py-2">البريد / الهاتف</th>
              <th className="py-2">الدور</th>
              <th className="py-2">منذ</th>
              <th className="py-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-field-100">
                <td className="py-3">{u.name}</td>
                <td className="py-3">{u.email ?? u.phone}</td>
                <td className="py-3">{u.role}</td>
                <td className="py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <Link href={`/admin/users/${u.id}`} className="text-sm font-semibold text-field-700">
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
