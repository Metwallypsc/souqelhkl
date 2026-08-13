"use client";

import { useState } from "react";

type Props = {
  initial?: any;
  onSaved?: (listing: any) => void;
  productOptions?: { id: string; nameAr: string }[];
};

export default function VendorProductForm({ initial, onSaved, productOptions = [] }: Props) {
  const [formState, setFormState] = useState({
    productId: initial?.productId ?? "",
    unitNameAr: initial?.unitNameAr ?? "",
    unitNameEn: initial?.unitNameEn ?? "",
    priceEgp: initial?.priceEgp ?? "",
    stockQuantity: initial?.stockQuantity ?? "",
    weightGrams: initial?.weightGrams ?? "",
    availabilityStatus: initial?.availabilityStatus ?? "AVAILABLE"
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const method = initial?.id ? "PUT" : "POST";
      const url = initial?.id ? `/api/vendor/products/${initial.id}` : "/api/vendor/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: formState.productId,
          unitNameAr: formState.unitNameAr,
          unitNameEn: formState.unitNameEn,
          priceEgp: formState.priceEgp,
          stockQuantity: formState.stockQuantity,
          weightGrams: formState.weightGrams,
          availabilityStatus: formState.availabilityStatus
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error saving");
      onSaved?.(json.listing);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-md border border-field-100 bg-white p-5" onSubmit={submit}>
      {error ? <div className="text-red-700">{error}</div> : null}

      <label className="grid gap-2 text-sm font-bold">
        المنتج (معرف)
        <select
          className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500"
          value={formState.productId}
          onChange={(e) => setFormState({ ...formState, productId: e.target.value })}
        >
          <option value="">اختر منتجًا أساسيًا</option>
          {productOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nameAr}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-bold">
        اسم الوحدة (عربي)
        <input className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" value={formState.unitNameAr} onChange={(e) => setFormState({ ...formState, unitNameAr: e.target.value })} />
      </label>

      <label className="grid gap-2 text-sm font-bold">
        اسم الوحدة (انجليزي)
        <input className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" value={formState.unitNameEn} onChange={(e) => setFormState({ ...formState, unitNameEn: e.target.value })} />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold">
          السعر (جنيه)
          <input className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" type="number" step="0.01" value={formState.priceEgp} onChange={(e) => setFormState({ ...formState, priceEgp: e.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          الكمية في المخزون
          <input className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" type="number" step="1" value={formState.stockQuantity} onChange={(e) => setFormState({ ...formState, stockQuantity: e.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          الوزن بالجرامات
          <input className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" type="number" step="1" value={formState.weightGrams} onChange={(e) => setFormState({ ...formState, weightGrams: e.target.value })} />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        حالة التوفر
        <select className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" value={formState.availabilityStatus} onChange={(e) => setFormState({ ...formState, availabilityStatus: e.target.value })}>
          <option value="AVAILABLE">متوفر</option>
          <option value="UNAVAILABLE">غير متوفر</option>
        </select>
      </label>

      <div className="flex items-center gap-3">
        <button className="rounded-md bg-field-700 px-5 py-3 text-sm font-black text-white" disabled={saving}>
          {saving ? "جاري الحفظ..." : initial?.id ? "حفظ التعديل" : "إنشاء المنتج"}
        </button>
      </div>
    </form>
  );
}
