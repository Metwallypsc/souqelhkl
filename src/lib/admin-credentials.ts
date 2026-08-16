import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const DEFAULT_SYSADMIN_USERNAME = "sysadmin";
export const DEFAULT_SYSADMIN_EMAIL = "sysadmin@souqelhakl.local";
export const DEFAULT_SYSADMIN_PHONE = "+966500000000";
export const DEFAULT_SYSADMIN_PASSWORD = "SysAdmin@2026!";

export function getSystemAdminPassword() {
  return (process.env.ADMIN_MASTER_PASSWORD || "").trim() || DEFAULT_SYSADMIN_PASSWORD;
}

export async function ensureSystemAdmin() {
  const masterPassword = getSystemAdminPassword();
  const username = (process.env.ADMIN_USERNAME || DEFAULT_SYSADMIN_USERNAME).trim();
  const email = (process.env.ADMIN_EMAIL || DEFAULT_SYSADMIN_EMAIL).trim();
  const phone = (process.env.ADMIN_PHONE || DEFAULT_SYSADMIN_PHONE).trim();

  let adminUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }, { phone }],
    },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        name: "System Administrator",
        username,
        email,
        phone,
        passwordHash: await bcrypt.hash(masterPassword, 10),
        role: "ADMIN",
        isActive: true,
      },
    });
    return adminUser;
  }

  const updatePayload: Record<string, string | boolean | undefined> = {};

  if (adminUser.role !== "ADMIN") {
    updatePayload.role = "ADMIN";
  }
  if (!adminUser.username) updatePayload.username = username;
  if (!adminUser.email) updatePayload.email = email;
  if (!adminUser.phone) updatePayload.phone = phone;
  if (Object.keys(updatePayload).length > 0) {
    adminUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: updatePayload as any,
    });
  }

  return adminUser;
}

export async function updateAdminPassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("المستخدم غير موجود");
  }

  const matchesCurrent = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matchesCurrent) {
    throw new Error("كلمة المرور الحالية غير صحيحة");
  }

  if (newPassword.length < 8) {
    throw new Error("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: await bcrypt.hash(newPassword, 10),
    },
  });

  return true;
}
