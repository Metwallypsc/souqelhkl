import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface AuditLogInput {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: any;
  after?: any;
}

export async function createAuditLog(input: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId || null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId || null,
        before: input.before || undefined,
        after: input.after || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function updateProductApprovalStatus(
  productId: string,
  status: "APPROVED" | "REJECTED",
  actorId?: string
) {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      status: status === "APPROVED" ? "APPROVED" : "REJECTED",
      isHidden: status === "REJECTED" ? true : existing.isHidden,
    },
  });

  await createAuditLog({
    actorId,
    action: `PRODUCT_${status}`,
    entity: "Product",
    entityId: productId,
    before: { status: existing.status },
    after: { status: updated.status },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products/${updated.slug}`);
  return { success: true, product: updated };
}

export async function reviewInstaPayPayment(
  paymentId: string,
  status: "APPROVED" | "REJECTED",
  reviewNotes?: string,
  actorId?: string
) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: { include: { vendorOrders: true } } },
  });

  if (!payment) {
    throw new Error("Payment record not found");
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: status === "APPROVED" ? "APPROVED" : "REJECTED",
      reviewedById: actorId || null,
      reviewNotes: reviewNotes || null,
    },
  });

  // If approved, update order status to UNDER_REVIEW or AWAITING_VENDOR_CONFIRMATION
  let newOrderStatus = payment.order.status;
  if (status === "APPROVED") {
    newOrderStatus = "AWAITING_VENDOR_CONFIRMATION";
  } else if (status === "REJECTED") {
    newOrderStatus = "CANCELLED";
  }

  const updatedOrder = await prisma.order.update({
    where: { id: payment.orderId },
    data: {
      status: newOrderStatus,
      statusHistory: {
        create: {
          status: newOrderStatus,
          note: `Payment ${status.toLowerCase()} by admin. ${reviewNotes || ""}`,
          createdBy: actorId,
        },
      },
    },
  });

  await createAuditLog({
    actorId,
    action: `PAYMENT_${status}`,
    entity: "Payment",
    entityId: paymentId,
    before: { status: payment.status, orderStatus: payment.order.status },
    after: { status: updatedPayment.status, orderStatus: updatedOrder.status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${payment.orderId}`);
  return { success: true, payment: updatedPayment, order: updatedOrder };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: any,
  note?: string,
  actorId?: string
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      completedAt: newStatus === "COMPLETED" ? new Date() : order.completedAt,
      statusHistory: {
        create: {
          status: newStatus,
          note: note || `Status updated to ${newStatus} by admin`,
          createdBy: actorId,
        },
      },
    },
  });

  await createAuditLog({
    actorId,
    action: `ORDER_STATUS_UPDATE_${newStatus}`,
    entity: "Order",
    entityId: orderId,
    before: { status: order.status },
    after: { status: updated.status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, order: updated };
}

export async function updateVendorOrderStatus(
  vendorOrderId: string,
  newStatus: any,
  rejectionReason?: string,
  actorId?: string
) {
  const vOrder = await prisma.vendorOrder.findUnique({
    where: { id: vendorOrderId },
  });

  if (!vOrder) {
    throw new Error("Vendor sub-order not found");
  }

  const updated = await prisma.vendorOrder.update({
    where: { id: vendorOrderId },
    data: {
      status: newStatus,
      rejectionReason: rejectionReason || null,
    },
  });

  await createAuditLog({
    actorId,
    action: `VENDOR_ORDER_STATUS_${newStatus}`,
    entity: "VendorOrder",
    entityId: vendorOrderId,
    before: { status: vOrder.status },
    after: { status: updated.status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${vOrder.orderId}`);
  return { success: true, vendorOrder: updated };
}
