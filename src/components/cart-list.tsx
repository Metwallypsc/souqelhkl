"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { calculateShippingFee } from "@/lib/catalog";

type CartItem = Product & { quantity: number };

export default function CartList({ initialItems }: { initialItems: Product[] }) {
  const [items, setItems] = useState<CartItem[]>(
    initialItems.map((p) => ({ ...p, quantity: 1 }))
  );

  function inc(slug: string) {
    setItems((s) => s.map((it) => (it.slug === slug ? { ...it, quantity: it.quantity + 1 } : it)));
  }
  function dec(slug: string) {
    setItems((s) =>
      s
        .map((it) => (it.slug === slug ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))
    );
  }
  function remove(slug: string) {
    setItems((s) => s.filter((it) => it.slug !== slug));
  }

  const subtotal = items.reduce((t, i) => t + i.priceEgp * i.quantity, 0);
  const weight = items.reduce((t, i) => t + i.weightKg * i.quantity, 0);
  const shipping = calculateShippingFee(weight);

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="text-sm font-bold text-field-700">سلة مشتريات</p>
        <h1 className="mt-2 text-3xl font-black">طلب واحد من أكثر من بائع</h1>

        <div className="mt-6 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-md border border-field-100 bg-white p-6 text-center">السلة فارغة</div>
          ) : (
            items.map((item) => (
              <article
                key={item.slug}
                className="grid gap-4 rounded-md border border-field-100 bg-white p-4 sm:grid-cols-[96px_1fr_auto] items-center"
              >
                <div className="flex aspect-square items-center justify-center rounded-md bg-[#e4efd9] text-3xl font-black">
                  {item.nameAr.slice(0, 1)}
                </div>
                <div>
                  <Link className="font-black hover:text-field-700" href={`/products/${item.slug}`}>
                    {item.nameAr}
                  </Link>
                  <p className="mt-1 text-sm text-[#687a62]">{item.seller}</p>
                  <p className="mt-2 text-sm text-[#40533b]">
                    {item.unit} · {item.weightKg} كيلو
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-black">{item.priceEgp} جنيه</p>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <div className="flex items-center gap-2 rounded-md border border-field-100 bg-white p-1">
                      <button
                        aria-label="decrease"
                        onClick={() => dec(item.slug)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-sm text-field-700"
                      >
                        −
                      </button>
                      <div className="min-w-[36px] text-center font-bold">{item.quantity}</div>
                      <button
                        aria-label="increase"
                        onClick={() => inc(item.slug)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-sm text-field-700"
                      >
                        +
                      </button>
                    </div>

                    <button
                      aria-label="remove"
                      onClick={() => remove(item.slug)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-600"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <aside className="h-fit rounded-md border border-field-100 bg-white p-5">
        <h2 className="text-xl font-black">ملخص الطلب</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>قيمة المنتجات</span>
            <span className="font-bold">{subtotal} جنيه</span>
          </div>
          <div className="flex justify-between">
            <span>الوزن التقريبي</span>
            <span className="font-bold">{weight.toFixed(2)} كيلو</span>
          </div>
          <div className="flex justify-between">
            <span>الشحن</span>
            <span className="font-bold">{shipping} جنيه</span>
          </div>
          <div className="border-t border-field-100 pt-3">
            <div className="flex justify-between text-lg font-black">
              <span>الإجمالي</span>
              <span>{subtotal + shipping} جنيه</span>
            </div>
          </div>
        </div>
        <button className="mt-5 w-full rounded-md bg-field-700 px-5 py-3 text-sm font-black text-white">
          متابعة إتمام الطلب
        </button>
        <p className="mt-3 text-xs leading-6 text-[#687a62]">
          الدفع سيكون عند الاستلام أو InstaPay مع رفع صورة التحويل ومراجعة المدير.
        </p>
      </aside>
    </section>
  );
}
