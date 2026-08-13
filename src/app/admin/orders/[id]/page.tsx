import { AdminSidebar } from "@/components/admin-sidebar";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { reviewInstaPayPayment, updateOrderStatus, updateVendorOrderStatus } from "@/lib/admin-actions";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: { id: string };
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      payment: true,
      shippingDetail: true,
      vendorOrders: { include: { vendor: true } },
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  async function handlePaymentReview(formData: FormData) {
    "use server";
    const paymentId = formData.get("paymentId") as string;
    const status = formData.get("status") as "APPROVED" | "REJECTED";
    const notes = formData.get("notes") as string;
    await reviewInstaPayPayment(paymentId, status, notes);
    revalidatePath(`/admin/orders/${id}`);
  }

  async function handleOrderStatusUpdate(formData: FormData) {
    "use server";
    const newStatus = formData.get("status") as any;
    const note = formData.get("note") as string;
    await updateOrderStatus(id, newStatus, note);
    revalidatePath(`/admin/orders/${id}`);
  }

  async function handleVendorOrderAction(formData: FormData) {
    "use server";
    const vendorOrderId = formData.get("vendorOrderId") as string;
    const newStatus = formData.get("status") as any;
    const reason = formData.get("reason") as string;
    await updateVendorOrderStatus(vendorOrderId, newStatus, reason);
    revalidatePath(`/admin/orders/${id}`);
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 rtl font-sans" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold">تفاصيل الطلب #{order.id.slice(-8)}</h1>
            <p className="text-sm text-slate-400">تاريخ الطلب: {new Date(order.createdAt).toLocaleString("ar-EG")}</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm text-emerald-400 font-bold">
              الحالة العامة: {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4 text-emerald-400">منتجات الطلب</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <div>
                      <div className="font-semibold">{item.productNameAr}</div>
                      <div className="text-xs text-slate-400">
                        التاجر: {item.vendorName} | الوحدة: {item.unitNameAr} | الكمية: {Number(item.quantity)}
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold">{Number(item.lineTotalEgp).toFixed(2)} ج.م</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between font-bold">
                <span>الإجمالي الكلي:</span>
                <span className="text-emerald-400 text-lg">{Number(order.totalEgp).toFixed(2)} ج.م</span>
              </div>
            </div>

            {/* Vendor Sub-Orders Management */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4 text-emerald-400">طلبات التجار الفرعية</h2>
              <div className="space-y-4">
                {order.vendorOrders.map((vOrder) => (
                  <div key={vOrder.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="font-bold text-white">{vOrder.vendor.name}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        المبلغ الفرعي: {Number(vOrder.subtotalEgp).toFixed(2)} ج.م | الحالة: <span className="text-emerald-300 font-semibold">{vOrder.status}</span>
                      </div>
                    </div>
                    <form action={handleVendorOrderAction} className="flex items-center gap-2">
                      <input type="hidden" name="vendorOrderId" value={vOrder.id} />
                      <select name="status" defaultValue={vOrder.status} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white">
                        <option value="PENDING">معلق</option>
                        <option value="ACCEPTED">مقبول</option>
                        <option value="REJECTED">مرفوض</option>
                        <option value="DELIVERED_TO_COLLECTION_CENTER">تم التسليم لمركز التجميع</option>
                      </select>
                      <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded transition-colors">
                        تحديث
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4 text-emerald-400">سجل حالات الطلب</h2>
              <div className="space-y-2">
                {order.statusHistory.map((h) => (
                  <div key={h.id} className="text-xs bg-slate-950 p-3 rounded border border-slate-850 flex justify-between">
                    <div>
                      <span className="font-bold text-emerald-300">{h.status}</span>
                      {h.note && <p className="text-slate-400 mt-1">{h.note}</p>}
                    </div>
                    <span className="text-slate-500">{new Date(h.createdAt).toLocaleString("ar-EG")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info & Actions */}
          <div className="space-y-6">
            {/* Customer & Shipping */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4 text-emerald-400">بيانات العميل والشحن</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">اسم العميل</span>
                  <span className="font-medium">{order.customer.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">رقم الهاتف</span>
                  <span className="font-medium">{order.customer.phone}</span>
                </div>
                {order.shippingDetail && (
                  <>
                    <div>
                      <span className="text-xs text-slate-400 block">العنوان</span>
                      <span className="font-medium">{order.shippingDetail.governorate} - {order.shippingDetail.city} - {order.shippingDetail.addressLine}</span>
                    </div>
                    {order.shippingDetail.googleMapsLink && (
                      <div>
                        <a href={order.shippingDetail.googleMapsLink} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline">
                          فتح موقع الخريطة ↗
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* InstaPay Verification */}
            {order.paymentMethod === "INSTAPAY" && order.payment && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4 text-purple-400">إيصال تحويل إنستاباي</h2>
                {order.payment.transferImageUrl ? (
                  <div className="mb-4">
                    <img src={order.payment.transferImageUrl} alt="إيصال التحويل" className="w-full h-48 object-cover rounded-lg border border-slate-800" />
                  </div>
                ) : (
                  <p className="text-xs text-amber-400 mb-4">لم يتم رفع صورة الإيصال بعد من العميل.</p>
                )}
                <div className="text-xs mb-4">
                  حالة الدفع الحالية: <span className="font-bold text-purple-300">{order.payment.status}</span>
                </div>

                <form action={handlePaymentReview} className="space-y-3">
                  <input type="hidden" name="paymentId" value={order.payment.id} />
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ملاحظات المراجعة</label>
                    <input type="text" name="notes" placeholder="سبب القبول أو الرفض..." className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" name="status" value="APPROVED" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-medium transition-colors">
                      قبول الدفع
                    </button>
                    <button type="submit" name="status" value="REJECTED" className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-xs font-medium transition-colors">
                      رفض الدفع
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* General Order Status Update */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4 text-emerald-400">تحديث حالة الطلب الكلية</h2>
              <form action={handleOrderStatusUpdate} className="space-y-3">
                <div>
                  <select name="status" defaultValue={order.status} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white">
                    <option value="NEW">جديد</option>
                    <option value="UNDER_REVIEW">تحت المراجعة</option>
                    <option value="AWAITING_VENDOR_CONFIRMATION">في انتظار تأكيد التجار</option>
                    <option value="READY_FOR_SHIPPING">جاهز للشحن</option>
                    <option value="SHIPPED">تم الشحن</option>
                    <option value="COMPLETED">مكتمل</option>
                    <option value="CANCELLED">ملغي</option>
                  </select>
                </div>
                <div>
                  <input type="text" name="note" placeholder="ملاحظة التحديث..." className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-medium transition-colors">
                  حفظ حالة الطلب
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
