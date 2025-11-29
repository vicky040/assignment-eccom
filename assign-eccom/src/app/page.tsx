
'use client';
import { ProductCard } from '@/components/product-card';
import { store } from '@/lib/store';
import { Product } from '@/lib/types';

export default function Home() {
  // Products are now fetched from the in-memory store, which is fine for this setup.
  // If products were dynamic, we would fetch them from an API endpoint.
  const products: Product[] = store.getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
