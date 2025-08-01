"use client";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { cart } = useCart();

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>
          <h3>{item.product.name}</h3>
          <p>{item.quantity} × {item.product.price} ₽</p>
        </div>
      ))}
    </div>
  );
}