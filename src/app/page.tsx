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

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="flex min-h-[440px] flex-col justify-center rounded-md bg-field-900 px-6 py-10 text-white sm:px-10">
          <p className="mb-3 text-sm font-semibold text-harvest">القاهرة أولا</p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            سوق زراعي متعدد البائعين للمزارعين المنزليين
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-field-100">
            نعرض منتجات البائعين، العميل يطلب بسلة واحدة، البائعين يجهزوا المنتجات،
            والمنصة تدير المراجعة والشحن والعمولة بعد اكتمال الطلب.
          </p>
          <form action="/search" className="mt-8 flex max-w-xl items-center gap-2 rounded-md bg-white p-2 text-[#182414]">
            <Search className="mr-2 text-field-700" size={20} />
            <input
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none"
              name="q"
              placeholder="ابحث عن بذور، شتلات، تربة، أدوات..."
            />
            <button className="rounded-md bg-harvest px-5 py-3 text-sm font-black text-[#182414]">
              بحث
            </button>
          </form>
        </div>

        <aside className="rounded-md border border-field-100 bg-white p-5">
          <p className="mb-4 text-lg font-black">تشغيل الطلب في النسخة الأولى</p>
          <div className="space-y-4">
            {workflow.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-md bg-[#f2f8ed] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-field-700">
                    <Icon size={20} />
                  </div>
                  <span className="font-bold">{item.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-md bg-[#fff8dc] p-4 text-sm leading-7 text-[#4d4215]">
            الشحن يبدأ من 100 جنيه حتى 10 كيلو، وكل زيادة حتى لو جرام تضيف 25 جنيه.
          </div>
        </aside>
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
