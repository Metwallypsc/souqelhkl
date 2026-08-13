import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });

  const vendorUser = await prisma.vendorUser.findUnique({ where: { userId: session.user.id } });
  if (!vendorUser) return NextResponse.json({ ok: false, message: "User is not a vendor" }, { status: 403 });

  const id = params.id;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.vendorId !== vendorUser.vendorId) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, listing });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });

  const vendorUser = await prisma.vendorUser.findUnique({ where: { userId: session.user.id } });
  if (!vendorUser) return NextResponse.json({ ok: false, message: "User is not a vendor" }, { status: 403 });

  const id = params.id;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.vendorId !== vendorUser.vendorId) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

  const body = await request.json();
  const { unitNameAr, unitNameEn, priceEgp, stockQuantity, weightGrams, availabilityStatus } = body;

  try {
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        unitNameAr: unitNameAr ?? listing.unitNameAr,
        unitNameEn: unitNameEn ?? listing.unitNameEn,
        priceEgp: priceEgp != null ? Number(priceEgp) : listing.priceEgp,
        stockQuantity: stockQuantity != null ? Number(stockQuantity) : listing.stockQuantity,
        weightGrams: weightGrams != null ? Number(weightGrams) : listing.weightGrams,
        availabilityStatus: availabilityStatus ?? listing.availabilityStatus
      }
    });

    return NextResponse.json({ ok: true, listing: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Could not update listing" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });

  const vendorUser = await prisma.vendorUser.findUnique({ where: { userId: session.user.id } });
  if (!vendorUser) return NextResponse.json({ ok: false, message: "User is not a vendor" }, { status: 403 });

  const id = params.id;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.vendorId !== vendorUser.vendorId) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

  try {
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Could not delete listing" }, { status: 500 });
  }
}
