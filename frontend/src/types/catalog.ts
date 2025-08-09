export type ProductType = "Apparel" | "Electronics" | "Food";

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  images: string[];
  variants: ProductVariant[];
  addOns?: AddOn[]; // Optional, only for Food items
  basePrice: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  selectedAddOns: string[];
  quantity: number;
}
