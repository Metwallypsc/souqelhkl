import Link from "next/link";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-md border border-field-100 bg-white p-4 hover:shadow-md">
      <Link href={`/products/${product.slug}`}>
        <div className="mb-3 flex h-52 items-center justify-center rounded-md bg-[#eaf7ea]">
          {/* Placeholder image area */}
          <div className="text-6xl text-[#40533b]">{product.nameAr.slice(0, 1)}</div>
        </div>
      </Link>

      <div className="mb-2">
        <Link className="text-sm font-bold hover:text-field-700" href={`/products/${product.slug}`}>
          {product.nameAr}
        </Link>
        <p className="mt-1 text-xs text-[#687a62]">{product.seller}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-amber-500">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span className="text-gray-300">★</span>
        </div>
        <span className="text-xs text-[#687a62]">(12 تقييم)</span>
      </div>

      <p className="mt-3 text-sm text-[#40533b]">{product.unit}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold">{product.priceEgp} جنيه</p>
        </div>
        <button
          disabled={!product.available}
          className="rounded-md bg-harvest px-4 py-2 text-sm font-bold text-[#182414] disabled:bg-gray-300"
        >
          أضف للسلة
        </button>
      </div>
    </article>
  );
}
