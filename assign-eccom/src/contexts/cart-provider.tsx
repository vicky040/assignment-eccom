
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Cart, CustomerDetails, Order } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCheckingOut: boolean;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
  checkout: (customerDetails: CustomerDetails) => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isCheckingOut, setCheckingOut] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not load cart.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Failed to add item');
      const updatedCart = await response.json();
      setCart(updatedCart);
      setCartOpen(true);
      toast({ title: 'Success', description: `Item added to cart.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not add item to cart.', variant: 'destructive' });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
       const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item');
      const updatedCart = await response.json();
      setCart(updatedCart);
      if (updatedCart.items.length === 0) {
        setCartOpen(false);
      }
      toast({ title: 'Success', description: 'Item updated in cart.' });
    } catch (error) {
       toast({ title: 'Error', description: 'Could not remove item from cart.', variant: 'destructive' });
    }
  };

  const applyDiscount = async (code: string) => {
    if (!code.trim()) {
        toast({ title: 'Info', description: 'Please enter a discount code.' });
        return;
    }
    try {
      const response = await fetch('/api/cart/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      setCart(result);
      toast({ title: 'Success', description: 'Discount code applied!' });
    } catch (error: any) {
       toast({ title: 'Error', description: error.message || 'Invalid discount code.', variant: 'destructive' });
    }
  };

  const removeDiscount = async () => {
    try {
      const response = await fetch('/api/cart/discount', {
        method: 'DELETE',
      });
       if (!response.ok) throw new Error('Could not remove discount');
      const updatedCart = await response.json();
      setCart(updatedCart);
      toast({ title: 'Success', description: 'Discount code removed.' });
    } catch (error) {
       toast({ title: 'Error', description: 'Could not remove discount.', variant: 'destructive' });
    }
  };

  const clearClientCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to clear cart');
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      toast({ title: 'Error', description: 'Could not clear cart.', variant: 'destructive' });
    }
  };

  const checkout = async (customerDetails: CustomerDetails) => {
    if (isCheckingOut) return;
    setCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerDetails),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Checkout failed');

      const order: Order = result.order;

      // Clear the cart on the client side after successful checkout
      await clearClientCart();
      setCartOpen(false);
      router.push(`/orders/${order.id}`);

      // Defer toast until after navigation to ensure it's visible.
      setTimeout(() => {
        let description = "Thank you for your order!";
        if (result.newDiscount) {
          description += ` You've earned a discount! Use code ${result.newDiscount.code} for ${result.newDiscount.percentage}% off your next order.`;
        }
        toast({ title: 'Checkout Successful!', description, duration: 9000 });
      }, 500);

    } catch (error: any) {
       toast({ title: 'Error', description: error.message || 'Checkout failed.', variant: 'destructive' });
    } finally {
        setCheckingOut(false);
    }
  };


  return (
    <CartContext.Provider
      value={{ cart, isLoading, isCheckingOut, addToCart, removeFromCart, isCartOpen, setCartOpen, applyDiscount, removeDiscount, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}
