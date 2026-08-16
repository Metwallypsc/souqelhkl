import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

const statusMap: Record<string, string> = {
  NEW: "جديد",
  UNDER_REVIEW: "قيد المراجعة",
  AWAITING_VENDOR_CONFIRMATION: "بانتظار تأكيد البائع",
  READY_FOR_SHIPPING: "جاهز للشحن",
  SHIPPED: "تم الشحن",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

const paymentStatusMap: Record<string, string> = {
  PENDING: "قيد الانتظار",
  UPLOADED: "تم الرفع",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

export default async function UserOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      customerId: session.user.id,
    },
    include: {
      items: {
        include: {
          listing: {
            include: {
              product: true,
              vendor: true,
            },
          },
        },
      },
      payment: true,
      shippingDetail: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6" dir="rtl">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[#40533b]">تفاصيل الطلب</p>
          <h1 className="text-3xl font-black text-[#182414]">#{order.id.slice(-8)}</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/orders" className="rounded-md border border-field-100 bg-white px-4 py-2 text-sm font-bold text-[#40533b]">
            رجوع للطلباتي
          </Link>
          <Link href="/" className="rounded-md bg-field-700 px-4 py-2 text-sm font-bold text-white">
            متابعة التسوق
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <section className="rounded-2xl border border-field-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-[#182414]">محتوى الطلب</h2>
            <span className="rounded-full bg-[#eef7ea] px-3 py-1 text-xs font-bold text-[#2b5930]">
              {statusMap[order.status] ?? order.status}
            </span>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-field-100 bg-[#fafcf9] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-black text-[#182414]">{item.productNameAr}</p>
                    <p className="text-sm text-[#40533b]">{item.vendorName} • {item.unitNameAr}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-[#40533b]">السعر</p>
                    <p className="font-black text-[#182414]">{Number(item.unitPriceEgp).toFixed(2)} ج.م</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#40533b]">
                  <span>الكمية: {Number(item.quantity).toFixed(2)}</span>
                  <span>الوزن: {item.weightGrams} جرام</span>
                  <span>الإجمالي: {Number(item.lineTotalEgp).toFixed(2)} ج.م</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-field-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-black text-[#182414]">ملخص الطلب</h3>
            <div className="space-y-3 text-sm text-[#40533b]">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-[#182414]">{Number(order.subtotalEgp).toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span className="font-bold text-[#182414]">{Number(order.shippingFeeEgp).toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between border-t border-field-100 pt-3 text-base font-black text-[#182414]">
                <span>الإجمالي</span>
                <span>{Number(order.totalEgp).toFixed(2)} ج.م</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-field-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-black text-[#182414]">الدفع</h3>
            <div className="space-y-2 text-sm text-[#40533b]">
              <p>طريقة الدفع: <span className="font-bold text-[#182414]">{order.paymentMethod === "INSTAPAY" ? "إنستاباي" : "الدفع عند الاستلام"}</span></p>
              <p>حالة الدفع: <span className="font-bold text-[#182414]">{paymentStatusMap[order.payment?.status ?? "PENDING"] ?? order.payment?.status ?? "قيد الانتظار"}</span></p>
            </div>
          </div>

          {order.shippingDetail ? (
            <div className="rounded-2xl border border-field-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-black text-[#182414]">بيانات الشحن</h3>
              <div className="space-y-2 text-sm text-[#40533b]">
                <p>{order.shippingDetail.governorate} - {order.shippingDetail.city}</p>
                <p>{order.shippingDetail.addressLine}</p>
                <p>الهاتف: {order.shippingDetail.phone}</p>
                {order.shippingDetail.notes ? <p>ملاحظات: {order.shippingDetail.notes}</p> : null}
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {order.statusHistory.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-field-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-black text-[#182414]">سجل الطلب</h3>
          <div className="space-y-3">
            {order.statusHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between border-b border-field-100 pb-3 text-sm last:border-b-0 last:pb-0">
                <span className="font-bold text-[#182414]">{statusMap[entry.status] ?? entry.status}</span>
                <span className="text-[#40533b]">{new Date(entry.createdAt).toLocaleString("ar-EG")}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}
