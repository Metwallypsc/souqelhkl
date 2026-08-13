import { AdminSidebar } from "@/components/admin-sidebar";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function handleProductAction(formData: FormData) {
  "use server";
  const productId = formData.get("productId") as string;
  const action = formData.get("action") as string;

  if (!productId || !action) return;

  if (action === "approve") {
    await prisma.product.update({
      where: { id: productId },
      status: undefined, // ensure type compatibility or use correct enum
      data: { status: "APPROVED", isHidden: false },
    } as any);
  } else if (action === "reject") {
    await prisma.product.update({
      where: { id: productId },
      data: { status: "REJECTED", isHidden: true },
    });
  }

  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const pendingProducts = await prisma.product.findMany({
    where: { status: "PENDING_REVIEW" },
    include: {
      category: true,
      images: true,
      listings: {
        include: { vendor: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 rtl font-sans" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold">مراجعة المنتجات الجديدة</h1>
            <p className="text-sm text-slate-400">قبول أو رفض المنتجات المعلقة المضافة من التجار</p>
          </div>
          <span className="bg-emerald-900/40 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-800">
            {pendingProducts.length} منتج قيد الانتظار
          </span>
        </div>

        {pendingProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            لا توجد منتجات قيد المراجعة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingProducts.map((product) => (
              <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
                <div>
                  {product.images[0] && (
                    <img src={product.images[0].url} alt={product.nameAr} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded">
                      {product.category.nameAr}
                    </span>
                    <h2 className="font-bold text-lg mt-2">{product.nameAr}</h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description || "بدون وصف"}</p>
                    
                    <div className="mt-4 border-t border-slate-800 pt-3">
                      <p className="text-xs text-slate-300 font-semibold mb-1">العروض والأسعار:</p>
                      {product.listings.map((l) => (
                        <div key={l.id} className="text-xs text-slate-400 flex justify-between bg-slate-950 p-2 rounded mb-1">
                          <span>التاجر: {l.vendor.name}</span>
                          <span className="text-emerald-400 font-bold">{Number(l.priceEgp).toFixed(2)} ج.م / {l.unitNameAr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
                  <form action={handleProductAction} className="flex-1">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="action" value="approve" />
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                      موافقة ونشر
                    </button>
                  </form>
                  <form action={handleProductAction} className="flex-1">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="action" value="reject" />
                    <button type="submit" className="w-full bg-rose-600/80 hover:bg-rose-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                      رفض
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
