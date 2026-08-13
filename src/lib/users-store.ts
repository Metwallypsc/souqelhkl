import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import type { RegisterCustomerInput } from "@/lib/registration";

export type StoredCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  passwordHash: string;
  role: "CUSTOMER";
  address: {
    governorate: string;
    city: string;
    addressLine: string;
    googleMapsLink: string | null;
    notes: string | null;
  };
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "customers.json");

async function readCustomers() {
  try {
    const content = await readFile(usersFile, "utf8");
    return JSON.parse(content) as StoredCustomer[];
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeCustomers(customers: StoredCustomer[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(usersFile, `${JSON.stringify(customers, null, 2)}\n`, "utf8");
}

export async function createCustomer(input: RegisterCustomerInput) {
  const customers = await readCustomers();
  const normalizedPhone = input.phone.trim();
  const normalizedEmail = input.email?.trim().toLowerCase() || null;

  const duplicate = customers.find(
    (customer) => customer.phone === normalizedPhone || (normalizedEmail && customer.email === normalizedEmail)
  );

  if (duplicate) {
    return {
      ok: false as const,
      message: duplicate.phone === normalizedPhone ? "رقم الموبايل مسجل بالفعل" : "البريد الإلكتروني مسجل بالفعل"
    };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const customer: StoredCustomer = {
    id: `cus_${crypto.randomUUID()}`,
    name: input.name.trim(),
    phone: normalizedPhone,
    email: normalizedEmail,
    passwordHash,
    role: "CUSTOMER",
    address: {
      governorate: input.governorate.trim(),
      city: input.city.trim(),
      addressLine: input.addressLine.trim(),
      googleMapsLink: input.googleMapsLink?.trim() || null,
      notes: input.notes?.trim() || null
    },
    createdAt: new Date().toISOString()
  };

  await writeCustomers([...customers, customer]);

  return {
    ok: true as const,
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone
    }
  };
}
