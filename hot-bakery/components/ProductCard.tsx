"use client";
import { Product } from "types";
import { useCart } from "hooks/useCart";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="border p-4">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} ₽</p>
      <button onClick={() => addToCart(product)}>В корзину</button>
    </div>
  );
}