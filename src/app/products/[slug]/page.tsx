import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { getCategoryBySlug, getProductBySlug, products } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);
  const relatedProducts = products
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex aspect-square items-center justify-center rounded-md bg-[#e4efd9] text-8xl font-black text-field-700">
          {product.nameAr.slice(0, 1)}
        </div>
        <div className="rounded-md border border-field-100 bg-white p-6">
          <p className="text-sm font-bold text-field-700">{category?.nameAr}</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black">{product.nameAr}</h1>
              <p className="mt-2 text-sm text-[#687a62]">البائع: {product.seller}</p>
            </div>
            <span
              className={`rounded-md px-3 py-2 text-xs font-bold ${
                product.available ? "bg-field-100 text-field-700" : "bg-red-50 text-red-700"
              }`}
            >
              {product.available ? "متوفر" : "غير متوفر"}
            </span>
          </div>
          <p className="mt-6 text-4xl font-black">{product.priceEgp} جنيه</p>
          <p className="mt-3 text-sm text-[#40533b]">
            وحدة البيع: {product.unit} · الوزن التقريبي: {product.weightKg} كيلو
          </p>
          <p className="mt-5 leading-8 text-[#40533b]">{product.description}</p>

          <div className="mt-6">
            <p className="mb-3 font-black">الاختيارات المتاحة</p>
            <div className="flex flex-wrap gap-2">
              {product.options.map((option) => (
                <button key={option} className="rounded-md border border-field-100 bg-[#f7faf4] px-3 py-2 text-sm font-bold">
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!product.available}
            className="mt-8 w-full rounded-md bg-field-700 px-5 py-4 text-sm font-black text-white disabled:bg-gray-300"
          >
            {product.available ? "أضف للسلة" : "غير متاح للشراء حاليا"}
          </button>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <h2 className="mb-4 text-2xl font-black">منتجات مشابهة</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
