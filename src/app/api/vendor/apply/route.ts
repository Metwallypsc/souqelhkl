import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { vendorApplicationSchema } from "@/lib/vendor-application";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = vendorApplicationSchema.safeParse(payload);

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

  if (Number(data.captchaAnswer) !== Number((payload as any).captchaTotal)) {
    return NextResponse.json(
      {
        ok: false,
        message: "رمز التحقق غير صحيح",
        errors: { captchaAnswer: ["رمز التحقق غير صحيح"] }
      },
      { status: 400 }
    );
  }

  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedPhone = data.phone.trim();
  const normalizedUsername = data.username.trim();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: normalizedPhone },
        { email: normalizedEmail },
        { username: normalizedUsername }
      ]
    }
  });

  if (existingUser) {
    const message = existingUser.phone === normalizedPhone ? "رقم الهاتف مسجل بالفعل" : existingUser.email === normalizedEmail ? "البريد الإلكتروني مسجل بالفعل" : "اسم المستخدم مسجل بالفعل";
    return NextResponse.json(
      {
        ok: false,
        message
      },
      { status: 409 }
    );
  }

  const existingApplication = await prisma.vendorApplication.findFirst({
    where: {
      OR: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
        { username: normalizedUsername }
      ]
    }
  });

  if (existingApplication) {
    return NextResponse.json(
      {
        ok: false,
        message: "يوجد طلب سابق بنفس البيانات. يرجى مراجعة الإدارة أو استخدام بيانات مختلفة."
      },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        passwordHash,
        role: "CUSTOMER"
      }
    });

    await prisma.vendorApplication.create({
      data: {
        userId: user.id,
        companyName: data.companyName.trim(),
        taxNumber: data.taxNumber.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        description: data.description.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        country: data.country.trim(),
        governorate: data.governorate.trim(),
        username: normalizedUsername,
        passwordHash,
        taxCardImageDataUrl: data.taxCardImageDataUrl?.trim() || null,
        status: "PENDING"
      }
    });

    return NextResponse.json({ ok: true, message: "تم إرسال طلب الانضمام بنجاح. ستتم مراجعة حسابك من الإدارة." }, { status: 201 });
  } catch (error) {
    console.error("vendor application error", error);
    return NextResponse.json({ ok: false, message: "حدث خطأ أثناء إرسال الطلب" }, { status: 500 });
  }
}
