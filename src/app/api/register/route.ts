import { NextResponse } from "next/server";
import { registerCustomerSchema } from "@/lib/registration";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = registerCustomerSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "راجع البيانات المطلوبة",
        errors: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const normalizedPhone = data.phone.trim();
  const normalizedEmail = data.email?.trim().toLowerCase() || null;

  // check duplicates in DB
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ phone: normalizedPhone }, ...(normalizedEmail ? [{ email: normalizedEmail }] : [])]
    }
  });

  if (existing) {
    return NextResponse.json({ ok: false, message: existing.phone === normalizedPhone ? "رقم الموبايل مسجل بالفعل" : "البريد الإلكتروني مسجل بالفعل" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        passwordHash
      }
    });

    await prisma.customerProfile.create({
      data: {
        userId: user.id,
        governorate: data.governorate.trim(),
        city: data.city.trim(),
        addressLine: data.addressLine.trim(),
        googleMapsLink: data.googleMapsLink?.trim() || null,
        notes: data.notes?.trim() || null
      }
    });

    return NextResponse.json({ ok: true, message: "تم إنشاء الحساب بنجاح", customer: { id: user.id, name: user.name, phone: user.phone } }, { status: 201 });
  } catch (error) {
    console.error('register error', error);
    return NextResponse.json({ ok: false, message: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 });
  }
}
