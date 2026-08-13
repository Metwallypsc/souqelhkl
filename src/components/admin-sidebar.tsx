import Link from "next/link";
import { Package, ShoppingCart, ShieldCheck, ClipboardList, Settings, Home } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col justify-between border-l border-slate-800">
      <div>
        <div className="flex items-center gap-2 px-2 py-4 border-b border-slate-800 mb-6">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="font-bold text-lg">لوحة تحكم الإدارة</h1>
            <p className="text-xs text-slate-400">سوق الحقل - مصر</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <Package className="w-5 h-5 text-emerald-400" />
            <span>مراجعة المنتجات</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <span>مراجعة الطلبات والمدفوعات</span>
          </Link>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 text-xs">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>العودة للمتجر الرئيسي</span>
        </Link>
      </div>
    </aside>
  );
}
