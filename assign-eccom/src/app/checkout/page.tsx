
import { CheckoutForm } from "@/components/checkout-form";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <ShoppingBag className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>
      <CheckoutForm />
    </div>
  )
}
