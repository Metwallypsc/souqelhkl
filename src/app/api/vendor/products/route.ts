import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });

  // find vendor user
  const vendorUser = await prisma.vendorUser.findUnique({ where: { userId: session.user.id } });
  if (!vendorUser) return NextResponse.json({ ok: false, message: "User is not a vendor" }, { status: 403 });

  const listings = await prisma.listing.findMany({ where: { vendorId: vendorUser.vendorId }, orderBy: { createdAt: "desc" } });

  return NextResponse.json({ ok: true, listings });
}

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });

  const vendorUser = await prisma.vendorUser.findUnique({ where: { userId: session.user.id } });
  if (!vendorUser) return NextResponse.json({ ok: false, message: "User is not a vendor" }, { status: 403 });

  const body = await request.json();
  const {
    productId,
    unitNameAr,
    unitNameEn,
    priceEgp,
    stockQuantity,
    weightGrams,
    availabilityStatus
  } = body;

  if (!productId || !unitNameAr || priceEgp == null) {
    return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 });
  }

  try {
    const created = await prisma.listing.create({
      data: {
        productId,
        vendorId: vendorUser.vendorId,
        unitNameAr,
        unitNameEn: unitNameEn ?? null,
        priceEgp: Number(priceEgp),
        stockQuantity: Number(stockQuantity ?? 0),
        weightGrams: Number(weightGrams ?? 0),
        availabilityStatus: availabilityStatus ?? "AVAILABLE"
      }
    });

    return NextResponse.json({ ok: true, listing: created }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Could not create listing" }, { status: 500 });
  }
}
