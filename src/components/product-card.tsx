import Link from "next/link";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-md border border-field-100 bg-white p-4">
      <Link href={`/products/${product.slug}`}>
        <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-md bg-[#e4efd9] text-4xl">
          {product.nameAr.slice(0, 1)}
        </div>
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link className="font-black hover:text-field-700" href={`/products/${product.slug}`}>
            {product.nameAr}
          </Link>
          <p className="mt-1 text-sm text-[#687a62]">{product.seller}</p>
        </div>
        <span
          className={`rounded-md px-2 py-1 text-xs font-bold ${
            product.available ? "bg-field-100 text-field-700" : "bg-red-50 text-red-700"
          }`}
        >
          {product.available ? "متوفر" : "غير متوفر"}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#40533b]">{product.unit}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xl font-black">{product.priceEgp} جنيه</p>
        <button
          disabled={!product.available}
          className="rounded-md bg-field-700 px-4 py-2 text-sm font-bold text-white disabled:bg-gray-300"
        >
          أضف للسلة
        </button>
      </div>
    </article>
  );
}
