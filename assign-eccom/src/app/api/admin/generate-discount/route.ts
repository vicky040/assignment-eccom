import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST() {
  try {
    const newDiscount = store.generateNthOrderDiscount();
    if (newDiscount) {
      return NextResponse.json(newDiscount);
    }
    return NextResponse.json({ message: 'Discount generation condition not met.' }, { status: 400 });
  } catch (error) {
    console.error('Error generating discount:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
