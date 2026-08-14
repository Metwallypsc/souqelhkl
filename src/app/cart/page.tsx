import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { calculateShippingFee, products } from "@/lib/catalog";

const cartItems = products.filter((product) => product.available).slice(0, 2);

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#182414]">
      <SiteHeader />
      {/* CartList is a client component that handles quantities and removal */}
      <CartList initialItems={cartItems} />
    </main>
  );
}

import CartList from "@/components/cart-list";