import { z } from "zod";

export const vendorApplicationSchema = z
  .object({
    companyName: z.string().trim().min(2, "اسم الشركة مطلوب"),
    taxNumber: z.string().trim().min(5, "الرقم الضريبي مطلوب"),
    firstName: z.string().trim().min(2, "الاسم الأول مطلوب"),
    lastName: z.string().trim().min(2, "اسم العائلة مطلوب"),
    email: z.string().trim().email("اكتب بريد إلكتروني صحيح"),
    phone: z.string().trim().regex(/^01[0-2,5][0-9]{8}$/, "اكتب رقم موبايل مصري صحيح"),
    description: z.string().trim().min(10, "اكتب وصفاً مختصراً عن الشركة"),
    address: z.string().trim().min(8, "اكتب العنوان الكامل"),
    city: z.string().trim().min(2, "اكتب المدينة"),
    country: z.string().trim().min(2, "اختر الدولة"),
    governorate: z.string().trim().min(2, "اختر المحافظة/الإمارة"),
    username: z.string().trim().min(4, "اسم المستخدم يجب ألا يقل عن 4 أحرف"),
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    confirmPassword: z.string().min(8, "أكد كلمة المرور"),
    captchaAnswer: z.string().trim().min(1, "أدخل رمز التحقق"),
    taxCardImageDataUrl: z.string().trim().optional().or(z.literal(""))
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيدها غير متطابقين",
    path: ["confirmPassword"]
  });

export type VendorApplicationInput = z.infer<typeof vendorApplicationSchema>;
