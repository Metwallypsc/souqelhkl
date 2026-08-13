insert into "SystemSetting" ("key", "value", "updatedAt")
values
  ('platform_commission_rate', '{"rate": 0.01}', now()),
  ('shipping_rule', '{"baseFeeEgp": 100, "includedWeightKg": 10, "extraBlockKg": 10, "extraBlockFeeEgp": 25}', now()),
  ('service_area', '{"country": "EG", "governorate": "Cairo", "enabled": true}', now()),
  ('payments', '{"cashOnDelivery": true, "instapay": true, "instapayRequiresReview": true}', now())
on conflict ("key") do update set
  "value" = excluded."value",
  "updatedAt" = now();

insert into "Category" ("id", "nameAr", "nameEn", "slug", "sortOrder", "isActive", "createdAt", "updatedAt")
values
  ('cat_seeds', 'بذور', 'Seeds', 'seeds', 10, true, now(), now()),
  ('cat_plants_seedlings', 'شتلات ونباتات', 'Plants and Seedlings', 'plants-seedlings', 20, true, now(), now()),
  ('cat_soil_amendments', 'تربة ومحسنات', 'Soil and Amendments', 'soil-amendments', 30, true, now(), now()),
  ('cat_fertilizers', 'أسمدة', 'Fertilizers', 'fertilizers', 40, true, now(), now()),
  ('cat_gardening_tools', 'أدوات زراعية', 'Gardening Tools', 'gardening-tools', 50, true, now(), now()),
  ('cat_irrigation', 'أنظمة ري', 'Irrigation', 'irrigation', 60, true, now(), now()),
  ('cat_pots_planters', 'أصص وأحواض', 'Pots and Planters', 'pots-planters', 70, true, now(), now()),
  ('cat_garden_supplies', 'مستلزمات حدائق', 'Garden Supplies', 'garden-supplies', 80, true, now(), now())
on conflict ("slug") do update set
  "nameAr" = excluded."nameAr",
  "nameEn" = excluded."nameEn",
  "sortOrder" = excluded."sortOrder",
  "isActive" = excluded."isActive",
  "updatedAt" = now();
