import prisma from "@/lib/prisma";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default async function AdminIndex() {
  // small stats (best-effort; if Prisma not available in some envs these can be left as 0)
  const userCount = await prisma.user.count();
  const vendorCount = await prisma.vendor.count();
  const listingsCount = await prisma.listing.count();
  const ordersCount = await prisma.order.count();

  return (
    <div>
      <SiteHeader />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black">لوحة تحكم الإدارة</h1>
        <div className="text-sm text-[#40533b]">مرحبًا، هنا ملخص سريع للموقع</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users" className="rounded-md border border-field-100 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">المستخدمين</div>
          <div className="mt-2 text-2xl font-extrabold">{userCount}</div>
        </Link>

        <Link href="/admin/products" className="rounded-md border border-field-100 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">البائعين</div>
          <div className="mt-2 text-2xl font-extrabold">{vendorCount}</div>
        </Link>

        <Link href="/admin/products" className="rounded-md border border-field-100 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">القوائم</div>
          <div className="mt-2 text-2xl font-extrabold">{listingsCount}</div>
        </Link>

        <Link href="/admin/orders" className="rounded-md border border-field-100 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">الطلبات</div>
          <div className="mt-2 text-2xl font-extrabold">{ordersCount}</div>
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-black mb-3">أحدث الطلبات</h2>
        <div className="rounded-md border border-field-100 bg-white p-4">(قائمة الطلبات الحديثة تظهر هنا لاحقًا)</div>
      </section>
    </div>
  );
}
