import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST() {
  try {
    const cart = store.clearCart();
    return NextResponse.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not clear cart.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
