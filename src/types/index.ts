export type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
};

export type BasketItem = {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
};