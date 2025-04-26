import SellerHeader from "@/components/Seller/SellerHeader";

export default function SellerLayout({ children }) {
  return (
    <div>
      {/* Seller-specific header */}
      <SellerHeader />
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
