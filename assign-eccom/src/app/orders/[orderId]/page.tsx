import { OrderDetails } from "@/components/order-details";

// This is now a Server Component. It can safely access params.
export default async function OrderThankYouPage({ params }: { params: { orderId: string } }) {
  const { orderId } = await params;

  // We pass the orderId string as a prop to the client component.
  // This completely avoids the issue with promise-like params on the client.
  return <OrderDetails orderId={orderId} />;
}
