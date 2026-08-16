"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

const inputClass = "rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500";

type VendorAccountData = {
  email: string;
  username: string | null;
  storeName: string;
  name: string;
  address: string;
  city: string;
  governorate: string;
  phone: string;
  logoUrl: string | null;
};

type FieldErrors = Record<string, string[] | undefined>;

export default function VendorAccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<VendorAccountData>({
    email: "",
    username: "",
    storeName: "",
    name: "",
    address: "",
    city: "",
    governorate: "",
    phone: "",
    logoUrl: ""
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/vendor/account");
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "تعذر تحميل بيانات الحساب");
        setLoading(false);
        return;
      }
      setForm({
        email: data.user?.email ?? "",
        username: data.user?.username ?? "",
        storeName: data.vendor?.storeName ?? "",
        name: data.user?.name ?? "",
        address: data.vendor?.address ?? "",
        city: data.vendor?.city ?? "",
        governorate: data.vendor?.governorate ?? "",
        phone: data.vendor?.phone ?? data.user?.phone ?? "",
        logoUrl: data.vendor?.logoUrl ?? ""
      });
      setLoading(false);
    }

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage(null);

    const payload = {
      name: form.name,
      storeName: form.storeName,
      address: form.address,
      city: form.city,
      governorate: form.governorate,
      phone: form.phone,
      logoUrl: form.logoUrl,
      currentPassword: (document.getElementById("currentPassword") as HTMLInputElement)?.value ?? "",
      newPassword: (document.getElementById("newPassword") as HTMLInputElement)?.value ?? "",
      confirmPassword: (document.getElementById("confirmPassword") as HTMLInputElement)?.value ?? ""
    };

    const res = await fetch("/api/vendor/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(data.message ?? "تعذر حفظ البيانات");
      setErrors(data.errors ?? {});
      return;
    }

    setMessage(data.message ?? "تم حفظ بيانات الحساب بنجاح");
  }

  function fieldError(name: string) {
    return errors[name]?.[0] ? <p className="mt-1 text-xs font-bold text-red-700">{errors[name]?.[0]}</p> : null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
        <SiteHeader />
        <section className="mx-auto max-w-4xl px-4 py-8">جارٍ تحميل بيانات الحساب...</section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[#40533b]">حساب البائع</p>
            <h1 className="text-3xl font-black">إعدادات المتجر</h1>
          </div>
          <a href="/vendor/products" className="rounded-md bg-field-700 px-4 py-2 text-sm font-bold text-white">
            منتجاتي
          </a>
        </div>

        {message ? <div className="mb-4 rounded-md bg-[#f6f8d7] p-3 text-sm font-bold text-[#4d4215]">{message}</div> : null}

        <form className="grid gap-5 rounded-2xl border border-field-100 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              اسم المتجر / اسم المتجر المخصص
              <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={inputClass} />
              {fieldError("storeName")}
            </label>
            <label className="grid gap-2 text-sm font-bold">
              اسم الحساب (غير قابل للتغيير)
              <input value={form.username ?? ""} readOnly className={`${inputClass} bg-gray-100`} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              الاسم الكامل
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              البريد الإلكتروني (غير قابل للتغيير)
              <input value={form.email} readOnly className={`${inputClass} bg-gray-100`} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              الهاتف
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} dir="ltr" />
              {fieldError("phone")}
            </label>
            <label className="grid gap-2 text-sm font-bold">
              رابط الشعار (URL)
              <input value={form.logoUrl ?? ""} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} className={inputClass} dir="ltr" placeholder="https://.../logo.png" />
              {fieldError("logoUrl")}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              المحافظة / الإمارة
              <input value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })} className={inputClass} />
              {fieldError("governorate")}
            </label>
            <label className="grid gap-2 text-sm font-bold">
              المدينة
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
              {fieldError("city")}
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold">
            العنوان
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
            {fieldError("address")}
          </label>

          <div className="rounded-md border border-field-100 bg-[#fafcf9] p-4">
            <h2 className="mb-3 text-lg font-black">تغيير كلمة المرور</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-bold">
                كلمة المرور الحالية
                <input id="currentPassword" type="password" className={inputClass} />
                {fieldError("currentPassword")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                كلمة المرور الجديدة
                <input id="newPassword" type="password" className={inputClass} />
                {fieldError("newPassword")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                تأكيد كلمة المرور الجديدة
                <input id="confirmPassword" type="password" className={inputClass} />
                {fieldError("confirmPassword")}
              </label>
            </div>
          </div>

          <button className="rounded-md bg-field-700 px-5 py-4 text-sm font-black text-white disabled:bg-gray-400" disabled={saving} type="submit">
            {saving ? "جاري حفظ البيانات..." : "حفظ التغييرات"}
          </button>
        </form>
      </section>
    </main>
  );
}
