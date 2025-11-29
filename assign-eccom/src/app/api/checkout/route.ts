import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { z } from 'zod';
import { CustomerDetails } from '@/lib/types';


const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  zip: z.string().min(4, { message: "Zip code must be at least 4 characters." }),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits."),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format."),
  cardCvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits."),
});

export async function POST(req: Request) {
  try {
    const customerDetails: CustomerDetails = await req.json();
    checkoutSchema.parse(customerDetails);

    const result = store.createOrder(customerDetails);
    
    return NextResponse.json(result);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during checkout.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
