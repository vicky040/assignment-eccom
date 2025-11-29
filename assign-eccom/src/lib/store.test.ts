
import { store } from './store';
import { CustomerDetails, Product } from './types';

// Mock the placeholder images as they are external dependencies
jest.mock('./placeholder-images', () => ({
    PlaceHolderImages: [
        { id: 'prod_1', imageUrl: 'url1', imageHint: 'hint1' },
        { id: 'prod_2', imageUrl: 'url2', imageHint: 'hint2' },
        { id: 'prod_3', imageUrl: 'url3', imageHint: 'hint3' },
        { id: 'prod_4', imageUrl: 'url4', imageHint: 'hint4' },
        { id: 'prod_5', imageUrl: 'url5', imageHint: 'hint5' },
        { id: 'prod_6', imageUrl: 'url6', imageHint: 'hint6' },
    ],
}));

// Mock uuid to get predictable IDs
let mockUuidCount = 0;
jest.mock('uuid', () => ({
  v4: () => `mock-uuid-${++mockUuidCount}`,
}));


describe('CouponCartStore', () => {

    const mockCustomer: CustomerDetails = {
        name: 'Test User',
        email: 'test@example.com',
        address: '123 Test St',
        city: 'Testville',
        zip: '12345',
        cardNumber: '1111222233334444',
        cardExpiry: '12/25',
        cardCvc: '123',
    };
    
    beforeEach(() => {
        // Reset the store state before each test
        store._resetForTesting();
        mockUuidCount = 0;
    });

    describe('Products', () => {
        it('should return a list of products', () => {
            const products = store.getProducts();
            expect(products).toBeInstanceOf(Array);
            expect(products.length).toBe(6);
            expect(products[0]).toHaveProperty('id');
            expect(products[0]).toHaveProperty('name');
        });
    });

    describe('Cart', () => {
        it('should add an item to the cart', () => {
            const product = store.getProducts()[0];
            store.addToCart(product.id, 1);
            const cart = store.getCart();
            expect(cart.items.length).toBe(1);
            expect(cart.items[0].id).toBe(product.id);
            expect(cart.items[0].quantity).toBe(1);
        });

        it('should increase quantity if item is already in cart', () => {
            const product = store.getProducts()[0];
            store.addToCart(product.id, 1);
            store.addToCart(product.id, 2);
            const cart = store.getCart();
            expect(cart.items.length).toBe(1);
            expect(cart.items[0].quantity).toBe(3);
        });

        it('should remove an item from the cart', () => {
            const product = store.getProducts()[0];
            store.addToCart(product.id, 1);
            store.removeFromCart(product.id);
            const cart = store.getCart();
            expect(cart.items.length).toBe(0);
        });

        it('should decrease quantity if more than one item is in cart', () => {
            const product = store.getProducts()[0];
            store.addToCart(product.id, 3);
            store.removeFromCart(product.id);
            const cart = store.getCart();
            expect(cart.items.length).toBe(1);
            expect(cart.items[0].quantity).toBe(2);
        });

        it('should clear the cart', () => {
            store.addToCart(store.getProducts()[0].id, 1);
            store.addToCart(store.getProducts()[1].id, 1);
            store.clearCart();
            const cart = store.getCart();
            expect(cart.items.length).toBe(0);
            expect(cart.subtotal).toBe(0);
        });
    });

    describe('Discounts', () => {
        it('should apply a valid discount code', () => {
            store.addToCart(store.getProducts()[0].id, 1); // Price: 42.00
            store.applyDiscount('SAVE15');
            const cart = store.getCart();
            expect(cart.appliedDiscountCode).toBe('SAVE15');
            expect(cart.discountAmount).toBeCloseTo(42.00 * 0.15);
            expect(cart.total).toBeCloseTo(42.00 * 0.85);
        });

        it('should throw an error for an invalid discount code', () => {
            store.addToCart(store.getProducts()[0].id, 1);
            expect(() => store.applyDiscount('INVALID')).toThrow('Invalid or used discount code.');
        });

        it('should remove an applied discount', () => {
            store.addToCart(store.getProducts()[0].id, 1);
            store.applyDiscount('SAVE15');
            let cart = store.getCart();
            expect(cart.appliedDiscountCode).toBe('SAVE15');

            store.removeDiscount();
            cart = store.getCart();
            expect(cart.appliedDiscountCode).toBeNull();
            expect(cart.discountAmount).toBe(0);
            expect(cart.total).toBe(cart.subtotal);
        });

        it('should not generate a discount on the first order', () => {
             store.addToCart(store.getProducts()[0].id, 1);
             const { newDiscount } = store.createOrder(mockCustomer);
             expect(newDiscount).toBeUndefined();
        });

        it('should generate a discount for every Nth order (N=2)', () => {
            // First order
            store.addToCart(store.getProducts()[0].id, 1);
            store.createOrder(mockCustomer);
            store.clearCart();

            // Second order
            store.addToCart(store.getProducts()[1].id, 1);
            const { newDiscount } = store.createOrder(mockCustomer);
            
            expect(newDiscount).toBeDefined();
            expect(newDiscount?.percentage).toBe(10);
            expect(newDiscount?.code).toMatch(/SAVE10-.*/);

            // Check if it's in the main list
            const adminStats = store.getAdminStats();
            expect(adminStats.discountCodes.some(dc => dc.code === newDiscount!.code)).toBe(true);
        });
    });

    describe('Orders', () => {
        it('should create an order', () => {
            store.addToCart(store.getProducts()[0].id, 1);
            const { order } = store.createOrder(mockCustomer);

            expect(order.id).toBe('mock-uuid-1');
            expect(order.items.length).toBe(1);
            expect(order.total).toBe(42.00);
            expect(store.getOrders().length).toBe(1);
        });

        it('should throw an error when creating an order with an empty cart', () => {
            expect(() => store.createOrder(mockCustomer)).toThrow('Cannot create an order with an empty cart.');
        });
        
        it('should mark a discount code as used after an order is created', () => {
            store.addToCart(store.getProducts()[0].id, 1);
            store.applyDiscount('SAVE15');
            store.createOrder(mockCustomer);
            
            const discount = store.getAdminStats().discountCodes.find(d => d.code === 'SAVE15');
            expect(discount?.isUsed).toBe(true);
            
            // Try to use it again
            store.clearCart();
            store.addToCart(store.getProducts()[0].id, 1);
            expect(() => store.applyDiscount('SAVE15')).toThrow('Invalid or used discount code.');
        });

        it('should retrieve a specific order by ID', () => {
            store.addToCart(store.getProducts()[0].id, 1);
            const { order: createdOrder } = store.createOrder(mockCustomer);

            const fetchedOrder = store.getOrderById(createdOrder.id);
            expect(fetchedOrder).toEqual(createdOrder);
        });

         it('should return null for a non-existent order ID', () => {
            const fetchedOrder = store.getOrderById('non-existent-id');
            expect(fetchedOrder).toBeNull();
        });
    });

    describe('Admin Stats', () => {
        it('should calculate admin stats correctly', () => {
            // Order 1
            store.addToCart(store.getProducts()[0].id, 1); // 42.00
            store.createOrder(mockCustomer);
            store.clearCart();
            
            // Order 2 (with discount)
            store.addToCart(store.getProducts()[1].id, 2); // 55.00 * 2 = 110.00
            store.applyDiscount('SAVE15');
            store.createOrder(mockCustomer);
            store.clearCart();

            const stats = store.getAdminStats();
            expect(stats.itemCount).toBe(3); // 1 + 2
            expect(stats.totalAmount).toBeCloseTo(42.00 + (110.00 * 0.85));
            expect(stats.totalDiscountAmount).toBeCloseTo(110.00 * 0.15);
            expect(stats.discountCodes.find(d => d.code === 'SAVE15')?.isUsed).toBe(true);
        });
    });
});
