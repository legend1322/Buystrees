'use client';
import dynamic from "next/dynamic";

const Cart = dynamic(() => import("@/components/shop/cart"), { ssr: false });

export default function CartPage() {


  return (
    <div className="min-h-screen" >
      {/* Render CartClient component */}
      <Cart />

    </div>
  );
}
