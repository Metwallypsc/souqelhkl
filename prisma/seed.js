const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Running seed...');

  // create demo user
  const password = 'demo12345';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { phone: '01110000001' },
    update: {},
    create: {
      name: 'بائع تجريبي',
      phone: '01110000001',
      email: 'vendor@example.com',
      passwordHash
    }
  });

  console.log('User id:', user.id, '(password:', password, ')');

  const vendor = await prisma.vendor.upsert({
    where: { slug: 'seed-vendor' },
    update: {},
    create: {
      name: 'مشتل تجريبي',
      slug: 'seed-vendor',
      phone: '01110000001',
      address: 'القاهرة',
      governorate: 'القاهرة',
      city: 'مدينة نصر'
    }
  });

  const vendorUser = await prisma.vendorUser.upsert({
    where: { userId: user.id },
    update: { vendorId: vendor.id },
    create: { userId: user.id, vendorId: vendor.id }
  });

  console.log('Vendor created:', vendor.id);

  // create sample products
  const productsData = [
    { slug: 'seed-organic-soil', nameAr: 'تربة عضوية (seed)', nameEn: 'Seed Soil', description: 'تربة مبدئية' },
    { slug: 'seed-tomato', nameAr: 'بذور طماطم (seed)', nameEn: 'Seed Tomato', description: 'بذور' }
  ];

  // ensure seeds category exists
  const seedsCategory = await prisma.category.upsert({
    where: { slug: 'seeds' },
    update: {},
    create: {
      nameAr: 'بذور',
      nameEn: 'Seeds',
      slug: 'seeds'
    }
  });

  const products = [];
  for (const p of productsData) {
    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        categoryId: seedsCategory.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        slug: p.slug,
        description: p.description
      }
    });
    products.push(prod);
  }

  // create listings for vendor
  for (const prod of products) {
    await prisma.listing.upsert({
      where: { id: prod.slug + '_listing' },
      update: {},
      create: {
        id: prod.slug + '_listing',
        productId: prod.id,
        vendorId: vendor.id,
        unitNameAr: 'وحدة',
        unitNameEn: 'unit',
        priceEgp: 99.0,
        stockQuantity: 20,
        weightGrams: 1000,
        availabilityStatus: 'AVAILABLE'
      }
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
