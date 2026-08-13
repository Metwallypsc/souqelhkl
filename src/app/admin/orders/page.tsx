import { AdminSidebar } from "@/components/admin-sidebar";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      payment: true,
      shippingDetail: true,
      vendorOrders: { include: { vendor: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 rtl font-sans" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold">مراجعة الطلبات والمدفوعات</h1>
            <p className="text-sm text-slate-400">متابعة الطلبات، فحص إيصالات InstaPay، وتحديث حالات الشحن والتجار</p>
          </div>
          <span className="bg-emerald-900/40 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-800">
            إجمالي الطلبات: {orders.length}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            لا توجد طلبات مسجلة حتى الآن.
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">العميل</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">حالة الدفع</th>
                    <th className="p-4">حالة الطلب</th>
                    <th className="p-4">الإجمالي</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-emerald-400">{order.id.slice(-8)}</td>
                      <td className="p-4">
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-xs text-slate-400">{order.customer.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${order.paymentMethod === "INSTAPAY" ? "bg-purple-900/50 text-purple-300 border border-purple-800" : "bg-blue-900/50 text-blue-300 border border-blue-800"}`}>
                          {order.paymentMethod === "INSTAPAY" ? "إنستاباي" : "الدفع عند الاستلام"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.payment?.status === "APPROVED" ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800" :
                          order.payment?.status === "REJECTED" ? "bg-rose-900/50 text-rose-300 border border-rose-800" :
                          "bg-amber-900/50 text-amber-300 border border-amber-800"
                        }`}>
                          {order.payment?.status || "معلق"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">{Number(order.totalEgp).toFixed(2)} ج.م</td>
                      <td className="p-4 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors inline-block"
                        >
                          مراجعة التفاصيل
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
