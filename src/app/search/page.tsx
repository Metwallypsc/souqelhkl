import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { categories, products } from "@/lib/catalog";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    availability?: string;
    min?: string;
    max?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const minPrice = Number(params.min ?? 0);
  const maxPrice = Number(params.max ?? Number.MAX_SAFE_INTEGER);

  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      !query || product.nameAr.includes(query) || product.seller.includes(query) || product.description.includes(query);
    const matchesCategory = !params.category || product.categorySlug === params.category;
    const matchesAvailability =
      !params.availability ||
      params.availability === "all" ||
      (params.availability === "available" && product.available);
    const matchesPrice = product.priceEgp >= minPrice && product.priceEgp <= maxPrice;

    return matchesQuery && matchesCategory && matchesAvailability && matchesPrice;
  });

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-bold text-field-700">بحث المنتجات</p>
          <h1 className="mt-2 text-3xl font-black">كل المنتجات الزراعية</h1>
        </div>

        <form className="mb-6 grid gap-3 rounded-md border border-field-100 bg-white p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <input
            className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500"
            defaultValue={query}
            name="q"
            placeholder="اسم المنتج أو البائع"
          />
          <select
            className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500"
            defaultValue={params.category ?? ""}
            name="category"
          >
            <option value="">كل التصنيفات</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.nameAr}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500"
            defaultValue={params.availability ?? "all"}
            name="availability"
          >
            <option value="all">كل حالات التوفر</option>
            <option value="available">متوفر فقط</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="min-w-0 rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500"
              defaultValue={params.min ?? ""}
              name="min"
              placeholder="من"
              type="number"
            />
            <input
              className="min-w-0 rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500"
              defaultValue={params.max ?? ""}
              name="max"
              placeholder="إلى"
              type="number"
            />
          </div>
          <button className="rounded-md bg-field-700 px-5 py-3 text-sm font-black text-white">تطبيق</button>
        </form>

        <div className="mb-4 flex items-center justify-between text-sm text-[#40533b]">
          <span>{filteredProducts.length} منتج</span>
          <Link className="font-bold text-field-700" href="/search">
            إعادة ضبط
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
