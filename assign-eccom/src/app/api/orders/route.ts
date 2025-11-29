import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (orderId) {
    const order = store.getOrderById(orderId);
    if (order) {
      return NextResponse.json(order);
    }
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }

  const orders = store.getOrders();
  return NextResponse.json(orders);
}
