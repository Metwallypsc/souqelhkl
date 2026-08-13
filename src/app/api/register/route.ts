import { NextResponse } from "next/server";
import { registerCustomerSchema } from "@/lib/registration";
import { createCustomer } from "@/lib/users-store";

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

  const result = await createCustomer(parsed.data);

  if (!result.ok) {
    return NextResponse.json(result, { status: 409 });
  }

  return NextResponse.json(
    {
      ok: true,
      message: "تم إنشاء الحساب بنجاح",
      customer: result.customer
    },
    { status: 201 }
  );
}
