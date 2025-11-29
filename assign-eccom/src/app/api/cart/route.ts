import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { z } from 'zod';

const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
});

const removeFromCartSchema = z.object({
  productId: z.string(),
});

export async function GET() {
  const cart = store.getCart();
  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity } = addToCartSchema.parse(body);
    const cart = store.addToCart(productId, quantity);
    return NextResponse.json(cart);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Could not add item to cart.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const productId = searchParams.get('productId')
        if (!productId) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }
        const cart = store.removeFromCart(productId);
        return NextResponse.json(cart);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not remove item from cart.';
        return NextResponse.json({ message }, { status: 400 });
    }
}
