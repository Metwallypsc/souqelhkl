"use client";

import { useState } from "react";

type FieldErrors = Record<string, string[] | undefined>;

const inputClass = "rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500";

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result.message ?? "لم يتم إنشاء الحساب");
      setErrors(result.errors ?? {});
      return;
    }

    event.currentTarget.reset();
    setMessage("تم إنشاء الحساب بنجاح. تسجيل الدخول الفعلي هنوصله في خطوة لاحقة.");
  }

  function fieldError(name: string) {
    return errors[name]?.[0] ? <p className="mt-1 text-xs font-bold text-red-700">{errors[name]?.[0]}</p> : null;
  }

  return (
    <form className="grid gap-4 rounded-md border border-field-100 bg-white p-5" onSubmit={handleSubmit}>
      {message ? <div className="rounded-md bg-[#fff8dc] p-3 text-sm font-bold text-[#4d4215]">{message}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          الاسم بالكامل
          <input className={inputClass} name="name" placeholder="مثال: أحمد محمد" />
          {fieldError("name")}
        </label>
        <label className="grid gap-2 text-sm font-bold">
          رقم الموبايل
          <input className={inputClass} dir="ltr" name="phone" placeholder="01xxxxxxxxx" />
          {fieldError("phone")}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        البريد الإلكتروني اختياري
        <input className={inputClass} dir="ltr" name="email" placeholder="name@example.com" />
        {fieldError("email")}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          كلمة المرور
          <input className={inputClass} name="password" type="password" />
          {fieldError("password")}
        </label>
        <label className="grid gap-2 text-sm font-bold">
          تأكيد كلمة المرور
          <input className={inputClass} name="confirmPassword" type="password" />
          {fieldError("confirmPassword")}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          المحافظة
          <input className={inputClass} defaultValue="القاهرة" name="governorate" />
          {fieldError("governorate")}
        </label>
        <label className="grid gap-2 text-sm font-bold">
          المدينة / المنطقة
          <input className={inputClass} name="city" placeholder="مثال: مدينة نصر" />
          {fieldError("city")}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        العنوان بالتفصيل
        <input className={inputClass} name="addressLine" placeholder="شارع، عمارة، دور، علامة مميزة" />
        {fieldError("addressLine")}
      </label>

      <label className="grid gap-2 text-sm font-bold">
        لينك Google Maps اختياري
        <input className={inputClass} dir="ltr" name="googleMapsLink" placeholder="https://maps.google.com/..." />
        {fieldError("googleMapsLink")}
      </label>

      <label className="grid gap-2 text-sm font-bold">
        ملاحظات للعنوان اختياري
        <textarea className={`${inputClass} min-h-24 resize-y`} name="notes" placeholder="أي تفاصيل تساعد الشحن" />
        {fieldError("notes")}
      </label>

      <button
        className="rounded-md bg-field-700 px-5 py-4 text-sm font-black text-white disabled:bg-gray-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
      </button>
    </form>
  );
}
