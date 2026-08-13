import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { categories, getProductsByCategory } from "@/lib/catalog";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-sm font-bold text-field-700">هيكل الكتالوج</p>
        <h1 className="mt-2 text-3xl font-black">تصنيفات سوق الحقل</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              className="rounded-md border border-field-100 bg-white p-5"
              href={`/search?category=${category.slug}`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-field-100 text-xl font-black text-field-700">
                {category.nameAr.slice(0, 1)}
              </div>
              <h2 className="text-lg font-black">{category.nameAr}</h2>
              <p className="mt-2 min-h-16 text-sm leading-7 text-[#5b6d55]">{category.description}</p>
              <p className="mt-4 text-sm font-bold text-field-700">
                {getProductsByCategory(category.slug).length} منتج
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
