
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  quantity: number;
}

export interface DiscountCode {
  code: string;
  percentage: number;
  isUsed: boolean;
  reason?: string;
}

export interface CustomerDetails {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedDiscountCode: string | null;
  createdAt: Date;
  customerDetails: CustomerDetails;
}

export interface AdminStats {
  itemCount: number;
  totalAmount: number;
  discountCodes: DiscountCode[];
  totalDiscountAmount: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedDiscountCode: string | null;
}
