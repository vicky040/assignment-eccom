import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { z } from 'zod';

const discountSchema = z.object({
  code: z.string().min(1, 'Discount code is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = discountSchema.parse(body);
    const cart = store.applyDiscount(code);
    return NextResponse.json(cart);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Invalid or used discount code.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    const cart = store.removeDiscount();
    return NextResponse.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not remove discount.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
