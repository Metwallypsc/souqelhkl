import Link from "next/link";

const footerLinks = {
  quickLinks: [
    { label: "الرئيسية", href: "/" },
    { label: "المنتجات", href: "/search" },
    { label: "التصنيفات", href: "/categories" },
    { label: "السلة", href: "/cart" },
  ],
  support: [
    { label: "تسجيل الدخول", href: "/auth/signin" },
    { label: "إطلب انضمام كبائع", href: "/vendor/apply" },
    { label: "طلباتي", href: "/orders" },
    { label: "من نحن", href: "/about" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[#dfe7d9] bg-[#eef5ea] text-[#24351f]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo-64.png" alt="سوق الحقل" className="h-10 w-10 object-contain" />
              <div>
                <div className="text-lg font-black text-[#1d2c1a]">سوق الحقل</div>
                <div className="text-xs text-[#496148]">كل احتياجات الزراعة</div>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#496148]">
              متجر عربي متخصص في مستلزمات الزراعة، البذور، الأشجار، الأسمدة، الأدوات، والمنتجات الزراعية الأساسية
              لتسهيل حياة المزارعين والمربين في المنزل والحديقة.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black text-[#1d2c1a]">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-[#496148]">
              {footerLinks.quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-[#1d2c1a]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black text-[#1d2c1a]">الدعم</h3>
            <ul className="space-y-2 text-sm text-[#496148]">
              {footerLinks.support.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-[#1d2c1a]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black text-[#1d2c1a]">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-[#496148]">
              <li>📍 مصر • القاهرة</li>
              <li>📞 +966 500 000 000</li>
              <li>✉️ hello@souqelhakl.com</li>
              <li>🕒 من الأحد إلى الخميس • 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#dce9d5] pt-4 text-center text-sm text-[#496148]">
          © 2026 سوق الحقل. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
