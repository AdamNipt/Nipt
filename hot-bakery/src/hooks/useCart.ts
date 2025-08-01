"use client";
import { supabase } from "lib/supabase";
import { BasketItem, Product } from "types";
import { useEffect, useState } from "react";

export function useCart() {
  const [cart, setCart] = useState<BasketItem[]>([]);

  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("basket")
      .select("*, product:products(*)")
      .eq("user_id", user.id);

    setCart(data || []);
  };

  const addToCart = async (product: Product) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Войдите в аккаунт!");

    await supabase
      .from("basket")
      .upsert({ user_id: user.id, product_id: product.id, quantity: 1 });
    fetchCart();
  };

  useEffect(() => { fetchCart(); }, []);

  return { cart, addToCart };
}