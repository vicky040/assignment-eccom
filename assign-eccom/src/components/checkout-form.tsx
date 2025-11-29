
'use client';

import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Loader2, CreditCard } from 'lucide-react';
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  zip: z.string().min(4, { message: "Zip code must be at least 4 characters." }),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits."),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format."),
  cardCvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits."),
});

type CustomerDetails = z.infer<typeof formSchema>;


export function CheckoutForm() {
  const { cart, checkout, isCheckingOut } = useCart();
  
  const form = useForm<CustomerDetails>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: ""
    },
  });

  const onSubmit: SubmitHandler<CustomerDetails> = async (data) => {
    await checkout(data);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Your cart is empty. Add some products to checkout.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                  <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Anytown" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                  </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="•••• •••• •••• ••••" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="cardExpiry"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="cardCvc"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full mt-6" size="lg" disabled={isCheckingOut}>
                    {isCheckingOut ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                         <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Place Order
                         </>
                    )}
                </Button>
            </form>
        </Form>
      </div>
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {cart.items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.imageHint}/>
                    </div>
                    <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                    </p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                {cart.appliedDiscountCode && (
                <div className="flex justify-between text-green-500">
                    <span>Discount ({cart.appliedDiscountCode})</span>
                    <span>-${cart.discountAmount.toFixed(2)}</span>
                </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
