import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const id = params.id;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return <div className="p-6">المستخدم غير موجود</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">تعديل بيانات المستخدم</h1>
        <p className="text-sm text-[#40533b]">عدل تفاصيل المستخدم ثم احفظ</p>
      </div>

      <form action={async function updateUser(formData: FormData) {
        "use server";
        const userId = formData.get("userId") as string;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string | null;
        const phone = formData.get("phone") as string;
        const role = formData.get("role") as string;
        const isActive = formData.get("isActive") === "on";
        if (!userId) return;

        // basic validation
        if (!name || !phone) {
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
          } as any,
        });

        revalidatePath("/admin/users");
      }} method="post" className="max-w-3xl rounded-md border bg-white p-6">
        <input type="hidden" name="userId" value={user.id} />

        <div className="mb-4">
          <label className="block text-sm text-gray-600">الاسم</label>
          <input name="name" defaultValue={user.name} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600">البريد الإلكتروني</label>
          <input name="email" defaultValue={user.email ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600">الهاتف</label>
          <input name="phone" defaultValue={user.phone} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600">الدور</label>
          <select name="role" defaultValue={user.role} className="mt-1 w-full rounded-md border px-3 py-2">
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="VENDOR">VENDOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked={user.isActive} />
            <span className="text-sm text-gray-600">نشط</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="rounded-md bg-field-700 px-4 py-2 text-sm font-bold text-white">حفظ التغييرات</button>
          <a href={`/admin/users/${user.id}`} className="rounded-md border px-4 py-2 text-sm">إلغاء</a>
        </div>
      </form>
    </div>
  );
}
