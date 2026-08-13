# Souq El Hakl

Arabic-first multi-vendor agriculture marketplace for Egypt.

## Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `DATABASE_URL`, then run:

```bash
npm run prisma:migrate
npm run dev
```

## Initial Scope

- Customer registration and checkout
- Admin-created vendors
- Vendor dashboard
- Product approval workflow
- Multi-vendor cart with one shipment
- Cash on delivery and InstaPay review flow
- Configurable shipping rules and commission
