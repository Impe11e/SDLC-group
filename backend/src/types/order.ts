import type { CartItem } from './cart.js';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CARD_ON_DELIVERY';

export interface CreateOrderDTO {
    fullName: string;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
}

export interface OrderItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    userId: number;
    fullName: string;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    status: string;
    createdAt: Date;
    items: OrderItem[];
}

export interface IOrderTransaction {
    lockCartItems(userId: number): Promise<CartItem[]>;
    createOrder(userId: number, dto: CreateOrderDTO, totalAmount: number): Promise<number>;
    addOrderItems(orderId: number, items: CartItem[]): Promise<void>;
    decreaseStock(items: CartItem[]): Promise<void>;
    clearCart(userId: number): Promise<void>;
}

export interface IOrderRepository {
    withTransaction<T>(work: (tx: IOrderTransaction) => Promise<T>): Promise<T>;
    findByUserId(userId: number): Promise<Order[]>;
    findById(userId: number, orderId: number): Promise<Order | null>;
}
