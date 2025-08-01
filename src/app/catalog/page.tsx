import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default async function CatalogPage() {
  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}