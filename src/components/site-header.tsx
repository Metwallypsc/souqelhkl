import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-64.png" alt="سوق الحقل" className="h-10 w-10 object-contain" />
          <div className="hidden flex-col leading-4 sm:flex">
            <span className="text-lg font-extrabold">سوق الحقل</span>
            <span className="text-xs text-field-700">كل احتياجات الزراعة</span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-3xl">
            <form action="/search" className="relative">
              <input
                name="q"
                placeholder="ابحث عن بذور، شتلات، تربة، أدوات..."
                className="w-full rounded-md border border-field-100 bg-white py-3 pr-4 pl-12 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:border-field-700 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-field-700">
                <Search size={18} />
              </div>
            </form>
          </div>
        </div>

        {/* Right links */}
        <div className="ml-4 flex items-center gap-4 text-sm font-semibold text-[#40533b]">
          <Link href="/auth/signin" className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <span className="hidden sm:inline">حسابي</span>
          </Link>

          <Link href="/orders" className="hidden items-center gap-2 sm:flex">
            <span className="text-xl">🚚</span>
            <span>طلباتي</span>
          </Link>

          <Link href="/cart" className="relative flex items-center gap-2 rounded-md bg-field-700 px-3 py-2 text-sm font-bold text-white">
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">السلة</span>
            <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">3</span>
          </Link>
        </div>
      </div>

      {/* Secondary nav - categories placeholder */}
      <nav className="border-t border-field-100 bg-[#f8fbf6]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2 sm:px-6">
          {[
            "البذور",
            "الشتلات",
            "الأسمدة",
            "الآلات",
            "المبيدات",
            "التحضيرات",
            "الري",
            "الأدوات"
          ].map((c) => (
            <Link key={c} href={`/search?category=${encodeURIComponent(c)}`} className="whitespace-nowrap rounded-md px-3 py-1 text-sm font-semibold text-[#40533b] hover:bg-white">
              {c}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
