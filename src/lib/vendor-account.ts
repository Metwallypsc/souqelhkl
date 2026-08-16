import { z } from "zod";

export const vendorAccountSchema = z.object({
  name: z.string().trim().min(2, "الاسم الكامل مطلوب"),
  storeName: z.string().trim().min(2, "اسم المتجر مطلوب"),
  address: z.string().trim().min(5, "العنوان مطلوب"),
  city: z.string().trim().min(2, "المدينة مطلوبة"),
  governorate: z.string().trim().min(2, "المحافظة مطلوبة"),
  phone: z.string().trim().regex(/^01[0-2,5][0-9]{8}$/, "اكتب رقم موبايل مصري صحيح"),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  currentPassword: z.string().optional().or(z.literal("")),
  newPassword: z.string().min(8, "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف").optional().or(z.literal("")),
  confirmPassword: z.string().min(8, "أكد كلمة المرور الجديدة").optional().or(z.literal(""))
}).refine((data) => {
  if (!data.newPassword && !data.confirmPassword) return true;
  return data.newPassword === data.confirmPassword;
}, {
  message: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
  path: ["confirmPassword"]
}).refine((data) => {
  if (!data.newPassword) return true;
  return data.currentPassword && data.currentPassword.length >= 8;
}, {
  message: "أدخل كلمة المرور الحالية لتغيير كلمة المرور",
  path: ["currentPassword"]
});

export type VendorAccountInput = z.infer<typeof vendorAccountSchema>;
