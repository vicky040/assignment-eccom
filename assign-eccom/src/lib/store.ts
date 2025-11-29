import { Product, CartItem, Order, DiscountCode, AdminStats, Cart, CustomerDetails } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { v4 as uuidv4 } from 'uuid';

const NTH_ORDER = 2; // Generate discount every 2nd order

// In-memory data stores
let products: Product[] = [];
let cart: Map<string, CartItem> = new Map();
let appliedDiscountCode: DiscountCode | null = null;
let orders: Order[] = [];
let discountCodes: DiscountCode[] = [{
    code: 'SAVE15',
    percentage: 15,
    isUsed: false,
}];

// Initialize products
if (products.length === 0) {
    products = PlaceHolderImages.map((img, index) => {
        const productNames = [
            "Quantum-Charged Mug",
            "Chrono-Shifting T-Shirt",
            "Aether-Infused Socks",
            "Zero-Gravity Pen",
            "Hyperspace Hoodie",
            "Singularity Smartwatch"
        ];
        const productDescriptions = [
            "A mug that keeps your coffee at the perfect temperature using quantum entanglement.",
            "This t-shirt subtly shifts its design based on the temporal flux. Never wear the same shirt twice.",
            "Infused with aether, these socks provide unparalleled comfort and a slight, pleasant hum.",
            "A pen that floats slightly above the desk, for when you need a little space to think.",
            "A comfortable hoodie that gives you the feeling of gazing into the vastness of space.",
            "A modern smartwatch that displays complex data with a touch of elegance and cosmic wonder."
        ];
        const prices = [42.00, 55.00, 25.00, 30.00, 95.00, 250.00];

        return {
            id: `prod_${index + 1}`,
            name: productNames[index],
            description: productDescriptions[index],
            price: prices[index],
            imageUrl: img.imageUrl,
            imageHint: img.imageHint,
        }
    });
}

function getCartState(): Cart {
    const items = Array.from(cart.values());
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discountAmount = 0;
    if (appliedDiscountCode) {
        discountAmount = subtotal * (appliedDiscountCode.percentage / 100);
    }
    const total = subtotal - discountAmount;
    return {
        items,
        subtotal,
        discountAmount,
        total,
        appliedDiscountCode: appliedDiscountCode?.code || null,
    };
}

class CouponCartStore {
    getProducts(): Product[] {
        return products;
    }

    getCart(): Cart {
        return getCartState();
    }

    addToCart(productId: string, quantity: number): Cart {
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (cart.has(productId)) {
            const existingItem = cart.get(productId)!;
            existingItem.quantity += quantity;
        } else {
            const newCartItem: CartItem = {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                imageHint: product.imageHint,
                quantity: quantity
            };
            cart.set(productId, newCartItem);
        }
        return getCartState();
    }
    
    removeFromCart(productId: string): Cart {
        const item = cart.get(productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.delete(productId);
            }
        } else {
            throw new Error('Item not in cart');
        }
        return getCartState();
    }

    clearCart(): Cart {
        cart.clear();
        appliedDiscountCode = null;
        return getCartState();
    }

    applyDiscount(code: string): Cart {
        const discount = discountCodes.find(d => d.code.toLowerCase() === code.toLowerCase() && !d.isUsed);
        if (!discount) {
            throw new Error('Invalid or used discount code.');
        }
        appliedDiscountCode = discount;
        return getCartState();
    }

    removeDiscount(): Cart {
        appliedDiscountCode = null;
        return getCartState();
    }

    createOrder(customerDetails: CustomerDetails): { order: Order; newDiscount?: DiscountCode } {
        const cartState = getCartState();
        if (cartState.items.length === 0) {
            throw new Error('Cannot create an order with an empty cart.');
        }

        const order: Order = {
            id: uuidv4(),
            items: cartState.items,
            subtotal: cartState.subtotal,
            discountAmount: cartState.discountAmount,
            total: cartState.total,
            appliedDiscountCode: cartState.appliedDiscountCode,
            createdAt: new Date(),
            customerDetails: customerDetails
        };

        orders.push(order);

        if (appliedDiscountCode) {
            const codeIndex = discountCodes.findIndex(d => d.code === appliedDiscountCode!.code);
            if (codeIndex !== -1) {
                discountCodes[codeIndex].isUsed = true;
            }
        }
        
        let newDiscount: DiscountCode | undefined;
        // The responsibility for clearing the cart is now moved to the client-side provider
        // this.clearCart() is removed from here.

        if (orders.length % NTH_ORDER === 0) {
            newDiscount = this.generateNthOrderDiscount(true);
        }
        
        return { order, newDiscount };
    }

    generateNthOrderDiscount(force: boolean = false): DiscountCode | null {
        if (!force && (orders.length === 0 || orders.length % NTH_ORDER !== 0)) {
            return null;
        }

        const newDiscount: DiscountCode = {
            code: `SAVE10-${uuidv4().substring(0, 8).toUpperCase()}`,
            percentage: 10,
            isUsed: false
        };
        discountCodes.push(newDiscount);
        return newDiscount;
    }

    getOrders(): Order[] {
        return [...orders].reverse();
    }

    getOrderById(orderId: string): Order | null {
        return orders.find(o => o.id === orderId) || null;
    }

    getAdminStats(): AdminStats {
        const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
        const itemCount = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const totalDiscountAmount = orders.reduce((sum, order) => sum + order.discountAmount, 0);

        return {
            itemCount,
            totalAmount,
            discountCodes: [...discountCodes].reverse(),
            totalDiscountAmount
        };
    }
}

export const store = new CouponCartStore();
