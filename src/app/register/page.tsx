import { SiteHeader } from "@/components/site-header";
import { RegisterForm } from "@/app/register/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-md bg-field-900 p-6 text-white">
          <p className="text-sm font-bold text-harvest">حساب العميل</p>
          <h1 className="mt-3 text-3xl font-black leading-tight">إنشاء حساب للشراء من سوق الحقل</h1>
          <p className="mt-4 leading-8 text-field-100">
            التسجيل مطلوب لإتمام الطلبات. في النسخة الأولى هنحفظ عنوان واحد للعميل،
            بدون أكواد تحقق، ومع تجهيز النظام لاحقًا لتسجيل الدخول ومتابعة الطلبات.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold">
            <div className="rounded-md bg-white/10 p-3">رقم الموبايل لا يتكرر</div>
            <div className="rounded-md bg-white/10 p-3">العنوان مرتبط بحساب العميل</div>
            <div className="rounded-md bg-white/10 p-3">كلمة المرور محفوظة كـ hash</div>
          </div>
        </aside>
        <RegisterForm />
      </section>
    </main>
  );
}
