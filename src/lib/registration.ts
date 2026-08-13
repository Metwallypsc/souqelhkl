import { z } from "zod";

export const registerCustomerSchema = z
  .object({
    name: z.string().trim().min(2, "اكتب الاسم بالكامل"),
    phone: z
      .string()
      .trim()
      .regex(/^01[0-2,5][0-9]{8}$/, "اكتب رقم موبايل مصري صحيح"),
    email: z.string().trim().email("اكتب بريد إلكتروني صحيح").optional().or(z.literal("")),
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 حروف"),
    confirmPassword: z.string().min(8, "أكد كلمة المرور"),
    governorate: z.string().trim().min(2, "اكتب المحافظة"),
    city: z.string().trim().min(2, "اكتب المدينة أو المنطقة"),
    addressLine: z.string().trim().min(8, "اكتب العنوان بالتفصيل"),
    googleMapsLink: z.string().trim().url("لينك Google Maps غير صحيح").optional().or(z.literal("")),
    notes: z.string().trim().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيدها غير متطابقين",
    path: ["confirmPassword"]
  });

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
