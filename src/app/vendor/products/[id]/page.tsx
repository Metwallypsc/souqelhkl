import { SiteHeader } from "@/components/site-header";
import VendorProductForm from "@/components/vendor-product-form";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";

export default async function EditVendorProductPage({ params }: { params: { id: string } }) {
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
    return (
      <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
        <SiteHeader />
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">ليس لديك حساب بائع.</section>
      </main>
    );
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.vendorId !== vendorUser.vendorId) {
    return (
      <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
        <SiteHeader />
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">المنتج غير موجود أو ليس لك</section>
      </main>
    );
  }

  const products = await prisma.product.findMany({ select: { id: true, nameAr: true }, orderBy: { createdAt: "desc" } });
  const productOptions = products.map((p) => ({ id: p.id, nameAr: p.nameAr }));

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-black mb-4">تعديل المنتج</h1>
        <VendorProductForm initial={listing} productOptions={productOptions} onSaved={() => { window.location.href = '/vendor/products'; }} />
      </section>
    </main>
  );
}
