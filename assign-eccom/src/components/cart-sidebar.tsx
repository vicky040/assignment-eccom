
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Loader2, Tag, X, ShoppingBag } from 'lucide-react';

export function CartSidebar() {
  const { cart, isLoading, removeFromCart, isCartOpen, setCartOpen, applyDiscount, removeDiscount } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    applyDiscount(discountCode);
    setDiscountCode('');
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button onClick={() => setCartOpen(false)} variant="outline">Continue Shopping</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-5 py-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                       <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.imageHint}/>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                       <p className="font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-6 space-y-4">
               <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                {cart.appliedDiscountCode && (
                   <div className="flex justify-between text-green-500 font-medium">
                    <span>Discount ({cart.appliedDiscountCode})</span>
                    <span>-${cart.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                 <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              {!cart.appliedDiscountCode ? (
                <div className="flex gap-2">
                    <Input 
                      placeholder="Discount code" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    />
                    <Button onClick={handleApplyDiscount} className="whitespace-nowrap">Apply</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm bg-muted p-2 rounded-md">
                    <div className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                        <Tag className="h-4 w-4" />
                        <span>Code "{cart.appliedDiscountCode}" applied!</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={removeDiscount}>
                        <X className="h-4 w-4" />
                         <span className="sr-only">Remove discount</span>
                    </Button>
                </div>
              )}

              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" onClick={() => setCartOpen(false)}>
                 <Link href="/checkout">
                    Proceed to Checkout
                 </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
