import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function SysAdminPage() {
  const [userCount, vendorCount, listingCount, orderCount, pendingVendors, pendingProducts] = await Promise.all([
    prisma.user.count(),
    prisma.vendor.count(),
    prisma.listing.count(),
    prisma.order.count(),
    prisma.vendorApplication.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { status: "PENDING_REVIEW" } }),
  ]);

  const stats = [
    { label: "إجمالي المستخدمين", value: userCount, icon: "👥", href: "/sysadmin/users" },
    { label: "البائعون", value: vendorCount, icon: "🏪", href: "/admin/products" },
    { label: "الطلبات", value: orderCount, icon: "🛒", href: "/admin/orders" },
    { label: "القوائم", value: listingCount, icon: "📊", href: "/admin/products" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-700">نظام الإدارة المركزي</p>
          <h1 className="text-3xl font-black text-slate-900">لوحة تحكم المدير الرئيسية</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
          <span>🛡️</span>
          الوضع الآمن: تم تفعيل الوصول الإداري
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon, href }) => (
          <Link key={label} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-700">
                {icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">مؤشرات العمليات</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">إحصائيات مباشرة</span>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">طلبات البائعين الجديدة</span>
                <span className="text-lg font-black text-amber-600">{pendingVendors}</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">منتجات في انتظار المراجعة</span>
                <span className="text-lg font-black text-rose-600">{pendingProducts}</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">نسبة الاستجابة</span>
                <span className="text-lg font-black text-emerald-600">97%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-900">اختصارات سريعة</h2>
          <div className="space-y-3">
            <Link href="/sysadmin/users" className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50">المستخدمون <span>→</span></Link>
            <Link href="/admin/products" className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50">مراجعة المنتجات <span>→</span></Link>
            <Link href="/admin/orders" className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50">الطلبات والمدفوعات <span>→</span></Link>
            <Link href="/sysadmin/settings" className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50">إعدادات المدير <span>→</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
