import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateProductApprovalStatus, reviewInstaPayPayment, updateOrderStatus, updateVendorOrderStatus } from "@/lib/admin-actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "products") {
      const status = searchParams.get("status") || "PENDING_REVIEW";
      const products = await prisma.product.findMany({
        where: { status: status as any },
        include: {
          category: true,
          images: true,
          listings: {
            include: { vendor: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, products });
    }

    if (type === "orders") {
      const status = searchParams.get("status");
      const orders = await prisma.order.findMany({
        where: status ? { status: status as any } : undefined,
        include: {
          customer: true,
          payment: true,
          shippingDetail: true,
          vendorOrders: { include: { vendor: true } },
          items: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, orders });
    }

    return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin API GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, productId, paymentId, orderId, vendorOrderId, status, reviewNotes, rejectionReason, note, actorId } = body;

    if (action === "product_approval") {
      const result = await updateProductApprovalStatus(productId, status, actorId);
      return NextResponse.json(result);
    }

    if (action === "review_payment") {
      const result = await reviewInstaPayPayment(paymentId, status, reviewNotes, actorId);
      return NextResponse.json(result);
    }

    if (action === "update_order_status") {
      const result = await updateOrderStatus(orderId, status, note, actorId);
      return NextResponse.json(result);
    }

    if (action === "update_vendor_order_status") {
      const result = await updateVendorOrderStatus(vendorOrderId, status, rejectionReason, actorId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin API POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
