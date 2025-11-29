'use client';

import Link from 'next/link';
import { ShoppingBag, Crown, LayoutGrid, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { cart, setCartOpen } = useCart();
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <LayoutGrid className="text-accent" />
            <h1>CouponCart</h1>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex gap-2">
                 <Button variant="ghost" asChild>
                    <Link href="/orders">My Orders</Link>
                </Button>
            </nav>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Crown />
                        <span className="sr-only">Admin</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="relative">
              <Button variant="outline" size="icon" onClick={() => setCartOpen(true)}>
                <ShoppingBag />
                <span className="sr-only">Open Cart</span>
              </Button>
              {itemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-accent text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
