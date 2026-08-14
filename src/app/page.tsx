import Link from "next/link";
import { ClipboardCheck, PackageCheck, Search, Store } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { categories, products } from "@/lib/catalog";

const workflow = [
  { label: "مراجعة الطلب", icon: ClipboardCheck },
  { label: "تأكيد البائع", icon: Store },
  { label: "تجميع الشحنة", icon: PackageCheck }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[250px_1fr]">
        <aside className="hidden flex-col gap-3 md:flex">
          <div className="rounded-md border border-field-100 bg-white p-4">
            <h3 className="mb-3 text-lg font-black">التصنيفات</h3>
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <Link key={category.slug} href={`/search?category=${category.slug}`} className="rounded-md px-3 py-2 text-sm font-semibold text-[#40533b] hover:bg-[#f0fbef]">
                  {category.nameAr}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-field-100 bg-white p-4">
            <h3 className="mb-3 text-lg font-black">خدماتنا</h3>
            <ul className="text-sm text-[#687a62]">
              <li>شحن موثوق</li>
              <li>دعم فني</li>
              <li>استبدال واسترجاع</li>
            </ul>
          </div>
        </aside>

        <main>
          <div className="mb-6 rounded-md bg-field-900 px-6 py-10 text-white sm:px-10">
            <h1 className="text-3xl font-extrabold">أهلاً بك في سوق الحقل</h1>
            <p className="mt-3 text-lg">كل ما تحتاجه من مستلزمات الزراعة في مكان واحد.</p>
          </div>

          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black">منتجات مقترحة</h2>
              <Link className="text-sm font-bold text-field-700" href="/search">عرض الكل</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 12).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-black">العروض المميزة</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(3, 11).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        </main>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">التصنيفات</h2>
          <Link className="text-sm font-bold text-field-700" href="/categories">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              className="flex min-h-20 items-center justify-center rounded-md border border-field-100 bg-white px-3 py-4 text-center text-sm font-bold text-[#24351f]"
              href={`/search?category=${category.slug}`}
            >
              {category.nameAr}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">منتجات مقترحة</h2>
          <Link className="text-sm font-bold text-field-700" href="/search">
            فلاتر البحث
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
