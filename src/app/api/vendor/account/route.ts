import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { vendorAccountSchema } from "@/lib/vendor-account";

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: "غير مسجل الدخول" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const vendor = await prisma.vendorUser.findUnique({
    where: { userId: session.user.id },
    include: { vendor: true }
  });

  if (!user || !vendor) {
    return NextResponse.json({ ok: false, message: "ليس لديك حساب بائع" }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
    },
    vendor: {
      storeName: vendor.vendor.storeName,
      name: vendor.vendor.name,
      phone: vendor.vendor.phone,
      address: vendor.vendor.address,
      city: vendor.vendor.city,
      governorate: vendor.vendor.governorate,
      logoUrl: vendor.vendor.logoUrl,
    }
  });
}

export async function PUT(request: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: "غير مسجل الدخول" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = vendorAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "راجع البيانات المدخلة",
        errors: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const vendorUser = await prisma.vendorUser.findUnique({ where: { userId: session.user.id }, include: { vendor: true } });
  if (!vendorUser) {
    return NextResponse.json({ ok: false, message: "ليس لديك حساب بائع" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ ok: false, message: "المستخدم غير موجود" }, { status: 404 });
  }

  if (data.newPassword) {
    const isMatch = await bcrypt.compare(data.currentPassword || "", user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ ok: false, message: "كلمة المرور الحالية غير صحيحة", errors: { currentPassword: ["كلمة المرور الحالية غير صحيحة"] } }, { status: 400 });
    }
  }

  const duplicatePhone = await prisma.user.findFirst({
    where: {
      phone: data.phone,
      NOT: { id: user.id }
    }
  });

  if (duplicatePhone) {
    return NextResponse.json({ ok: false, message: "رقم الهاتف مسجل بالفعل", errors: { phone: ["رقم الهاتف مسجل بالفعل"] } }, { status: 409 });
  }

  const nextUserData: any = {
    name: data.name,
    phone: data.phone,
  };

  if (data.newPassword) {
    nextUserData.passwordHash = await bcrypt.hash(data.newPassword, 10);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: nextUserData
  });

  await prisma.vendor.update({
    where: { id: vendorUser.vendorId },
    data: {
      storeName: data.storeName,
      name: data.storeName,
      phone: data.phone,
      address: data.address,
      governorate: data.governorate,
      city: data.city,
      logoUrl: data.logoUrl || null,
    }
  });

  return NextResponse.json({ ok: true, message: "تم حفظ بيانات الحساب بنجاح", vendor: { phone: data.phone, storeName: data.storeName } });
}
