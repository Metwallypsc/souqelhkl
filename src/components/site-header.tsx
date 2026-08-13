import Link from "next/link";
import { Leaf, Search, ShoppingCart } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-field-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-field-700 text-white">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-xl font-bold leading-6">سوق الحقل</p>
            <p className="text-sm text-field-700">كل احتياجات الزراعة في مكان واحد</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#40533b] md:flex">
          <Link href="/search">المنتجات</Link>
          <Link href="/categories">التصنيفات</Link>
          <Link href="/about">عن سوق الحقل</Link>
          <Link href="/register">تسجيل</Link>
          <a href="https://wa.me/201000000000">واتساب</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            aria-label="بحث"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-field-100 text-field-700 sm:flex"
            href="/search"
          >
            <Search size={18} />
          </Link>
          <Link
            className="flex h-10 items-center gap-2 rounded-md bg-field-700 px-4 text-sm font-bold text-white"
            href="/cart"
          >
            <ShoppingCart size={18} />
            السلة
          </Link>
        </div>
      </div>
    </header>
  );
}
