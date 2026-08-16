import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function VendorProductsPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
        <SiteHeader />
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">ادخل أولاً</section>
      </main>
    );
  }

  const vendorUser = await prisma.vendorUser.findUnique({ where: { userId: session.user.id } });
  if (!vendorUser) {
    const pendingApplication = await prisma.vendorApplication.findFirst({
      where: { userId: session.user.id, status: "PENDING" },
      orderBy: { createdAt: "desc" }
    });

    return (
      <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
        <SiteHeader />
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {pendingApplication ? (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
              طلبك كبائع قيد المراجعة من الإدارة. سيتم تفعيل الحساب بعد الموافقة.
            </div>
          ) : (
            <div className="rounded-md border border-field-100 bg-white p-6">
              ليس لديك حساب بائع. يمكنك تقديم طلب الانضمام من
              <a href="/vendor/apply" className="mx-1 font-bold text-field-700 underline">هنا</a>
            </div>
          )}
        </section>
      </main>
    );
  }

  const listings = await prisma.listing.findMany({ where: { vendorId: vendorUser.vendorId }, orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black">منتجات البائع</h1>
          <Link href="/vendor/products/new" className="rounded-md bg-field-700 px-4 py-2 text-sm font-bold text-white">إضافة منتج جديد</Link>
        </div>

        <div className="grid gap-4">
          {listings.length === 0 ? (
            <div className="rounded-md border border-field-100 bg-white p-6">لا توجد منتجات بعد.</div>
          ) : (
            listings.map((l) => (
              <article key={l.id} className="grid gap-4 rounded-md border border-field-100 bg-white p-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="text-lg font-black">{l.unitNameAr} · {l.unitNameEn ?? ""}</h2>
                  <p className="mt-1 text-sm text-[#687a62]">السعر: {String(l.priceEgp)}</p>
                  <p className="mt-1 text-sm text-[#40533b]">الكمية: {String(l.stockQuantity)}</p>
                  <p className="mt-1 text-sm text-[#40533b]">الوزن: {String(l.weightGrams)} جرام</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/vendor/products/${l.id}`} className="rounded-md border border-field-100 px-3 py-2 text-sm font-bold">تعديل</Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
