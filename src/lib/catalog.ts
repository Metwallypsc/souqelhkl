export type Category = {
  nameAr: string;
  nameEn: string;
  slug: string;
  description: string;
};

export type Product = {
  nameAr: string;
  nameEn: string;
  slug: string;
  categorySlug: string;
  seller: string;
  unit: string;
  priceEgp: number;
  weightKg: number;
  stockQuantity: number;
  available: boolean;
  description: string;
  options: string[];
};

export const categories: Category[] = [
  {
    nameAr: "بذور",
    nameEn: "Seeds",
    slug: "seeds",
    description: "بذور خضروات، فواكه، أعشاب، وزهور مناسبة للزراعة المنزلية."
  },
  {
    nameAr: "شتلات ونباتات",
    nameEn: "Plants and Seedlings",
    slug: "plants-seedlings",
    description: "شتلات جاهزة ونباتات منزلية وخارجية من بائعين مختلفين."
  },
  {
    nameAr: "تربة ومحسنات",
    nameEn: "Soil and Amendments",
    slug: "soil-amendments",
    description: "تربة زراعية، بيتموس، كومبوست، ومحسنات تربة."
  },
  {
    nameAr: "أسمدة",
    nameEn: "Fertilizers",
    slug: "fertilizers",
    description: "أسمدة عضوية ومغذيات نبات قابلة للمراجعة قبل النشر."
  },
  {
    nameAr: "أدوات زراعية",
    nameEn: "Gardening Tools",
    slug: "gardening-tools",
    description: "مقصات، جاروف، رشاشات، وقفازات وكل أدوات العناية اليومية."
  },
  {
    nameAr: "أنظمة ري",
    nameEn: "Irrigation",
    slug: "irrigation",
    description: "خراطيم، وصلات، رشاشات، وحلول ري صغيرة للمنزل والبلكونة."
  },
  {
    nameAr: "أصص وأحواض",
    nameEn: "Pots and Planters",
    slug: "pots-planters",
    description: "أصص، أحواض زرع، وحوامل للنباتات بأحجام مختلفة."
  },
  {
    nameAr: "مستلزمات حدائق",
    nameEn: "Garden Supplies",
    slug: "garden-supplies",
    description: "مستلزمات مساعدة للعناية بالحدائق والزراعة المنزلية."
  }
];

export const products: Product[] = [
  {
    nameAr: "تربة زراعية عضوية",
    nameEn: "Organic potting soil",
    slug: "organic-potting-soil",
    categorySlug: "soil-amendments",
    seller: "مشتل القاهرة",
    unit: "كيس 10 كيلو",
    priceEgp: 120,
    weightKg: 10,
    stockQuantity: 42,
    available: true,
    description: "خلطة تربة عضوية مناسبة للزراعة المنزلية، الأصص، وأحواض البلكونة.",
    options: ["10 كيلو", "20 كيلو", "إضافة كومبوست"]
  },
  {
    nameAr: "بذور طماطم منزلية",
    nameEn: "Home tomato seeds",
    slug: "home-tomato-seeds",
    categorySlug: "seeds",
    seller: "جنة البذور",
    unit: "عبوة 50 بذرة",
    priceEgp: 45,
    weightKg: 0.05,
    stockQuantity: 160,
    available: true,
    description: "بذور طماطم مناسبة للمبتدئين ويمكن زراعتها في أصيص متوسط الحجم.",
    options: ["50 بذرة", "100 بذرة"]
  },
  {
    nameAr: "مقص تقليم يدوي",
    nameEn: "Hand pruning shear",
    slug: "hand-pruning-shear",
    categorySlug: "gardening-tools",
    seller: "أدوات الحديقة",
    unit: "قطعة",
    priceEgp: 180,
    weightKg: 0.35,
    stockQuantity: 0,
    available: false,
    description: "مقص تقليم يدوي للعناية بالنباتات المنزلية والشتلات الصغيرة.",
    options: ["مقاس عادي"]
  },
  {
    nameAr: "خرطوم ري مرن",
    nameEn: "Flexible garden hose",
    slug: "flexible-garden-hose",
    categorySlug: "irrigation",
    seller: "ري تك",
    unit: "لفة 15 متر",
    priceEgp: 260,
    weightKg: 2.2,
    stockQuantity: 18,
    available: true,
    description: "خرطوم ري مرن مع وصلات مناسبة لاستخدامات الحدائق الصغيرة والبلكونات.",
    options: ["15 متر", "30 متر"]
  },
  {
    nameAr: "أصيص بلاستيك كبير",
    nameEn: "Large plastic planter",
    slug: "large-plastic-planter",
    categorySlug: "pots-planters",
    seller: "بيت الزرع",
    unit: "قطعة",
    priceEgp: 95,
    weightKg: 1.1,
    stockQuantity: 75,
    available: true,
    description: "أصيص خفيف ومناسب للشتلات المتوسطة والنباتات المنزلية.",
    options: ["أخضر", "أسود", "بني"]
  },
  {
    nameAr: "كومبوست عضوي",
    nameEn: "Organic compost",
    slug: "organic-compost",
    categorySlug: "fertilizers",
    seller: "مزارع النيل",
    unit: "كيس 5 كيلو",
    priceEgp: 80,
    weightKg: 5,
    stockQuantity: 33,
    available: true,
    description: "كومبوست عضوي لتحسين التربة وتغذية النباتات بشكل تدريجي.",
    options: ["5 كيلو", "10 كيلو"]
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function calculateShippingFee(totalWeightKg: number) {
  if (totalWeightKg <= 10) {
    return 100;
  }

  const extraWeight = totalWeightKg - 10;
  const extraBlocks = Math.ceil(extraWeight / 10);
  return 100 + extraBlocks * 25;
}
