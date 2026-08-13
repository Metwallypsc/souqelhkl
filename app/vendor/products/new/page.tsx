"use client";

import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site-header";

const VendorProductForm = dynamic(() => import("@/components/vendor-product-form"), { ssr: false });

export default function NewVendorProductPage() {
  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-black mb-4">إضافة منتج جديد</h1>
        <VendorProductForm productOptions={[] /* TODO: fetch product options server-side if needed */} onSaved={() => { window.location.href = '/vendor/products'; }} />
      </section>
    </main>
  );
}
