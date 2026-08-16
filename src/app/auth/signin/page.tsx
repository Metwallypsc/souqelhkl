"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password
    } as any);

    setLoading(false);

    if (!res) {
      setError("حدث خطأ غير متوقع");
      return;
    }

    if (res.error) {
      setError(res.error);
      return;
    }

    // success
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-black mb-4">تسجيل الدخول</h1>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {error ? <div className="rounded-md bg-[#fff8dc] p-3 text-sm font-bold text-[#4d4215]">{error}</div> : null}
          <label className="grid gap-2 text-sm font-bold">
            رقم الموبايل أو البريد أو اسم المستخدم
            <input className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            كلمة المرور
            <input type="password" className="rounded-md border border-field-100 px-3 py-3 text-sm outline-field-500" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button className="rounded-md bg-field-700 px-5 py-3 text-sm font-black text-white" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل دخول"}
          </button>
        </form>

        <div className="mt-5 grid gap-3 text-sm">
          <a href="/register" className="rounded-md border border-field-100 bg-white px-4 py-3 text-center font-bold text-[#182414]">
            إنشاء حساب جديد للعميل
          </a>
          <a href="/vendor/apply" className="rounded-md border border-field-100 bg-white px-4 py-3 text-center font-bold text-[#182414]">
            طلب الانضمام كبائع
          </a>
        </div>
      </div>
    </main>
  );
}
