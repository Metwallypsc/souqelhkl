import prisma from "@/lib/prisma";

export default async function AdminSettingsPage() {
  // In future, store settings in DB; for now show placeholders
  return (
    <div>
      <h1 className="text-2xl font-black mb-4">إعدادات الموقع</h1>
      <div className="rounded-md border border-field-100 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-bold">اسم الموقع</label>
          <div className="mt-2 text-sm text-gray-600">سوق الحقل</div>
        </div>

        <div>
          <label className="text-sm font-bold">شحن افتراضي (جنيه)</label>
          <div className="mt-2 text-sm text-gray-600">100</div>
        </div>

        <div>
          <label className="text-sm font-bold">مفتاح NEXTAUTH_SECRET</label>
          <div className="mt-2 text-sm text-gray-600">احفظ هذا في متغيرات البيئة على Vercel</div>
        </div>
      </div>
    </div>
  );
}
