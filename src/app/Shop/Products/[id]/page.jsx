import ProductClient from '@/components/shop/Product';
import { getProduct } from '@/utils/shop/productService'; // Server-side data fetching

export default async function ProductPage({ params }) {
  // Await params before accessing id
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Fetch product on the server
  const product = await getProduct(id);
  
  // Pass data to client component
  return <ProductClient initialProduct={product} />;
}