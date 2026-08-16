"use client";

import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";

const inputClass = "rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500";

type FieldErrors = Record<string, string[] | undefined>;

export default function VendorApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fileName, setFileName] = useState("لم يتم اختيار ملف");

  const captchaTarget = useMemo(() => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { a, b, total: a + b };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const file = formData.get("taxCardImage") as File | null;
    if (file && file.size > 0) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("فشل قراءة الملف"));
        reader.readAsDataURL(file);
      });
      (payload as any).taxCardImageDataUrl = base64;
    }

    const response = await fetch("/api/vendor/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result.message ?? "تعذر إرسال الطلب");
      setErrors(result.errors ?? {});
      return;
    }

    event.currentTarget.reset();
    setFileName("لم يتم اختيار ملف");
    setMessage("تم إرسال طلب الانضمام بنجاح. سيتم مراجعة الحساب من الإدارة قبل تفعيل إمكانية إضافة المنتجات.");
  }

  function fieldError(name: string) {
    return errors[name]?.[0] ? <p className="mt-1 text-xs font-bold text-red-700">{errors[name]?.[0]}</p> : null;
  }

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-bold text-[#40533b]">نموذج طلب الانضمام كبائع</p>
          <h1 className="mt-2 text-3xl font-black">انضم إلى سوق الحقل كبائع</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl bg-field-900 p-6 text-white">
            <div className="space-y-4 text-sm leading-7 text-field-100">
              <p>سيتم مراجعة طلبك من الإدارة قبل تفعيل حساب البائع.</p>
              <p>يجب إرفاق صورة البطاقة الضريبية، وإدخال بيانات صحيحية.</p>
              <p>بعد الموافقة يمكنك الدخول باستخدام اسم المستخدم وكلمة المرور وتفعيل إضافة المنتجات.</p>
            </div>
            <div className="mt-6 space-y-3 text-sm font-bold">
              <div className="rounded-md bg-white/10 p-3">مراجعة الإدارة</div>
              <div className="rounded-md bg-white/10 p-3">تفعيل حساب البائع بعد الموافقة</div>
              <div className="rounded-md bg-white/10 p-3">إمكانية إضافة المنتجات فقط بعد التفعيل</div>
            </div>
          </aside>

          <form className="grid gap-4 rounded-2xl border border-field-100 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
            {message ? <div className="rounded-md bg-[#f6f8d7] p-3 text-sm font-bold text-[#4d4215]">{message}</div> : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                الشركة
                <input name="companyName" className={inputClass} placeholder="اسم الشركة/المتجر" />
                {fieldError("companyName")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                الرقم الضريبي
                <input name="taxNumber" className={inputClass} placeholder="123456789" dir="ltr" />
                {fieldError("taxNumber")}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                الاسم الأول
                <input name="firstName" className={inputClass} placeholder="أحمد" />
                {fieldError("firstName")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                الاسم الأخير
                <input name="lastName" className={inputClass} placeholder="محمد" />
                {fieldError("lastName")}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                البريد الإلكتروني
                <input name="email" type="email" className={inputClass} dir="ltr" placeholder="name@example.com" />
                {fieldError("email")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                الهاتف
                <input name="phone" className={inputClass} dir="ltr" placeholder="01xxxxxxxxx" />
                {fieldError("phone")}
              </label>
            </div>

            <label className="grid gap-2 text-sm font-bold">
              اسم المستخدم
              <input name="username" className={inputClass} dir="ltr" placeholder="username" />
              {fieldError("username")}
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                كلمة المرور
                <input name="password" type="password" className={inputClass} dir="ltr" />
                {fieldError("password")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                تأكيد كلمة المرور
                <input name="confirmPassword" type="password" className={inputClass} dir="ltr" />
                {fieldError("confirmPassword")}
              </label>
            </div>

            <label className="grid gap-2 text-sm font-bold">
              الوصف
              <textarea name="description" className={`${inputClass} min-h-28 resize-y`} placeholder="وصف مختصر عن النشاط التجاري" />
              {fieldError("description")}
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                العنوان
                <input name="address" className={inputClass} placeholder="العنوان التفصيلي" />
                {fieldError("address")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                المدينة
                <input name="city" className={inputClass} placeholder="القاهرة" />
                {fieldError("city")}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                الدولة
                <input name="country" className={inputClass} placeholder="Egypt" />
                {fieldError("country")}
              </label>
              <label className="grid gap-2 text-sm font-bold">
                المحافظة/الإمارة
                <input name="governorate" className={inputClass} placeholder="القاهرة" />
                {fieldError("governorate")}
              </label>
            </div>

            <label className="grid gap-2 text-sm font-bold">
              صورة البطاقة الضريبية
              <input
                type="file"
                accept="image/*"
                name="taxCardImage"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "لم يتم اختيار ملف")}
                className="block w-full rounded-md border border-dashed border-field-200 bg-[#f9fbf7] px-3 py-3 text-sm"
              />
              <span className="text-xs text-[#40533b]">{fileName}</span>
              {fieldError("taxCardImageDataUrl")}
            </label>

            <div className="rounded-md border border-[#e7e5d4] bg-[#faf7e8] p-3">
              <input type="hidden" name="captchaTotal" value={captchaTarget.total} />
              <label className="grid gap-2 text-sm font-bold">
                التحقق بالكابتشا
                <div className="rounded-md bg-white px-3 py-2 text-sm font-black text-[#182414]">
                  {captchaTarget.a} + {captchaTarget.b} = ?
                </div>
                <input
                  name="captchaAnswer"
                  className={inputClass}
                  dir="ltr"
                  placeholder={`اكتب الناتج ${captchaTarget.total}`}
                />
                {fieldError("captchaAnswer")}
              </label>
            </div>

            <button
              className="rounded-md bg-field-700 px-5 py-4 text-sm font-black text-white disabled:bg-gray-300"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "جاري إرسال الطلب..." : "إرسال طلب الانضمام"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
