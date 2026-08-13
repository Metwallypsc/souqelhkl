import { SiteHeader } from "@/components/site-header";

const principles = [
  "تجميع المنتجات الزراعية المتفرقة في سوق واحد.",
  "السماح للبائعين المعتمدين بإدارة منتجاتهم وأسعارهم.",
  "طلب واحد وشحنة واحدة للعميل حتى مع تعدد البائعين.",
  "مراجعة المنتجات والتحويلات من الإدارة قبل التشغيل الكامل."
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-sm font-bold text-field-700">عن المنصة</p>
        <h1 className="mt-2 text-3xl font-black">سوق الحقل</h1>
        <p className="mt-5 text-lg leading-9 text-[#40533b]">
          سوق الحقل هو متجر زراعي متعدد البائعين يبدأ من القاهرة، هدفه يخدم المزارعين
          المنزليين وكل المهتمين بشراء البذور والشتلات والتربة والأدوات الزراعية من مكان
          واحد، مع إدارة الطلب والشحن والعمولة من خلال المنصة.
        </p>
        <div className="mt-8 grid gap-3">
          {principles.map((principle) => (
            <div key={principle} className="rounded-md border border-field-100 bg-white p-4 font-bold">
              {principle}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
