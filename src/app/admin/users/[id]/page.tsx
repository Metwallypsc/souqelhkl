import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";

// server action: update role
async function updateUserRole(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;
  if (!userId || !role) return;
  await prisma.user.update({ where: { id: userId }, data: { role } as any });
  revalidatePath("/admin/users");
}

// server action: toggle active
async function toggleActive(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  if (!userId) return;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) return;
  await prisma.user.update({ where: { id: userId }, data: { isActive: !u.isActive } });
  revalidatePath("/admin/users");
}

// server action: delete user
async function deleteUser(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  if (!userId) return;
  // prevent deleting self
  const session: any = await getServerSession(authOptions as any);
  if (session?.user?.id === userId) {
    throw new Error("لا يمكن حذف الحساب الذي تستخدمه حالياً");
  }
  // prevent deleting if user has orders
  const ordersCount = await prisma.order.count({ where: { customerId: userId } });
  if (ordersCount > 0) {
    throw new Error("لا يمكن حذف المستخدم لأنه لديه طلبات مرتبطة");
  }
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export default async function AdminUserDetail({ params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const id = params.id;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return <div className="p-6">المستخدم غير موجود</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">إدارة المستخدم</h1>
          <p className="text-sm text-[#40533b]">عرض وتعديل بيانات المستخدم</p>
        </div>
      </div>

      <div className="rounded-md border border-field-100 bg-white p-6 max-w-3xl">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="text-sm text-gray-500">الاسم</div>
            <div className="font-bold">{user.name}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">البريد / الهاتف</div>
            <div className="font-bold">{user.email ?? user.phone}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">الدور</div>
            <div className="font-bold">{user.role}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">الحالة</div>
            <div className="font-bold">{user.isActive ? "نشط" : "معطل"}</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <form action={updateUserRole} method="post">
              <input type="hidden" name="userId" value={user.id} />
              <select name="role" defaultValue={user.role} className="rounded-md border px-3 py-2 text-sm">
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="VENDOR">VENDOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button type="submit" className="ml-2 rounded-md bg-field-700 px-4 py-2 text-sm font-bold text-white">حفظ الدور</button>
            </form>

            <form action={toggleActive} method="post">
              <input type="hidden" name="userId" value={user.id} />
              <button type="submit" className="rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-[#182414]">
                {user.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
              </button>
            </form>

            <form action={deleteUser} method="post">
              <input type="hidden" name="userId" value={user.id} />
              <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white" onClick="return confirm('هل أنت متأكد من حذف المستخدم؟')">حذف المستخدم</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
