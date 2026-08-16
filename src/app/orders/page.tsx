import Link from "next/link";
import { redirect } from "next/navigation";
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

export default async function UserOrdersPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: {
      items: true,
      payment: true,
      shippingDetail: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[#40533b]">حسابي</p>
          <h1 className="text-3xl font-black text-[#182414]">طلباتي</h1>
        </div>
        <Link href="/" className="rounded-md border border-field-100 bg-white px-4 py-2 text-sm font-bold text-[#40533b]">
          العودة للمتجر
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-field-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-3 text-5xl">📦</div>
          <h2 className="text-xl font-black text-[#182414]">لا توجد طلبات بعد</h2>
          <p className="mt-2 text-sm text-[#40533b]">ابدأ بتسوق المنتجات واطلب ما يناسبك.</p>
          <Link href="/" className="mt-5 inline-block rounded-md bg-field-700 px-5 py-3 text-sm font-bold text-white">
            تسوق الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-field-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-field-100 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-[#40533b]">رقم الطلب</p>
                  <p className="font-black text-[#182414]">#{order.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#40533b]">التاريخ</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                </div>
                <div>
                  <p className="text-sm text-[#40533b]">الحالة</p>
                  <span className="inline-flex rounded-full bg-[#eef7ea] px-3 py-1 text-xs font-bold text-[#2b5930]">
                    {statusMap[order.status] ?? order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#40533b]">الإجمالي</p>
                  <p className="font-black text-[#182414]">{Number(order.totalEgp).toFixed(2)} ج.م</p>
                </div>
                <Link href={`/orders/${order.id}`} className="rounded-md bg-field-700 px-4 py-2 text-sm font-bold text-white">
                  تفاصيل الطلب
                </Link>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-[#40533b]">عدد المنتجات</p>
                  <p className="font-bold text-[#182414]">{order.items.length} عنصر</p>
                </div>
                <div>
                  <p className="text-xs text-[#40533b]">طريقة الدفع</p>
                  <p className="font-bold text-[#182414]">{order.paymentMethod === "INSTAPAY" ? "إنستاباي" : "الدفع عند الاستلام"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#40533b]">حالة الدفع</p>
                  <p className="font-bold text-[#182414]">{paymentStatusMap[order.payment?.status ?? "PENDING"] ?? order.payment?.status ?? "قيد الانتظار"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
